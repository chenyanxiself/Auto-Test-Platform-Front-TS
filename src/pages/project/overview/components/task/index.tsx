import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './index.less';
import { TaskInfo } from '@/pages/project/overview/data';
import { CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import StatusMenu from '@/pages/project/overview/components/task/StatusMenu';
import { Avatar, message, Modal, Tooltip } from 'antd';
import { deleteTask } from '@/pages/project/overview/service';
import {connect,Dispatch} from 'umi';

interface TaskProps {
  task: TaskInfo
  index: number
  dispatch:Dispatch
  projectId:number
}


const Task: React.FC<TaskProps> = (props) => {
  const [isHover, setHover] = useState(false);

  const deleteHandler = async () => {
    Modal.confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        let res = await deleteTask(props.task.id, props.projectId);
        if (res.status === 1) {
          message.success('删除成功');
          props.dispatch({
            type: 'overview/setTrigger',
          });
        } else {
          message.warning(res.error);
          return Promise.reject(res.error);
        }
      },
    });
  };

  const renderIcon = () => {
    if (isHover) {
      return (
        <CloseCircleOutlined
          style={{ color: 'red' }}
          onClick={deleteHandler}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <Draggable
      draggableId={props.task.id.toString()}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.main}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className={styles.header}>
            <div className={styles.title}>
              {props.task.title}
            </div>
            {renderIcon()}
          </div>
          <div className={styles.bottom}>
            <StatusMenu row={props.task} />
            <Tooltip title={props.task.creator.cname}>
              <Avatar
                className={styles.avatar}
              >
                {props.task.creator.cname.substring(props.task.creator.cname.length - 2, props.task.creator.cname.length)}
              </Avatar>
            </Tooltip>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default connect()(Task);