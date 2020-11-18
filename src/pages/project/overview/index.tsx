import React, { useEffect, useState } from 'react';
import Board from '@/pages/project/overview/components/board';
import { connect } from 'umi';
import { getTaskByCondition } from '@/pages/project/overview/service';
import { Button, Card, message, Progress, Select } from 'antd';
import { ContactsOutlined, CarOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { ColumnsInfo } from './data';

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

const res = {
  status: 1,
  error: '',
  data: [
    {
      id: 1,
      title: '测试1',
      sort: 1,
      taskList: [
        {
          id: 1,
          title: 'task1',
          sort: 1,
          status: 2,
          creator: {
            id: 1,
            cname: '管理员',
          },
        },
      ],
    },
    {
      id: 2,
      title: '测试2',
      sort: 2,
      taskList: [
        {
          id: 2,
          title: 'task2',
          sort: 1,
          status: 1,
          creator: {
            id: 1,
            cname: '管理员',
          },
        },
        {
          id: 3,
          title: 'task3',
          sort: 2,
          status: 1,
          creator: {
            id: 1,
            cname: '管理员',
          },
        },
      ],
    },
  ],
};
interface OverviewProps {
  dataSource: ColumnsInfo[];
  trigger: boolean;
  [name: string]: any;
}

const Overview: React.FC<OverviewProps> = props => {
  const [taskCreatedType, setTaskCreatedType] = useState(1);
  const [taskFilterStatus, setTaskFilterStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const projectId = parseInt(props.match.params.id);

  const selectHandler = key => {
    setTaskFilterStatus(key);
  };
  const getTaskPercentage = () => {
    var finishedCount = 0;
    var totalCount = 0;
    props.dataSource.forEach(listItem => {
      listItem.taskList.forEach(item => {
        totalCount += 1;
        if (item.status === 1) {
          finishedCount += 1;
        }
      });
    });
    return Math.round((finishedCount / totalCount) * 100);
  };

  const extra = (
    <div className={styles.extra}>
      <Progress
        percent={getTaskPercentage()}
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
      <Button type="primary" icon={<PlusOutlined />} onClick={() => {}} />
    </div>
  );

  const getData = async () => {
    setIsLoading(true);
    // const res = await getTaskByCondition(projectId);
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
  }, [props.trigger, taskCreatedType]);

  const tabChangeHandler = key => {
    setTaskCreatedType(parseInt(key));
  };

  return (
    <Card
      tabList={tabList}
      onTabChange={key => tabChangeHandler(key)}
      activeTabKey={taskCreatedType.toString()}
      bordered={false}
      loading={isLoading}
      bodyStyle={{ padding: 0 }}
      tabBarExtraContent={extra}
    >
      <Board projectId={projectId} />
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    dataSource: state.overview.columnsList,
    trigger: state.overview.trigger,
  };
};
export default connect(mapStateToProps)(Overview);
