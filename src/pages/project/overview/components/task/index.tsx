import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './index.less';
import { ColumnsInfo, ProgressInfo, TaskInfo } from '@/pages/project/overview/data';
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import StatusMenu from '@/pages/project/overview/components/task/StatusMenu';
import { Avatar, message, Modal, Tooltip } from 'antd';
import { deleteTask, updateTask } from '@/pages/project/overview/service';
import { connect, Dispatch } from 'umi';
import PriorityMenu from '@/pages/project/overview/components/task/PriorityMenu';

interface TaskProps {
  task: TaskInfo;
  index: number;
  dispatch: Dispatch;
  projectId: number;
  listId: number;
  dataSource: ColumnsInfo[]
  progress:ProgressInfo
}

const Task: React.FC<TaskProps> = props => {
  const [isHover, setHover] = useState(false);

  const deleteHandler = async e => {
    e.stopPropagation();
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
        <CloseCircleOutlined style={{ color: 'red' }} onClick={deleteHandler} />
      );
    } else {
      return null;
    }
  };

  const clickHandler = () => {
    props.dispatch({
      type: 'overview/setCurrentTask',
      payload: props.task,
    });
  };

  const saveStatusHandle = async (key) => {
    if (key !== props.task.status) {
      const res = await updateTask(props.projectId, props.task.id, key, 'status');
      if (res.status !== 1) {
        return message.warning(res.error);
      }
      let finish = props.progress.finish;
      key === 1 ? (finish += 1) : (finish -= 1);
      props.dispatch({
        type: 'overview/setProgress',
        payload: {
          ...props.progress,
          finish,
        },
      });
      const newData = [...props.dataSource];
      for (let i = 0; i < newData.length; i++) {
        let targetRow = newData[i].taskList.find(
          item => item.id === props.task.id,
        );
        if (targetRow) {
          targetRow.status = key;
          break;
        }
      }
      props.dispatch({
        type: 'overview/setColumnsList',
        payload: newData,
      });
    }
  };

  const savePriorityHandle = async (key) => {
    if (key !== props.task.priority) {
      const res = await updateTask(props.projectId, props.task.id, key, 'priority');
      if (res.status !== 1) {
        return message.warning(res.error);
      }
      const newData = [...props.dataSource];
      for (let i = 0; i < newData.length; i++) {
        let targetRow = newData[i].taskList.find(
          item => item.id === props.task.id,
        );
        if (targetRow) {
          targetRow.priority = key;
          break;
        }
      }
      props.dispatch({
        type: 'overview/setColumnsList',
        payload: newData,
      });
    }
  };


  return (
    <Draggable
      draggableId={props.listId.toString() + props.task.id.toString()}
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
          onClick={clickHandler}
        >
          <div className={styles.header}>
            <div className={styles.title}>{props.task.title}</div>
            {renderIcon()}
          </div>
          <div className={styles.bottom}>
            <StatusMenu onSave={saveStatusHandle} value={props.task.status} />
            <div className={styles.bottomRight}>
              <div style={{ marginRight: 5 }}>
                <PriorityMenu onSave={savePriorityHandle} value={props.task.priority}/>
              </div>
              <div onClick={e => e.stopPropagation()}>
                <Tooltip title={props.task.creator.cname}>
                  <Avatar className={styles.avatar}>
                    {props.task.creator.cname.substring(
                      props.task.creator.cname.length - 2,
                      props.task.creator.cname.length,
                    )}
                  </Avatar>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const mapStateToProps = state => {
  return {
    dataSource: state.overview.columnsList,
    trigger: state.overview.trigger,
    progress: state.overview.progress,
    currentTask: state.overview.currentTask,
  };
};

export default connect(mapStateToProps)(Task);
