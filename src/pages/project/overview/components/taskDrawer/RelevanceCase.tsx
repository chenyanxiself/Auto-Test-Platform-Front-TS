import React, { useState } from 'react';
import { Button, List, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';

interface RelevanceCaseProps {
  value?: any;
  onChange?: any;
  onSave?: any;
}

const RelevanceCase: React.FC<RelevanceCaseProps> = props => {
  const [visible, setVisible] = useState(false);

  const viewHandler = (caseId, projectId) => {
    history.push(`/project/${projectId}/case/${caseId}/detail`);
  };

  return (
    <div>
      {props.value && props.value.length > 0 ? (
        <List
          size={'small'}
          rowKey={'id'}
          dataSource={props.value}
          renderItem={item => (
            <List.Item
              actions={[
                <Button
                  size={'small'}
                  type={'primary'}
                  // @ts-ignore
                  onClick={() => viewHandler(item.id, item.project_id)}
                >
                  查看
                </Button>,
                <Button size={'small'} type={'primary'} danger={true}>
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta
                // @ts-ignore
                title={item.name}
              />
            </List.Item>
          )}
        />
      ) : null}
      <Button
        type="dashed"
        style={{ width: '100%', marginBottom: 8 }}
        onClick={() => setVisible(true)}
      >
        <PlusOutlined />
        添加
      </Button>
      <Modal visible={visible} onCancel={() => setVisible(false)}></Modal>
    </div>
  );
};

export default RelevanceCase;
