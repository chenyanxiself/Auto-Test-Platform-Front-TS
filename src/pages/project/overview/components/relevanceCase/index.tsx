import React, { useState } from 'react';
import { Button, Card, List, message, Modal, Space, Table } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import CreateRelvanceModal from '@/pages/project/overview/components/relevanceCase/CreateRelvanceModal';
import { priorityEnum } from '@/utils/enums';

interface RelevanceCaseProps {
  value?: any;
  onChange?: any;
  onSave?: any;
  projectId: number;
}

const RelevanceCase: React.FC<RelevanceCaseProps> = props => {
  const [visible, setVisible] = useState(false);

  const finishHandler = async selectedCases => {
    await props.onSave(selectedCases, 'update');
  };

  const viewHandler = (caseId, projectId) => {
    history.push(`/project/${projectId}/case/${caseId}/detail`);
  };

  const columns = [
    {
      title: '名称',
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: text => {
        return priorityEnum[text];
      },
    },
    // {
    //   title: '所属模块',
    //   ellipsis: true,
    //   dataIndex: 'moduleName',
    // },
    {
      title: '操作',
      width: '20%',
      render: item => (
        <Space>
          <Button
            size={'small'}
            type={'primary'}
            // @ts-ignore
            onClick={() => viewHandler(item.id, item.project_id)}
          >
            查看
          </Button>
          ,
          <Button
            size={'small'}
            type={'primary'}
            danger={true}
            onClick={() => deleteHandler(item)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const deleteHandler = async record => {
    Modal.confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        await props.onSave(
          props.value.filter(x => x.id != record.id),
          'delete',
        );
      },
    });
  };

  return (
    <div>
      {props.value && props.value.length < 1 ? (
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          onClick={() => setVisible(true)}
        >
          <PlusOutlined />
          添加
        </Button>
      ) : (
        <Table
          dataSource={props.value}
          columns={columns}
          rowKey={'id'}
          pagination={false}
          showHeader={false}
        />
      )}

      <CreateRelvanceModal
        visible={visible}
        cancelHandler={() => setVisible(false)}
        finishHandler={finishHandler}
        projectId={props.projectId}
        selectedRelevanceCases={props.value}
      />
    </div>
  );
};

export default RelevanceCase;
