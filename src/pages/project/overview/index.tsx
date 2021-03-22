import React, { useEffect, useState } from 'react';
import Board from '@/pages/project/overview/components/board';
import { connect, Dispatch } from 'umi';
import {
  getTaskByCondition,
  getProjectProgress,
  createList,
} from '@/pages/project/overview/service';
import { Button, Card, message, Progress, Select } from 'antd';
import {
  ContactsOutlined,
  CarOutlined,
  PlusOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { ColumnsInfo, ProgressInfo } from './data';
import CreateListModal from '@/pages/project/overview/components/createListModal';
import TaskDrawer from '@/pages/project/overview/components/taskDrawer';

const tabList = [
  {
    key: 'task-tab-1',
    tab: (
      <span style={{ fontSize: 14 }}>
        <CarOutlined />
        所有任务
      </span>
    ),
  },
  {
    key: 'task-tab-2',
    tab: (
      <span style={{ fontSize: 14 }}>
        <ContactsOutlined />
        我创建的
      </span>
    ),
  },
  {
    key: 'task-tab-3',
    tab: (
      <span style={{ fontSize: 14 }}>
        <TeamOutlined />
        我关注的
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
  const projectId = parseInt(props.match.params.id);

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

  const tabChangeHandler = key => {
    const temp = key.split('-');
    setTaskRelationType(parseInt(temp[temp.length - 1]));
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

  return (
    <Card
      tabList={tabList}
      onTabChange={key => tabChangeHandler(key)}
      activeTabKey={`task-tab-${taskRelationType.toString()}`}
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
      <TaskDrawer projectId={projectId} />
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    dataSource: state.overview.columnsList,
    trigger: state.overview.trigger,
    progress: state.overview.progress,
  };
};
export default connect(mapStateToProps)(Overview);
