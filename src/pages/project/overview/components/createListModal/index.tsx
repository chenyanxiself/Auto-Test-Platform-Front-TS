import React, { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';

interface CreateListModalProps{
  visible :boolean
  cancelHandler:()=>void
  finishHandler:(value:any)=>void
}

const CreateListModal:React.FC<CreateListModalProps>=(props)=>{
  const [form] = Form.useForm()

  useEffect(()=>{
    form.resetFields()
  },[props.visible])

  return (
    <Modal
      title={'创建任务栏'}
      visible={props.visible}
      footer={false}
      onCancel={props.cancelHandler}
      forceRender={true}
    >
      <Form
        form={form}
        onFinish={props.finishHandler}
      >
        <Form.Item
          label={'任务栏名'}
          name={'title'}
          rules={[{ required: true, message: '必填' }]}
          wrapperCol={{ span: 14 }}
          labelCol={{ span: 5 }}
        >
          <Input placeholder={'请输入任务栏名'} autoComplete={'off'} />
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 5 }}
        >
          <Button htmlType={'submit'} type={'primary'}>创建</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateListModal
