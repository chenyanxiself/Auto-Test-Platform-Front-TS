import React, { useEffect, useState } from 'react';
import { getAllProject, createProject } from '@/pages/project/service';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Button, Modal, message, List } from 'antd';
import CreateProjectModal from '@/pages/project/components/createProjectModal';
import styles from '@/pages/project/index.less';

const tabList = [
  {
    key: '1',
    tab: '进行中',
  },
  {
    key: '0',
    tab: '已归档',
  },
];

interface ProjectInfo {
  id: number
  name: string
  remark?: string
  type: number
  url?: string

  [props: string]: any
}

export default (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectType, setSelectType] = useState(1);//1进行中 0已归档

  const getProjectList = async () => {
    setIsLoading(true);
    let res = await getAllProject(selectType);
    if (res.status === 1) {
      setProjectList(res.data);
    } else {
      message.warning(res.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getProjectList();
  }, [selectType]);

  const onProjectClick = (item: ProjectInfo) => {
    props.history.push(`/project/${item.id}/overview`);
  };

  const finishHandler = async (value) => {
    const projectMember = value.projectMember.map(item => {
      return item.id;
    });
    const res = await createProject({ ...value, projectMember });
    if (res.status === 1) {
      message.success('新建项目成功');
      setIsModalVisible(false);
      getProjectList();
    } else {
      message.warning(res.error);
    }
  };
  const extra = (
    <Button
      type="primary"
      shape="circle"
      icon={<PlusOutlined />}
      onClick={() => setIsModalVisible(true)} />
  );
  const tabChangeHandler = (key) => {
    setSelectType(parseInt(key));
  };
  return (
    <React.Fragment>
      <Card
        title={'项目列表'}
        tabList={tabList}
        onTabChange={key => tabChangeHandler(key)}
        extra={extra}
        bordered={false}
        loading={isLoading}
      >
        <List
          rowKey={'id'}
          grid={{
            gutter: 25,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
            xxl: 5,
          }}
          dataSource={projectList}
          renderItem={(item: ProjectInfo) => {
            return (
              <List.Item className={styles.bodyListItem}>
                <Card
                  className={styles.bodyCard}
                  hoverable={true}
                  key={item.id}
                  cover={<img alt={item.name} src={item.url} className={styles.bodyCardImg} />}
                  onClick={() => {
                    onProjectClick(item);
                  }}
                >
                  <Card.Meta
                    title={<div>{item.name}</div>}
                    description={<div className={styles.bodyCardRemark}>{item.remark}</div>}
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      </Card>
      <CreateProjectModal
        cancelHandler={() => setIsModalVisible(false)}
        finishHandler={finishHandler}
        isModalVisible={isModalVisible}
      />
    </React.Fragment>
  );
}
