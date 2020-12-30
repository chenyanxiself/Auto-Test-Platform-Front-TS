import React, { useRef, useState } from 'react';
import { Avatar, Tooltip, Button, Modal } from 'antd';
import MemberTransfer from '@/pages/project/components/projectMember/MemberTransfer';
import { PlusOutlined } from '@ant-design/icons';
import styles from '@/pages/project/components/projectMember/index.less';

interface ProjectMemberProps {
  value?: any
  onChange?: any
  onSave?: (v: any) => void
}

const ProjectMember: React.FC<ProjectMemberProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const transferRef = useRef();
  const okHandler = () => {
    // @ts-ignore
    const value = transferRef.current.getValue();
    if (props.onSave){
      props.onSave([...value])
    }else {
      props.onChange(
        [...value],
      );
    }
    setIsModalVisible(false);
  };
  const memberValue = props.value ? props.value : [];
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      {memberValue.map((item, index) => {
        const briefName = item.cname.substring(item.cname.length - 2, item.cname.length);
        return (<Tooltip title={item.cname} key={index + 1}>
          <Avatar
            className={styles.avatar}
          >{briefName}</Avatar>
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
        <MemberTransfer selectedMember={memberValue} cref={transferRef} />
      </Modal>
    </div>
  );
};

export default ProjectMember;
