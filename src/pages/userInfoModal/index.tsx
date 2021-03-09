import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';

interface UserInfoModalProps {
  visible: boolean;
  cancelHandler: any;
  submitHandler: any;
  optionType: 'create' | 'update';
  value: Partial<UserInfo>;
}

const UserInfoModal: React.FC<UserInfoModalProps> = props => {
  const [roleList, setRoleList] = useState<Partial<RoleInfo>[]>([]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (props.visible && props.optionType == 'update') {
      form.setFieldsValue(props.value);
    } else {
      form.resetFields();
    }
  }, [props.visible]);

  const [form] = Form.useForm();

  const parseRoleOption = () => {
    return roleList.map((item, index) => {
      return (
        <Select.Option key={index} value={item.id}>
          {item.name}
        </Select.Option>
      );
    });
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.cancelHandler}
      onOk={form.submit}
    >
      <Form form={form} onFinish={props.submitHandler}>
        <Form.Item
          name={'userName'}
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input autoComplete={'off'} placeholder={'请输入用户名'} />
        </Form.Item>
        <Form.Item
          name={'password'}
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password autoComplete={'off'} placeholder={'请输入密码'} />
        </Form.Item>
        <Form.Item name={'email'}>
          <Input autoComplete={'off'} placeholder={'请输入email'} />
        </Form.Item>
        <Form.Item name={'phone'}>
          <Input autoComplete={'off'} placeholder={'请输入手机号码'} />
        </Form.Item>
        <Form.Item name={'role'}>
          <Select mode="tags" placeholder="请分配角色">
            {parseRoleOption()}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
