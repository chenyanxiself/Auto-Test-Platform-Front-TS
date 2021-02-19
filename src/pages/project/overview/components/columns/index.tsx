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
import { Button, Form, Input, message, Modal, Row, Col } from 'antd';
import { connect, Dispatch } from 'umi';
import {
  deleteTaskList,
  updateList,
  createTask,
} from '@/pages/project/overview/service';
import ProjectMember from '@/pages/project/components/projectMember';
import ClickSpan from '@/pages/project/components/clickSpan';
import PriorityMenu from '@/pages/project/overview/components/task/PriorityMenu';
import ProjectImgUpload from '@/pages/project/components/projectImgUpload';
import { uploadTaskImgApi } from '@/pages/project/overview/service';
import { delProjectImgApi } from '@/pages/project/service';
import FullEditor from '@/pages/project/components/fullEditor';

interface ColumnsProps {
  columns: ColumnsInfo;
  index: number;
  dispatch: Dispatch;
  projectId: number;
}

const Columns: React.FC<ColumnsProps> = props => {
  const [titleValue, setTitleValue] = useState('');

  useEffect(() => {
    setTitleValue(props.columns.title);
  }, [props.columns.title]);

  const saveTitle = async e => {
    const newValue = e.target.value;
    const res = await updateList(props.projectId, props.columns.id, newValue);
    if (res.status == 1) {
      setTitleValue(newValue);
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

  const customRequestHandle = async file => {
    const res = await uploadTaskImgApi(file, props.projectId);
    if (res.status === 1) {
      file.onSuccess(res);
    } else {
      file.onError();
    }
  };

  const removeHandle = async file => {
    const res = await delProjectImgApi(file.id);
    if (res.status === 1) {
      message.success('删除图片成功');
      return true;
    } else {
      message.error(res.error);
      return false;
    }
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
          <Form
            form={form}
            initialValues={{
              taskPriority: 3,
              attachment: [],
            }}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name={'taskTitle'}
                  rules={[{ required: true, message: '必填' }]}
                >
                  <Input
                    placeholder={'请输入任务标题(必填)'}
                    autoComplete={'off'}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={'taskPriority'} label={'优先级'}>
                  <PriorityMenu />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={'taskFollower'} label={'关注人'}>
                  <ProjectMember />
                </Form.Item>
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: 5 }}>任务描述</div>
              </Col>
              <Col span={24}>
                <Form.Item name={'description'}>
                  <FullEditor noBottom={true} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <div style={{ marginBottom: 5 }}>附件 (仅支持图片格式)</div>
              </Col>
              <Col span={24}>
                <Form.Item name={'attachment'}>
                  <ProjectImgUpload
                    customRequestHandle={customRequestHandle}
                    removeHandle={removeHandle}
                    maxLength={3}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
      onOk: async () => {
        const value = await form.validateFields();
        const attachment = value.attachment
          ? value.attachment.map(item => item.id)
          : [];
        const follower = value.taskFollower
          ? value.taskFollower.map(item => item.id)
          : [];
        const priority = value.taskPriority ? value.taskPriority : 3;
        const res = await createTask(
          props.projectId,
          props.columns.id,
          value.taskTitle,
          priority,
          follower,
          value.description,
          attachment,
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
            <ClickSpan
              value={titleValue}
              onSave={saveTitle}
              style={{ width: 150 }}
            />
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
