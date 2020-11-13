import React, { useRef, useState } from 'react';
import { Avatar, Tooltip, Button, Modal } from 'antd';
import MemberTransfer from '@/pages/project/components/projectMember/MemberTransfer';
import { PlusOutlined } from '@ant-design/icons';
import styles from '@/pages/project/components/projectMember/index.less';

const ProjectMember = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const transferRef = useRef()
  const okHandler = () => {
    // @ts-ignore
    const value = transferRef.current.getValue()
    props.onChange(
      [...value],
    );
    setIsModalVisible(false);
  };
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      {props.value.map((item, index) => {
        return (<Tooltip title={item.cname} key={index + 1}>
          <Avatar
            className={styles.avatar}
          >{item.briefName}</Avatar>
        </Tooltip>);
      })}
      <Button
        style={{ float: 'left' }}
        shape='circle'
        icon={<PlusOutlined />}
        size='small'
        onClick={() => setIsModalVisible(true)}
      />
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        centered={true}
        destroyOnClose={true}
        onOk={okHandler}
      >
        <MemberTransfer selectedMember={props.value} cref={transferRef}/>
      </Modal>
    </div>
  );
};

export default ProjectMember;
