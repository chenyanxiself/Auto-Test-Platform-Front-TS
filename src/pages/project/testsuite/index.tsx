import React, { useEffect, useState } from 'react';
import { Card, Button, Menu, Modal, message, Table, Form, Checkbox } from 'antd';
import styles from './index.less';
import CreateSuiteModal from '@/pages/project/testsuite/components/createSuiteModal';
import ModifySuiteModal from '@/pages/project/testsuite/components/modifySuiteModal';
import {
  getSuiteByProjectId,
  getSuiteInfoById,
  createSuite,
  deleteSuite,
  updateSuiteCaseRelation,
  updateSuiteCaseSort,
  executeSuite,
} from './service';
import { getApiCaseByCondition } from '@/pages/project/apicase/service';
import { ExclamationCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import component from '@/pages/project/components/dndComponent';
import { DndProvider } from 'react-dnd';
import ExecuteSuiteModal from '@/pages/project/testsuite/components/executeSuiteModal';
import { getEnvByProjectId } from '@/pages/project/service';

const { confirm } = Modal;

const TestSuite = (props) => {
  const [isModifyVisible, setModifyVisible] = useState(false);
  const [isCreateVisible, setCreateVisible] = useState(false);
  const [isExecuteVisible, setExecuteVisible] = useState(false);
  const [suiteSource, setSuiteSource] = useState([]);
  const [caseSource, setCaseSource] = useState([]);
  const [isLeftLoading, setLeftLoading] = useState(false);
  const [isRightLoading, setRightLoading] = useState(false);
  const [relatedCase, setRelatedCase] = useState([]);
  const [selectedKey, setSelectedKey] = useState(0);
  const projectId = parseInt(props.match.params.id);

  const getSuiteData = async () => {
    setLeftLoading(true);
    const res = await getSuiteByProjectId(projectId);
    if (res.status === 1) {
      setLeftLoading(false);
      setSuiteSource(res.data);
    } else {
      message.warning(res.error);
    }
  };

  const getCaseData = async () => {
    setRightLoading(true);
    const res = await getApiCaseByCondition(projectId, 0, 0, 0, '');
    if (res.status === 1) {
      setRightLoading(false);
      setCaseSource(res.data.data);
    } else {
      message.warning(res.error);
    }
  };

  const getRelatedCase = async () => {
    if (selectedKey !== 0) {
      setRightLoading(true);
      const res = await getSuiteInfoById(selectedKey, projectId);
      if (res.status === 1) {
        const relatedCase = res.data.map((item, index) => {
          let current_case = caseSource.find(caseItem => {
            return caseItem.id === item.case_id;
          });
          current_case.index = index;
          return current_case;
        });
        setRelatedCase(relatedCase);
      } else {
        message.warning(res.error);
      }
      setRightLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([getSuiteData(), getCaseData()]);
  }, []);

  useEffect(() => {
    getRelatedCase();
  }, [selectedKey]);

  const columns = [
    {
      title: '用例名',
      dataIndex: 'name',
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      render: (method) => {
        return method === 1 ? 'Get' : 'Post';
      },
    },
    {
      title: '域名',
      dataIndex: 'real_host',
    },
    {
      title: '路径',
      dataIndex: 'request_path',
    },
  ];

  const deleteHandler = (suiteId) => {
    confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      maskClosable: true,
      onOk: async () => {
        const res = await deleteSuite(suiteId, projectId);
        if (res.status === 1) {
          message.success('删除成功');
          setSelectedKey(0);
          getSuiteData();
        } else {
          message.success(res.error);
          return Promise.reject();
        }
      },
    });
  };

  const suiteExtra = (
    <div>
      <Button
        type="primary"
        size={'small'}
        style={{ marginRight: 10 }}
        onClick={() => setCreateVisible(true)}
      >新建</Button>
      <Button
        type="primary"
        size={'small'}
        style={{ marginRight: 10 }}
        onClick={() => setModifyVisible(true)}
        disabled={!selectedKey}
      >修改</Button>
      <Button
        type="primary"
        size={'small'}
        danger={true}
        disabled={!selectedKey}
        onClick={() => deleteHandler(selectedKey)}
      >删除</Button>
    </div>
  );

  const caseExtra = (
    <Button
      type={'primary'}
      icon={<PlayCircleOutlined />}
      disabled={!selectedKey || relatedCase.length === 0}
      onClick={() => setExecuteVisible(true)}
    >
      执行
    </Button>
  );

  const createFinishHandler = async (value) => {
    const res = await createSuite(projectId, value.suiteName);
    if (res.status === 1) {
      message.success('新建成功');
      getSuiteData();
      setCreateVisible(false);
    } else {
      message.warning(res.error);
    }
  };

  const modifyFinishHandler = async (keys) => {
    const res = await updateSuiteCaseRelation(
      selectedKey,
      projectId,
      keys,
    );
    if (res.status === 1) {
      message.success('编辑成功');
      getRelatedCase();
      setModifyVisible(false);
    } else {
      message.warning(res.error);
    }
  };

  const executeFinishHandler = async (values) => {
    const res = await executeSuite(projectId, selectedKey, values)
    if (res.status === 1) {
      message.success('请在测试报告页面查看结果')
      setExecuteVisible(false)
    } else {
      message.warning(res.error)
    }
  };


  const moveRow = async (dragIndex, hoverIndex) => {
    const dragRow = relatedCase[dragIndex];
    const newDataSource = update(relatedCase,
      {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
      },
    );
    const beforeId = relatedCase[dragIndex].id;
    const afterId = relatedCase[hoverIndex].id;
    const type = dragIndex > hoverIndex ? 1 : 2;  //'1'代表after的上方  '2'代表after的下方
    const res = await updateSuiteCaseSort(projectId, selectedKey, beforeId, afterId, type);
    if (res.status === 1) {
      setRelatedCase(newDataSource);
    } else {
      message.warning(res.error);
    }
  };

  return (
    <div className={styles.main}>
      <Card
        className={styles.left}
        title="测试集"
        bordered={false}
        headStyle={{ height: 70 }}
        extra={suiteExtra}
        loading={isLeftLoading}
      >
        <Menu
          // @ts-ignore
          selectedKeys={selectedKey ? [selectedKey] : []}
          // @ts-ignore
          onSelect={({ key }) => setSelectedKey(key)}
          mode={'inline'}
          theme={'light'}
        >
          {suiteSource.map(item => {
            return (
              <Menu.Item key={item.id}>{item.name}</Menu.Item>
            );
          })}
        </Menu>
      </Card>
      <Card
        className={styles.right}
        title="测试用例"
        bordered={false}
        headStyle={{ height: 70 }}
        bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
        loading={isRightLoading}
        extra={caseExtra}
      >
        <DndProvider backend={HTML5Backend}>
          <Table
            columns={columns}
            dataSource={relatedCase}
            components={component}
            pagination={false}
            rowKey={'id'}
            showHeader={false}
            //@ts-ignore
            onRow={(record, index) => ({
              index,
              moveRow: moveRow,
            })}
          />
        </DndProvider>
      </Card>
      <CreateSuiteModal
        visible={isCreateVisible}
        finishHandler={createFinishHandler}
        cancelHandler={() => setCreateVisible(false)}
      />
      <ModifySuiteModal
        visible={isModifyVisible}
        finishHandler={modifyFinishHandler}
        cancelHandler={() => setModifyVisible(false)}
        caseSource={caseSource}
        relatedCase={relatedCase}
      />
      <ExecuteSuiteModal
        visible={isExecuteVisible}
        cancelHandler={() => setExecuteVisible(false)}
        finishHandler={executeFinishHandler}
        projectId={projectId}
      />

    </div>
  );
};

export default TestSuite;
