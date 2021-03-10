import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, Tree } from 'antd';

interface RoleInfoModalProps {
  visible: boolean;
  cancelHandler: any;
  submitHandler: any;
  optionType: 'create' | 'update';
  value: Partial<RoleInfo>;
  menuList: Partial<MenuInfo>[];
}

const RoleInfoModal: React.FC<RoleInfoModalProps> = props => {
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    let menuListCp: Partial<MenuInfo>[] = props.menuList.map(item => {
      return {
        ...item,
        key: item.id,
        title: item.name,
      };
    });
    let rootMenus = menuListCp.filter(item => item.parentId == null);
    const childMenus = menuListCp.filter(item => item.parentId != null);
    childMenus.forEach(citem => {
      let target_menu = rootMenus.find(item => item.id == citem.parentId);
      if (target_menu.children instanceof Array) {
        target_menu.children.push(citem);
      } else {
        target_menu.children = [citem];
      }
    });
    setTreeData(rootMenus);
  }, [props.menuList]);

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

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.cancelHandler}
      onOk={form.submit}
      title={props.optionType == 'update' ? '更新角色' : '新增角色'}
      forceRender={true}
    >
      <Form form={form} onFinish={props.submitHandler} {...layout}>
        <Form.Item
          name={'name'}
          label={'角色名'}
          rules={[{ required: true, message: '请输入角色名!' }]}
        >
          <Input autoComplete={'off'} placeholder={'请输入角色名'} />
        </Form.Item>
        <Form.Item name={'menuList'} label={'权限'}>
          <Tree checkable treeData={treeData} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleInfoModal;
