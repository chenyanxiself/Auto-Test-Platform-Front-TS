import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './index.less';
import { ColumnsInfo } from '@/pages/project/overview/data';
import List from '../taskList';
import { CloseCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal } from 'antd';
import { connect, Dispatch } from 'umi';
import { deleteTaskList, updateList, createTask } from '@/pages/project/overview/service';
import CreateTaskModal from '@/pages/project/overview/components/createTaskModal';

interface ColumnsProps {
  columns: ColumnsInfo
  index: number
  dispatch: Dispatch
  projectId: number
  createTaskVisible: boolean
}

const Columns: React.FC<ColumnsProps> = (props) => {
  const [isTitleEdit, setTitkeEdit] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTitleValue(props.columns.title);
  }, [props.columns.title]);

  const inputRef = useRef();

  useEffect(() => {
    if (isTitleEdit) {
      // @ts-ignore
      inputRef.current.focus();
    }
  }, [isTitleEdit]);

  const saveTitle = async (e) => {
    const newValue = e.target.value;
    const res = await updateList(props.projectId, props.columns.id, newValue);
    if (res.status == 1) {
      setTitleValue(newValue);
      setTitkeEdit(false);
    } else {
      message.warning(res.error);
    }

  };

  const deleteHandler = async () => {
    Modal.confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        let res = await deleteTaskList(props.columns.id, props.projectId);
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


  const renderTitle = () => {
    if (isTitleEdit) {
      return (
        <Input
          className={styles.title}
          defaultValue={titleValue}
          onBlur={saveTitle}
          onPressEnter={saveTitle}
          ref={inputRef}
        />
      );
    } else {
      return (
        <span
          className={styles.title}
          onClick={() => setTitkeEdit(true)}
        >
          {titleValue}
        </span>
      );
    }
  };
  return (
    <Draggable draggableId={props.columns.title} index={props.index}>
      {
        (provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={styles.column}
            style={{
              ...provided.draggableProps.style,
              backgroundColor: snapshot.isDragging ? 'rgba(5,122,255,.1)' : null,
            }}
          >
            <div className={styles.header}>
              {
                renderTitle()
              }
              <CloseCircleOutlined
                style={{ color: 'red' }}
                onClick={deleteHandler}
              />
            </div>
            <div
              className={styles.plus}
              onClick={() => {
                props.dispatch({
                  type:'overview/setCreateTaskModal',
                  payload:{
                    visible:true,
                    listId:props.columns.id
                  }
                })
              }}
            >
              <PlusOutlined style={{ fontSize: 20 }} />
            </div>
            <List
              taskList={props.columns.taskList}
              title={props.columns.title}
              projectId={props.projectId}
            />
          </div>
        )
      }
    </Draggable>
  );
};
const mapStateToProps = state => {
  return {
    // dataSource: state.overview.columnsList,
    // trigger: state.overview.trigger,
    // progress: state.overview.progress,
    createTaskVisible: state.overview.createTaskVisible,
  };
};
export default connect(mapStateToProps)(Columns);
