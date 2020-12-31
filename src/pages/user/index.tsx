import React, { Component, useEffect, useState } from 'react';
import { Form, Input, Button, Card, Modal, message, PageHeader } from 'antd';
import styles from './index.less';
import { connect } from 'umi';
import { updateUserInfo, updatePassword } from './service';
import { GlobalModelState } from '@/models/global';
import { Dispatch } from '@@/plugin-dva/connect';


interface UserProps {
  user: GlobalModelState
  dispatch: Dispatch;

  [name: string]: any
}

const User: React.FC<UserProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const onFinish = async (value) => {
    const res = await updateUserInfo(value);
    if (res.status === 1) {
      message.success('修改成功');
      props.dispatch({
        type: 'global/setCurrentUser',
        payload: {
          ...props.user,
          cname: value.cname,
          email: value.email,
          phone: value.phone,
        },
      });
    } else {
      message.warning(res.error);
    }
  };

  const changePwdOnFinish = async (value) => {
    const res = await updatePassword(value.oldPassword, value.newPassword);
    if (res.status === 1) {
      message.success('修改成功');
      setVisible(false);
    } else {
      message.warning(res.error);
    }
  };

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 7 },
  };
  const modalFormItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 9 },
  };

  useEffect(() => {
    form.setFieldsValue({
      name: props.user.name,
      cname: props.user.cname,
      email: props.user.email,
      phone: props.user.phone,
    });
  }, []);

  return (
    <div>
      <Card
        title={
          <PageHeader
            onBack={() => props.history.goBack()}
            title="个人信息"
            subTitle="修改个人信息"
          />
        }
        bordered={false}
      >
        <Form
          {...formItemLayout}
          labelAlign={'left'}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label={<span className={styles.label}>用户名</span>}
            name={'name'}
            rules={[{
              required: true,
              message: '必填',
            }]}
          >
            <Input disabled={true} autoComplete='off' />
          </Form.Item>
          <Form.Item
            label={<span className={styles.label}>用户昵称</span>}
            name={'cname'}
            rules={[{
              required: true,
              message: '必填',
            }]}
          >
            <Input autoComplete='off' />
          </Form.Item>
          <Form.Item
            label={<span className={styles.label}>邮箱</span>}
            name={'email'}
          >
            <Input autoComplete='off' />
          </Form.Item>
          <Form.Item
            label={<span className={styles.label}>手机</span>}
            name={'phone'}
          >
            <Input autoComplete='off' />
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 4 }}
          >
            <Button
              onClick={() => setVisible(true)}
              type="dashed"
            >修改密码</Button>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 7, offset: 4 }}>
            <Button type="primary" htmlType="submit">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        visible={visible}
        onCancel={() => {
          passwordForm.resetFields()
          setVisible(false)
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          {...modalFormItemLayout}
          labelAlign={'left'}
          onFinish={changePwdOnFinish}
        >
          <Form.Item
            label={'原密码'}
            name={'oldPassword'}
            rules={[{
              required: true,
              message: '必填',
            }]}
          >
            <Input.Password placeholder={'请输入原密码'} />
          </Form.Item>
          <Form.Item
            label={'新密码'}
            name={'newPassword'}
            rules={[{
              required: true,
              message: '必填',
            }, {
              min: 5,
              message: '至少5个字符',
            }]}
          >
            <Input.Password placeholder={'请输入新密码'} />
          </Form.Item>
          <Form.Item
            label={'确认密码'}
            name={'ackPassword'}
            required={true}
            rules={[{
              validator: (_, value) => {
                const newPassword = passwordForm.getFieldValue('newPassword');
                if (value !== newPassword) {
                  return Promise.reject('两次输入的密码不一致');
                } else {
                  return Promise.resolve();
                }
              },
            }]}
          >
            <Input.Password placeholder={'确认密码'} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 7, offset: 7 }}>
            <Button type="primary" htmlType="submit">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.global,
  };
};
export default connect(mapStateToProps)(User);
