import React, { useEffect, useState } from 'react';
import Board from '@/pages/project/overview/components/board';
import { connect, Dispatch } from 'umi';
import {
  getTaskByCondition,
  getProjectProgress,
  createList,
} from '@/pages/project/overview/service';
import {
  Button,
  Card,
  message,
  Progress,
  Select,
  Drawer,
  Form,
  Input,
  Spin,
} from 'antd';
import { ContactsOutlined, CarOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './index.less';
import { ColumnsInfo, ProgressInfo } from './data';
import CreateListModal from '@/pages/project/overview/components/createListModal';

const tabList = [
  {
    key: '1',
    tab: (
      <span style={{ fontSize: 14 }}>
        <CarOutlined />
        所有任务
      </span>
    ),
  },
  {
    key: '2',
    tab: (
      <span style={{ fontSize: 14 }}>
        <ContactsOutlined />
        我创建的
      </span>
    ),
  },
];

interface OverviewProps {
  dataSource: ColumnsInfo[];
  trigger: boolean;
  progress: ProgressInfo;
  dispatch: Dispatch;
  currentTask: any;

  [name: string]: any;
}

const Overview: React.FC<OverviewProps> = props => {
  const [taskRelationType, setTaskRelationType] = useState(1);
  const [taskFilterStatus, setTaskFilterStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [createListVisible, setCreateListVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDrawerLoading, setDrawerLoading] = useState(false);
  const projectId = parseInt(props.match.params.id);
  const [form] = Form.useForm();

  const selectHandler = key => {
    setTaskFilterStatus(key);
  };

  const getProgress = async () => {
    const res = await getProjectProgress(projectId);
    if (res.status === 1) {
      props.dispatch({
        type: 'overview/setProgress',
        payload: {
          finish: res.data.finish,
          total: res.data.total,
        },
      });
    } else {
      message.warning(res.error);
    }
  };

  const extra = (
    <div className={styles.extra}>
      <Progress
        percent={Math.round(
          (props.progress.finish / props.progress.total) * 100,
        )}
        status="active"
        className={styles.progress}
      />
      <Select
        className={styles.select}
        value={taskFilterStatus}
        onSelect={selectHandler}
      >
        <Select.Option value={0}>全部</Select.Option>
        <Select.Option value={1}>已完成</Select.Option>
        <Select.Option value={2}>未完成</Select.Option>
      </Select>
      <Button type="dashed" onClick={() => setCreateListVisible(true)}>
        <PlusOutlined />
        添加任务栏
      </Button>
    </div>
  );

  const getData = async () => {
    setIsLoading(true);
    const res = await getTaskByCondition(
      projectId,
      null,
      taskRelationType,
      taskFilterStatus,
    );
    if (res.status == 1) {
      props.dispatch({
        type: 'overview/setColumnsList',
        payload: res.data,
      });
    } else {
      message.warning(res.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [props.trigger, taskRelationType, taskFilterStatus]);

  useEffect(() => {
    getProgress();
  }, [props.trigger]);

  useEffect(() => {
    if (props.currentTask.id) {
      setDrawerVisible(true);
    } else {
      setDrawerVisible(false);
    }
  }, [props.currentTask]);
  const tabChangeHandler = key => {
    setTaskRelationType(parseInt(key));
  };

  const createListHandler = async value => {
    const res = await createList(projectId, value.title);
    if (res.status === 1) {
      message.success('创建成功');
      setCreateListVisible(false);
      props.dispatch({
        type: 'overview/setTrigger',
      });
    } else {
      message.warning(res.error);
    }
  };

  const drawerVisibleChangeHandler = visible => {
    if (visible) {
      setDrawerLoading(true);
      form.setFieldsValue({
        taskTitle: props.currentTask.title,
        description: props.currentTask.description,
      });
      setDrawerLoading(false);
    } else {
      form.resetFields();
    }
  };

  const closeDrawerHandler = () => {
    props.dispatch({
      type: 'overview/setCurrentTask',
      payload: {},
    });
  };

  return (
    <Card
      tabList={tabList}
      onTabChange={key => tabChangeHandler(key)}
      activeTabKey={taskRelationType.toString()}
      bordered={false}
      loading={isLoading}
      bodyStyle={{ padding: 0 }}
      tabBarExtraContent={extra}
    >
      <Board projectId={projectId} />

      <CreateListModal
        visible={createListVisible}
        cancelHandler={() => setCreateListVisible(false)}
        finishHandler={createListHandler}
      />
      <Drawer
        visible={drawerVisible}
        afterVisibleChange={drawerVisibleChangeHandler}
        onClose={closeDrawerHandler}
        forceRender={true}
        title={'任务详情'}
        width={'50%'}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          spinning={isDrawerLoading}
        >
          <div>
            <Form form={form}>
              <Form.Item name={'taskTitle'} label={'任务标题'}>
                <Input />
              </Form.Item>
              <Form.Item name={'description'} label={'任务描述'}>
                <Input />
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </Drawer>
    </Card>
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
export default connect(mapStateToProps)(Overview);
