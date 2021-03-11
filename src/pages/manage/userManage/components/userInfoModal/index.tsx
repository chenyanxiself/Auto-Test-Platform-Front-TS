import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { getAllRoleList } from '../../service';

interface UserInfoModalProps {
  visible: boolean;
  cancelHandler: any;
  submitHandler: any;
  optionType: 'create' | 'update';
  value: Partial<UserInfo>;
  rollList: Partial<RoleInfo>[];
}

const UserInfoModal: React.FC<UserInfoModalProps> = props => {
  useEffect(() => {
    if (props.visible) {
      switch (props.optionType) {
        case 'update':
          form.setFieldsValue(props.value);
          break;
        case 'create':
          form.resetFields();
      }
    }
  }, [props.visible]);

  const [form] = Form.useForm();

  const parseRoleOption = () => {
    return props.rollList.map((item, index) => {
      return (
        <Select.Option key={index} value={item.id}>
          {item.name}
        </Select.Option>
      );
    });
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const validatorUserName = (rule, value) => {
    if (/^ *$/.test(value)) {
      return Promise.reject('用户名不能为空!');
    } else if (!value) {
      return Promise.reject('请输入用户名!');
    } else if (/^[a-zA-Z0-9_]{4,12}$/.test(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject('用户名为4到12位,英文、数字、下划线!');
    }
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.cancelHandler}
      onOk={form.submit}
      title={props.optionType == 'update' ? '更新用户' : '新增用户'}
      forceRender={true}
    >
      <Form form={form} onFinish={props.submitHandler} {...layout}>
        <Form.Item
          name={'name'}
          label={'用户名'}
          required={true}
          rules={[{ validator: validatorUserName }]}
        >
          <Input
            autoComplete={'off'}
            placeholder={'请输入用户名'}
            disabled={props.optionType == 'update'}
          />
        </Form.Item>
        {props.optionType == 'update' ? null : (
          <Form.Item
            name={'password'}
            label={'密码'}
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password autoComplete={'off'} placeholder={'请输入密码'} />
          </Form.Item>
        )}
        <Form.Item
          name={'cname'}
          label={'昵称'}
          rules={[{ required: true, message: '请输入用户昵称!' }]}
        >
          <Input autoComplete={'off'} placeholder={'请输入用户昵称'} />
        </Form.Item>
        <Form.Item name={'email'} label={'email'}>
          <Input autoComplete={'off'} placeholder={'请输入email'} />
        </Form.Item>
        <Form.Item name={'phone'} label={'手机号'}>
          <Input autoComplete={'off'} placeholder={'请输入手机号码'} />
        </Form.Item>
        <Form.Item name={'roleList'} label={'角色'}>
          <Select mode="multiple" placeholder="请分配角色" allowClear={true}>
            {parseRoleOption()}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
