import React, { useEffect, useRef, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './index.less';
import { ColumnsInfo } from '@/pages/project/overview/data';
import List from '../taskList';
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';
import { connect, Dispatch } from 'umi';
import {
  deleteTaskList,
  updateList,
  createTask,
} from '@/pages/project/overview/service';

interface ColumnsProps {
  columns: ColumnsInfo;
  index: number;
  dispatch: Dispatch;
  projectId: number;
}

const Columns: React.FC<ColumnsProps> = props => {
  const [isTitleEdit, setTitkeEdit] = useState(false);
  const [titleValue, setTitleValue] = useState('');

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

  const saveTitle = async e => {
    const newValue = e.target.value;
    const res = await updateList(props.projectId, props.columns.id, newValue);
    if (res.status == 1) {
      setTitleValue(newValue);
      setTitkeEdit(false);
      message.success('修改成功');
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
  const [form] = Form.useForm();
  const createTaskModalHandler = () => {
    Modal.confirm({
      title: <div style={{ textAlign: 'center' }}>创建任务</div>,
      icon: null,
      okText: '确认创建',
      cancelText: '取消',
      maskClosable: false,
      width: 800,
      content: (
        <div className={styles.modalBody}>
          <Form form={form} layout="vertical">
            <Form.Item
              name={'taskTitle'}
              rules={[{ required: true, message: '必填' }]}
            >
              <Input
                placeholder={'请输入任务标题(必填)'}
                autoComplete={'off'}
              />
            </Form.Item>
            <Form.Item name={'description'} label={'任务描述'}>
              <Input.TextArea
                placeholder={'请输入任务描述'}
                autoComplete={'off'}
                autoSize={{ minRows: 4, maxRows: 6 }}
                allowClear={true}
                maxLength={200}
              />
            </Form.Item>
          </Form>
        </div>
      ),
      onOk: async () => {
        const value = await form.validateFields();
        const res = await createTask(
          props.projectId,
          props.columns.id,
          value.taskTitle,
          value.description,
        );
        if (res.status === 1) {
          props.dispatch({
            type: 'overview/setTrigger',
          });
          message.success('创建任务成功');
        } else {
          message.error(res.error);
          return Promise.reject();
        }
      },
      onCancel: () => {
        form.resetFields();
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
        <span className={styles.title} onClick={() => setTitkeEdit(true)}>
          {titleValue}
        </span>
      );
    }
  };
  return (
    <Draggable draggableId={props.columns.id.toString()} index={props.index}>
      {(provided, snapshot) => (
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
            {renderTitle()}
            <CloseCircleOutlined
              style={{ color: 'red' }}
              onClick={deleteHandler}
            />
          </div>
          <div className={styles.plus} onClick={createTaskModalHandler}>
            <PlusOutlined style={{ fontSize: 20 }} />
          </div>
          <List
            taskList={props.columns.taskList}
            title={props.columns.title}
            projectId={props.projectId}
            listId={props.columns.id}
          />
        </div>
      )}
    </Draggable>
  );
};

export default connect()(Columns);
