import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

interface CreateSuiteModalProps {
  visible: boolean
  cancelHandler: () => void
  finishHandler: (value) => void
}

const CreateSuiteModal: React.FC<CreateSuiteModalProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [props.visible]);


  return <Modal
    visible={props.visible}
    onCancel={props.cancelHandler}
    title={'新建测试集'}
    onOk={() => form.submit()}
    forceRender={true}
  >
    <Form
      form={form}
      onFinish={props.finishHandler}
    >
      <Form.Item
        label={'名称'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        rules={[{ required: true, message: '必填' }]}
        name={'suiteName'}
      >
        <Input placeholder={'请输入测试集名'} autoComplete={'off'} />
      </Form.Item>
    </Form>
  </Modal>;
};

export default CreateSuiteModal;
