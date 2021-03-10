import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Tag, Divider, Modal } from 'antd';
import styles from './index.less';

interface UserManageProps {}

const UserManage: React.FC<UserManageProps> = props => {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    setUserData([{ id: 1, name: 'eric', role: '管理员' }]);
  }, []);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '角色',
      key: 'role',
      dataIndex: 'role',
      align: 'center',
      render: item => {
        let color = 'green';
        if (item === '管理员') {
          color = 'geekblue';
        }
        return <Tag color={color}>{item.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: '15%',
      align: 'center',
      render: (text, record) => (
        <Button size={'small'} type={'dashed'}>
          修改
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.header}>
        <Button>添加用户</Button>
      </div>
      <Divider />
      <Table
        // @ts-ignore
        columns={columns}
        dataSource={userData}
        rowKey={'id'}
        showHeader={false}
        bordered={true}
        size={'small'}
      />
      <Modal></Modal>
      <Modal></Modal>
    </div>
  );
};

export default UserManage;
