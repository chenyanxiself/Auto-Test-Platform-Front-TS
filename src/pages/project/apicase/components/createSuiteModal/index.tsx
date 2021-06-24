import React from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { createApiCaseSuite } from '@/pages/project/apicase/service';

interface CreateSuiteModalProps {
  visible: boolean;
  onCancel: any;
  projectId: number;
  onAfterCreate: any;
}

const CreateSuiteModal: React.FC<CreateSuiteModalProps> = props => {
  const [form] = Form.useForm();
  const finishHandler = async value => {
    const res = await createApiCaseSuite(props.projectId, value['name']);
    if (res.status === 1) {
      message.success('创建成功');
      props.onAfterCreate();
      form.resetFields();
    } else {
      message.warning(res.error);
    }
  };

  return (
    <Modal
      title={'创建测试集'}
      visible={props.visible}
      footer={false}
      onCancel={() => {
        props.onCancel();
        form.resetFields();
      }}
      forceRender={true}
    >
      <Form onFinish={finishHandler} form={form}>
        <Form.Item
          label={'集合名'}
          name={'name'}
          rules={[{ required: true, message: '必填' }]}
          wrapperCol={{ span: 14 }}
          labelCol={{ span: 5 }}
        >
          <Input placeholder={'请输入集合名'} autoComplete={'off'} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 5 }}>
          <Button htmlType={'submit'} type={'primary'}>
            创建
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSuiteModal;
