import React, { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';

interface CreateTaskModalProps {
  visible: boolean
  cancelHandler: () => void
  finishHandler: (value: any) => void
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [props.visible]);

  const okHandler = () => {
    form.submit();
  };

  const submitHandler = (value) => {
    props.finishHandler(value);
  };

  return (
    <Modal
      title={<div style={{ textAlign: 'center' }}>创建任务</div>}
      visible={props.visible}
      onCancel={props.cancelHandler}
      forceRender={true}
      okText={'创建任务'}
      onOk={okHandler}
    >
      <Form
        form={form}
        onFinish={submitHandler}
        layout="vertical"
      >
        <Form.Item
          name={'taskTitle'}
          rules={[{ required: true, message: '必填' }]}
        >
          <Input placeholder={'请输入任务标题(必填)'} autoComplete={'off'} />
        </Form.Item>
        <Form.Item
          name={'description'}
          label={'任务描述'}
        >
          <Input.TextArea
            placeholder={'请输入任务描述'}
            autoComplete={'off'}
            autoSize={{ minRows: 4, maxRows: 6 }}
            allowClear={true}
            maxLength={200}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
