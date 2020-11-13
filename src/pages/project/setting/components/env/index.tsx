import React, { useEffect, useState } from 'react';
import { Table, Input, Form, Button, message, Modal } from 'antd';
import { getEnvByProjectId, updateProjectEnv, createProjectEnv, deleteProjectEnv } from '@/pages/project/service';

interface EnvRecord {
  id?: number
}

const EditableCell = ({
                        editing,
                        dataIndex,
                        title,
                        inputType,
                        record,
                        index,
                        children,
                        ...restProps
                      }) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `必填!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Env = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentEnv, setCurrentEnv] = useState<EnvRecord>({});
  const [form] = Form.useForm();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getEnvByProjectId(props.projectId);
    if (res.status === 1) {
      setDataSource(res.data);
    } else {
      message.warning(res.error);
    }
  };

  const edit = record => {
    form.setFieldsValue({
      name: '',
      host: '',
      ...record,
    });
    setCurrentEnv(record);
  };

  const save = async value => {
    try {
      const row = await form.validateFields();
      const res = await updateProjectEnv(props.projectId, value.id, row.name, row.host);
      if (res.status === 1) {
        message.success('修改成功');
        setCurrentEnv({});
        getData();
      } else {
        message.warning(res.error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = async (record) => {
    const res = await deleteProjectEnv(props.projectId, record.id);
    if (res.status === 1) {
      message.success('删除成功');
      setCurrentEnv({});
      getData();
    } else {
      message.warning(res.error);
    }
  };

  const mergedColumns = () => {
    return columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: currentEnv.id === record.id,
        }),
      };
    });
  };
  const onFinish = async value => {
    const res = await createProjectEnv(props.projectId, value.envName, value.envHost);
    if (res.status === 1) {
      message.success('新增成功');
      setIsModalVisible(false);
      getData();
    } else {
      message.warning(res.error);
    }
  };

  const columns = [
    {
      title: '环境名',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: '域名',
      dataIndex: 'host',
      width: '40%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '30%',
      render: (_, record) => {
        const editable = currentEnv.id === record.id;
        return editable ? (
          <span>
                            <Button
                              onClick={() => save(record)}
                              style={{
                                marginRight: 8,
                              }}
                              ghost={true}
                              type={'primary'}
                              size={'small'}
                            >
                              保存
                            </Button>
                            <Button
                              onClick={() => setCurrentEnv({})}
                              ghost={true}
                              type={'primary'}
                              size={'small'}
                              style={{
                                marginRight: 8,
                              }}
                            >取消</Button>
                            <Button
                              onClick={() => onDelete(record)}
                              type={'primary'}
                              size={'small'}
                              danger={true}
                            >删除</Button>
                        </span>
        ) : (
          <Button
            onClick={() => edit(record)}
            ghost={true}
            type={'primary'}
            size={'small'}
            disabled={!!currentEnv.id}
          >
            修改
          </Button>
        );
      },
    },
  ];
  return (
    <React.Fragment>
      <Button
        onClick={() => {
          setIsModalVisible(true);
        }}
        type={'primary'}
        style={{ marginBottom: 15 }}
      >添加</Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={dataSource}
          columns={mergedColumns()}
          rowClassName="editable-row"
          pagination={false}
          rowKey={'id'}
          size={'small'}
        />

      </Form>
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        title='新增环境'
        destroyOnClose={true}
        // centered={true}
        footer={false}
      >
        <Form
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            name={'envName'}
            label={'环境名称'}
            rules={[{ required: true, message: '必填' }]}
          >
            <Input placeholder={'请输入环境名称'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            name={'envHost'}
            label={'环境域名'}
            rules={[{ required: true, message: '必填' }]}
          >
            <Input placeholder={'请输入环境域名'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button htmlType={'submit'} type={'primary'}>提交</Button>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Env;
