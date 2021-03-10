import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Tag, Divider, Modal, message, Space } from 'antd';
import styles from './index.less';
import { getAllRoleList, getAllMenu } from '@/pages/manage/roleManage/service';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import RoleInfoModal from '@/pages/manage/roleManage/components/roleInfoModal';

interface UserManageProps {
  [name: string]: any;
}

const UserManage: React.FC<UserManageProps> = props => {
  const [roleData, setRoleData] = useState<Partial<RoleInfo>[]>([]);
  const [menuData, setMenuData] = useState<Partial<MenuInfo>[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [option, setOption] = useState<'create' | 'update'>('create');
  const [targetValue, setTargetValue] = useState<Partial<UserInfo>>({});

  const getRoleMenus = async () => {
    const [resRoll, resMenu]: any = await Promise.all([
      getAllRoleList(),
      getAllMenu(),
    ]);
    if (resRoll.status == 1 && resMenu.status == 1) {
      setRoleData(
        resRoll.data.map(item => ({
          id: item.id,
          name: item.role_name,
          menuList: item.menu_list,
        })),
      );
      setMenuData(
        resMenu.data.map(item => ({
          id: item.id,
          name: item.name,
          parentId: item.parent_id,
        })),
      );
    } else {
      message.warning(resRoll.error || resMenu.error);
    }
  };

  useEffect(() => {
    getRoleMenus();
  }, []);

  const modifyHandler = (record: RoleInfo) => {
    console.log(record);
    setOption('update');
    setTargetValue(record);
    setModalVisible(true);
  };

  const createHandler = () => {
    setOption('create');
    setModalVisible(true);
  };

  const columns = [
    {
      title: '角色',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      render: name => {
        let color = 'green';
        if (name === '管理员') {
          color = 'geekblue';
        }
        return <Tag color={color}>{name}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      align: 'center',
      render: (text, record) => (
        <Space>
          <Button
            size={'small'}
            type={'dashed'}
            onClick={() => modifyHandler(record)}
          >
            修改
          </Button>
          <Button
            size={'small'}
            type={'primary'}
            danger={true}
            onClick={() => deleteHandler(record)}
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
      onOk: async () => {},
    });
  };

  const submitHandler = async value => {
    console.log(value);
  };

  return (
    <div>
      <div className={styles.header}>
        <Button onClick={createHandler}>添加角色</Button>
      </div>
      <Divider style={{ marginTop: 12, marginBottom: 12 }} />
      <div className={styles.body}>
        <div className={styles.bodyLeft}>
          <Table
            // @ts-ignore
            columns={columns}
            dataSource={roleData}
            rowKey={'id'}
            showHeader={false}
            // bordered={true}
            size={'small'}
            pagination={false}
          />
        </div>
        <div className={styles.bodyRight}>teet</div>
      </div>
      <RoleInfoModal
        visible={modalVisible}
        cancelHandler={() => setModalVisible(false)}
        submitHandler={value => {
          submitHandler(value);
        }}
        optionType={option}
        value={targetValue}
        menuList={menuData}
      />
    </div>
  );
};

export default UserManage;
