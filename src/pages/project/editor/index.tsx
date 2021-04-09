import React, { useEffect, useState } from 'react';
import ProList from '@ant-design/pro-list';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import listIcon from '@/assert/listIcon.svg';
import {
  Space,
  Avatar,
  Card,
  Modal,
  message,
  Form,
  Input,
  Button,
  Select,
} from 'antd';
import {
  updateEditor,
  getAllEditor,
  createEditor,
} from '@/pages/project/editor/service';
import { editorType } from '@/utils/enums';
import { EditorInfo } from '@/pages/project/editor/data';
import { history, Link } from 'umi';

interface EditorProps {}

const Editor: React.FC<EditorProps> = props => {
  const params = useParams<any>();
  const projectId = params.id;
  const [visible, setVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [createConfirmLoading, setCreateConfirmLoading] = useState(false);
  const [currentEditor, setCurrentEditor] = useState<Partial<EditorInfo>>({});
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getAllEditor(projectId);
    if (res.status === 1) {
      const temp = res.data.map(item => {
        item.createTime = item.create_time;
        item.updateTime = item.update_time;
        return item;
      });
      setDataSource(temp);
    } else {
      message.warning(res.error);
    }
  };

  const deleteHandler = async record => {
    Modal.confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        let res = await updateEditor(record.id, projectId, null, null, 1);
        if (res.status === 1) {
          message.success('删除成功');
          getData();
        } else {
          message.warning(res.error);
          return Promise.reject(res.error);
        }
      },
    });
  };

  const column = {
    title: {
      dataIndex: 'title',
      render: (text, row, index, action) => (
        <Link to={`/project/${projectId}/editor/${row.id}/detail`}>{text}</Link>
      ),
    },
    avatar: {
      render: () => (
        <Avatar
          src={listIcon}
          size={'small'}
          style={{ lineHeight: 22, fontSize: 18, width: 22, height: 22 }}
        />
      ),
    },
    subTitle: {
      dataIndex: 'type',
      render: text => editorType[parseInt(text)],
    },
    content: {
      render: (_, row) => {
        return (
          <span>{`${row.updator} 更新于 ${new Date(
            +new Date(row.updateTime) + 8 * 3600 * 1000,
          )
            .toISOString()
            .replace(/T/g, ' ')
            .replace(/\.[\d]{3}Z/, '')}`}</span>
        );
      },
    },
    actions: {
      render: (text, row, index, action) => {
        return (
          <Space>
            <a
              onClick={() => {
                setCurrentEditor(row);
                setVisible(true);
              }}
            >
              重命名
            </a>
            <a onClick={() => deleteHandler(row)}>删除</a>
          </Space>
        );
      },
    },
  };

  const finishHandler = async record => {
    const title = record.newTitle;
    setConfirmLoading(true);
    let res = await updateEditor(
      currentEditor.id,
      projectId,
      title,
      null,
      null,
    );
    setConfirmLoading(false);
    if (res.status === 1) {
      message.success('修改成功');
      cancelHandler();
      getData();
    } else {
      message.warning(res.error);
    }
  };

  const createFinishHandler = async (record: Partial<EditorInfo>) => {
    setCreateConfirmLoading(true);
    let res = await createEditor(
      projectId,
      record.title,
      parseInt(record.type as string),
    );
    setCreateConfirmLoading(false);
    if (res.status === 1) {
      message.success('创建成功');
      history.push(`/project/${projectId}/editor/${res.data.id}/detail`);
    } else {
      message.warning(res.error);
    }
  };

  const cancelHandler = () => {
    setCurrentEditor({});
    form.resetFields();
    setVisible(false);
  };

  const createCancelHandler = () => {
    createForm.resetFields();
    setCreateVisible(false);
  };

  const renderSelect = () => {
    const optionList = [];
    for (const key of Object.keys(editorType)) {
      optionList.push(
        <Select.Option key={key} value={key}>
          {editorType[key]}
        </Select.Option>,
      );
    }
    return optionList;
  };

  const extra = (
    <Button onClick={() => setCreateVisible(true)} type={'primary'}>
      新建
    </Button>
  );
  return (
    <>
      <Card title={'图形编辑器'} bordered={false} extra={extra}>
        <ProList
          rowKey="id"
          dataSource={dataSource}
          // @ts-ignore
          metas={column}
        />
      </Card>
      <Modal
        title={'重命名编辑器'}
        visible={visible}
        onCancel={cancelHandler}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
        forceRender={true}
      >
        <Form form={form} onFinish={finishHandler}>
          <Form.Item
            label={'新编辑器名'}
            name={'newTitle'}
            rules={[{ required: true, message: '必填' }]}
            wrapperCol={{ span: 14 }}
            labelCol={{ span: 5 }}
          >
            <Input placeholder={'请输入编辑器名'} autoComplete={'off'} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={'新建编辑器'}
        visible={createVisible}
        onCancel={createCancelHandler}
        onOk={() => createForm.submit()}
        confirmLoading={createConfirmLoading}
        forceRender={true}
      >
        <Form form={createForm} onFinish={createFinishHandler}>
          <Form.Item
            label={'编辑器名'}
            name={'title'}
            rules={[{ required: true, message: '必填' }]}
            wrapperCol={{ span: 14 }}
            labelCol={{ span: 5 }}
          >
            <Input placeholder={'请输入编辑器名'} autoComplete={'off'} />
          </Form.Item>
          <Form.Item
            label={'类型'}
            name={'type'}
            rules={[{ required: true, message: '必填' }]}
            wrapperCol={{ span: 14 }}
            labelCol={{ span: 5 }}
          >
            <Select placeholder="请选择类型" allowClear={true}>
              {renderSelect()}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Editor;
