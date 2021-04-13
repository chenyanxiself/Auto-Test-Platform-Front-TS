import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  message,
  Spin,
  Row,
  Col,
  Tooltip,
  Avatar,
  Divider,
  Tabs,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { Dispatch } from '@@/plugin-dva/connect';
import {
  getTaskDetail,
  updateTask,
  uploadTaskImgApi,
} from '@/pages/project/overview/service';
import styles from './index.less';
import ClickSpan from '@/pages/project/components/clickSpan';
import PriorityMenu from '@/pages/project/overview/components/task/PriorityMenu';
import {
  ColumnsInfo,
  ProgressInfo,
  TaskInfo,
} from '@/pages/project/overview/data';
import StatusMenu from '@/pages/project/overview/components/task/StatusMenu';
import ProjectMember from '@/pages/project/components/projectMember';
import ProjectImgUpload from '@/pages/project/components/projectImgUpload';
import { delProjectImgApi } from '@/pages/project/service';
import FullEditor from '@/pages/project/components/fullEditor';
import RelevanceCase from '@/pages/project/overview/components/relevanceCase';

const { TabPane } = Tabs;

interface TaskDrawerProps {
  dataSource: ColumnsInfo[];
  projectId: number;
  currentTask: any;
  dispatch: Dispatch;
  progress: ProgressInfo;
}

const TaskDrawer: React.FC<TaskDrawerProps> = props => {
  const [form] = Form.useForm();
  const [isDrawerLoading, setDrawerLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [tabkey, setTabkey] = useState<string>('1');
  const [taskImg, setTaskImg] = useState([]);
  const [taskRelevanceCase, setTaskRelevanceCase] = useState([]);

  const cname = props.currentTask.creator
    ? props.currentTask.creator.cname
    : '';

  useEffect(() => {
    if (props.currentTask.id) {
      setDrawerVisible(true);
    } else {
      setDrawerVisible(false);
    }
  }, [props.currentTask]);

  const processAttachment = v => {
    return v.map(item => {
      return {
        id: item.id,
        uid: item.id,
        status: 'done',
        name: item.name,
        url: item.url,
      };
    });
  };

  const drawerVisibleChangeHandler = async visible => {
    if (visible) {
      setDrawerLoading(true);
      const res = await getTaskDetail(props.projectId, props.currentTask.id);
      setDrawerLoading(false);
      if (res.status === 1) {
        form.setFieldsValue({
          taskTitle: res.data.title,
          description: res.data.description,
          taskPriority: res.data.priority,
          taskStatus: res.data.status,
          taskFollower: res.data.follower,
        });
        setTaskImg(processAttachment(res.data.img));
        setTaskRelevanceCase(res.data.relevance_case);
      } else {
        message.warning(res.error);
      }
    } else {
      setTabkey('1');
      form.resetFields();
      props.dispatch({
        type: 'overview/setCurrentTask',
        payload: {},
      });
    }
  };

  const closeDrawerHandler = () => {
    props.dispatch({
      type: 'overview/setCurrentTask',
      payload: {},
    });
  };

  const customRequestHandle = async file => {
    const res = await uploadTaskImgApi(
      file,
      props.projectId,
      props.currentTask.id,
    );
    if (res.status === 1) {
      file.onSuccess(res);
    } else {
      file.onError();
    }
  };

  const removeHandle = async file => {
    const res = await delProjectImgApi(file.id, props.currentTask.id);
    if (res.status === 1) {
      message.success('删除图片成功');
      return true;
    } else {
      message.error(res.error);
      return false;
    }
  };

  const changeDataSource = (key, value) => {
    const newData = [...props.dataSource];
    for (let i = 0; i < newData.length; i++) {
      let targetRow = newData[i].taskList.find(
        item => item.id === props.currentTask.id,
      );
      if (targetRow) {
        targetRow[key] = value;
        break;
      }
    }
    props.dispatch({
      type: 'overview/setColumnsList',
      payload: newData,
    });
  };

  const saveTitleHandle = async e => {
    const v = e.target.value;
    const res = await updateTask(
      props.projectId,
      props.currentTask.id,
      v,
      'title',
    );
    if (res.status !== 1) {
      return message.warning(res.error);
    }
    message.success('修改成功');
    changeDataSource('title', v);
    form.setFieldsValue({ taskTitle: v });
  };

  const saveDescriptionHandle = async v => {
    const res = await updateTask(
      props.projectId,
      props.currentTask.id,
      v,
      'description',
    );
    if (res.status !== 1) {
      return message.warning(res.error);
    }
    message.success('修改成功');
    changeDataSource('description', v);
    form.setFieldsValue({ description: v });
  };

  const savePriorityHandle = async key => {
    if (key !== form.getFieldValue('taskPriority')) {
      const res = await updateTask(
        props.projectId,
        props.currentTask.id,
        key,
        'priority',
      );
      if (res.status !== 1) {
        return message.warning(res.error);
      }
      message.success('修改成功');
      changeDataSource('priority', key);
      form.setFieldsValue({ taskPriority: key });
    }
  };

  const saveStatusHandle = async key => {
    if (key !== form.getFieldValue('taskStatus')) {
      const res = await updateTask(
        props.projectId,
        props.currentTask.id,
        key,
        'status',
      );
      if (res.status !== 1) {
        return message.warning(res.error);
      }
      message.success('修改成功');
      let finish = props.progress.finish;
      key === 1 ? (finish += 1) : (finish -= 1);
      props.dispatch({
        type: 'overview/setProgress',
        payload: {
          ...props.progress,
          finish,
        },
      });
      changeDataSource('status', key);
      form.setFieldsValue({ taskStatus: key });
    }
  };

  const saveFollowerHandle = async v => {
    const id_list = JSON.stringify(v.map(item => item.id).sort());
    const ori_id_list = JSON.stringify(
      form
        .getFieldValue('taskFollower')
        .map(item => item.id)
        .sort(),
    );
    if (id_list !== ori_id_list) {
      const res = await updateTask(
        props.projectId,
        props.currentTask.id,
        id_list,
        'follower',
      );
      if (res.status !== 1) {
        return message.warning(res.error);
      }
      message.success('修改成功');
      changeDataSource('follower', id_list);
      form.setFieldsValue({ taskFollower: v });
    }
  };

  const saveRelevanceCaseHandler = async (
    selectedCases,
    method: 'delete' | 'update',
  ) => {
    const res = await updateTask(
      props.projectId,
      props.currentTask.id,
      JSON.stringify(selectedCases.map(item => item.id)),
      'relevance_case',
    );
    if (res.status !== 1) {
      return message.warning(res.error);
    }
    message.success(method == 'update' ? '修改成功' : '删除成功');
    setTaskRelevanceCase(selectedCases);
  };

  return (
    <Drawer
      visible={drawerVisible}
      afterVisibleChange={drawerVisibleChangeHandler}
      onClose={closeDrawerHandler}
      forceRender={true}
      width={'60%'}
    >
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        spinning={isDrawerLoading}
      >
        <div>
          <Form form={form}>
            <Row>
              <Col span={24}>
                <Form.Item name={'taskTitle'}>
                  <ClickSpan
                    value={form.getFieldValue('taskTitle')}
                    onSave={saveTitleHandle}
                    style={{
                      width: '90%',
                      fontSize: 20,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={'taskStatus'} label={'状态'}>
                  <StatusMenu onSave={saveStatusHandle} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={'taskPriority'} label={'优先级'}>
                  <PriorityMenu onSave={savePriorityHandle} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <div className={styles.creatorInfo}>
                  <Tooltip title={cname}>
                    <Avatar className={styles.avatar}>
                      {cname.substring(cname.length - 2, cname.length)}
                    </Avatar>
                    {}
                  </Tooltip>
                  <div>
                    {cname} 创建于{' '}
                    {props.currentTask.create_time
                      ? new Date(
                          +new Date(props.currentTask.create_time) +
                            8 * 3600 * 1000,
                        )
                          .toISOString()
                          .replace(/T/g, ' ')
                          .replace(/\.[\d]{3}Z/, '')
                      : null}
                  </div>
                </div>
              </Col>
              <Divider style={{ marginTop: 18, marginBottom: 18 }} />
              <Col span={24}>
                <div className={styles.label}>任务描述</div>
              </Col>
              <Col span={24}>
                <Form.Item name={'description'}>
                  <FullEditor
                    onSave={saveDescriptionHandle}
                    style={{ height: 280 }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={'taskFollower'} label={'关注人'}>
                  <ProjectMember onSave={saveFollowerHandle} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Tabs activeKey={tabkey} onTabClick={k => setTabkey(k)}>
                  <TabPane tab="附件" key="1">
                    <ProjectImgUpload
                      customRequestHandle={customRequestHandle}
                      removeHandle={removeHandle}
                      maxLength={3}
                      value={taskImg}
                      onSave={v => setTaskImg(v)}
                    />
                  </TabPane>
                  <TabPane tab="关联" key="2">
                    <RelevanceCase
                      projectId={props.projectId}
                      onSave={saveRelevanceCaseHandler}
                      value={taskRelevanceCase}
                    />
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </Drawer>
  );
};

const mapStateToProps = state => {
  return {
    dataSource: state.overview.columnsList,
    progress: state.overview.progress,
    currentTask: state.overview.currentTask,
  };
};
export default connect(mapStateToProps)(TaskDrawer);
