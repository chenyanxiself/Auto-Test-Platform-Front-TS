import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Tag, Divider, Modal, message, Space } from 'antd';
import styles from './index.less';
import UserInfoModal from '@/pages/manage/userManage/components/userInfoModal';
import {
  getAllRoleList,
  getAllUserRole,
  updateUser,
  createUser,
  deleteUser,
} from '@/pages/manage/userManage/service';
import { connect } from 'umi';
import { GlobalModelState } from '@/models/global';
import { Dispatch } from '@@/plugin-dva/connect';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface UserManageProps {
  user: GlobalModelState;
  dispatch: Dispatch;

  [name: string]: any;
}

const UserManage: React.FC<UserManageProps> = props => {
  const [userData, setUserData] = useState([]);
  const [roleData, setRoleData] = useState<Partial<RoleInfo>[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [option, setOption] = useState<'create' | 'update'>('create');
  const [targetValue, setTargetValue] = useState<Partial<UserInfo>>({});

  const getRoles = async () => {
    const [resRoll, resUser]: any = await Promise.all([
      getAllRoleList(),
      getAllUserRole(),
    ]);
    if (resRoll.status == 1 && resUser.status == 1) {
      setRoleData(
        resRoll.data.map(item => ({
          id: item.id,
          name: item.role_name,
        })),
      );
      setUserData(
        resUser.data.map(item => ({
          id: item.user_id,
          name: item.user_name,
          cname: item.user_cname,
          email: item.user_email,
          phone: item.user_phone,
          roleList: item.role_ids,
        })),
      );
    } else {
      message.warning(resRoll.error || resUser.error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const modifyHandler = (record: UserInfo) => {
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
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'cname',
      key: 'cname',
      align: 'center',
    },
    {
      title: '角色',
      key: 'roleList',
      dataIndex: 'roleList',
      align: 'center',
      render: ids => {
        let roleNames = [];
        ids.forEach(id => {
          let color = 'green';
          const roleName = roleData.find(item => item.id == id).name;
          if (roleName != undefined) {
            if (roleName === '管理员') {
              color = 'geekblue';
            }
            roleNames.push(
              <Tag color={color} key={id}>
                {roleName}
              </Tag>,
            );
          }
        });
        return roleNames;
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
      onOk: async () => {
        let res = await deleteUser(record);
        if (res.status === 1) {
          message.success('删除成功');
          const newUserData = userData.filter(item => item.id != record.id);
          setUserData(newUserData);
        } else {
          message.warning(res.error);
          return Promise.reject(res.error);
        }
      },
    });
  };

  const submitHandler = async value => {
    switch (option) {
      case 'create':
        const resCreate = await createUser(value);
        if (resCreate.status == 1) {
          message.success('新建成功');
          const temp = {
            ...value,
            id: resCreate.data,
            roleList: value.roleList ? value.roleList : [],
          };
          let newState = [...userData];
          newState.push(temp);
          setUserData(newState);
          setModalVisible(false);
        } else {
          message.warning(resCreate.error);
        }
        break;
      case 'update':
        let compareTargetValue = { ...targetValue };
        delete compareTargetValue.id;
        if (JSON.stringify(compareTargetValue) == JSON.stringify(value)) {
          setModalVisible(false);
          break;
        }
        const newUserInfo: UserInfo = { ...targetValue, ...value };
        const res = await updateUser(newUserInfo);
        if (res.status == 1) {
          message.success('更新成功');
          setModalVisible(false);
          let newUserData = [...userData];
          let temp = newUserData.find(x => x.id == newUserInfo.id);
          temp.cname = newUserInfo.cname;
          temp.phone = newUserInfo.phone;
          temp.email = newUserInfo.email;
          temp.roleList = newUserInfo.roleList;
          setUserData(newUserData);
          if (props.user.id == targetValue.id) {
            props.dispatch({
              type: 'global/setCurrentUser',
              payload: {
                ...props.user,
                ...newUserInfo,
              },
            });
          }
        } else {
          message.warning(res.error);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <Button onClick={createHandler}>添加用户</Button>
      </div>
      <Divider style={{ marginTop: 12, marginBottom: 12 }} />
      <Table
        // @ts-ignore
        columns={columns}
        dataSource={userData}
        rowKey={'id'}
        // showHeader={false}
        bordered={true}
        size={'small'}
      />
      <UserInfoModal
        visible={modalVisible}
        cancelHandler={() => setModalVisible(false)}
        submitHandler={value => {
          submitHandler(value);
        }}
        optionType={option}
        value={targetValue}
        rollList={roleData}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.global,
  };
};

export default connect(mapStateToProps)(UserManage);
