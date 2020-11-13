import React, { useEffect, useState } from 'react';
import { Card, Select, Input, Button, Table, Modal, message, Tooltip } from 'antd';
import { PlusOutlined, FormOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import {
  getApiCaseByCondition,
  deleteApiCaseById,
  updateProjectApiCase,
  createProjectApiCase
} from './service';
import { getStrDataFromJson } from '@/utils/common';
import CreateApiCaseModal from '@/pages/project/apicase/components/createApiCaseModal';
import {ApiCaseInfo} from '@/pages/project/apicase/data';

const { confirm } = Modal;
const pageSize = 10;

const ApiCase = (props) => {
  const [currentApiCase, setCurrentApiCase] = useState<Partial<ApiCaseInfo>>({});
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectMethod, setsSelectMethod] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pageNum, setpageNum] = useState(1);
  const [total, settotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const projectId = parseInt(props.match.params.id);

  useEffect(() => {
    getData();
  }, [pageNum, selectMethod]);

  const getData = async () => {
    setIsLoading(true);
    const resData = await getApiCaseByCondition(projectId, pageNum, pageSize, selectMethod, searchKeyword);
    if (resData.status === 1) {
      const total = resData.data.total;
      const dataInit = resData.data.data;
      // if (dataInit.length === 0 && pageNum > 1) {
      //   return getData(pageNum - 1);
      // }
      const data = dataInit.map(item => {
        return {
          id: item.id,
          orderId: item.order_id,
          caseName: item.name,
          requestMehod: item.method,
          requestHost: {
            isUseEnv: item.is_use_env,
            requestHost: item.request_host,
            envHost: item.env_host ? item.env_host : undefined,
            realHost: item.real_host,
          },
          requestPath: item.request_path,
          requestHeaders: item.request_headers,
          requestQuery: item.request_query,
          requestBody: item.request_body,
        };
      });
      settotal(total);
      setDataSource(data);
    } else {
      message.warning(resData.error);
    }
    setIsLoading(false);
  };

  const renderItem = (value) => {
    const data = getStrDataFromJson(value);
    return (
      <Tooltip title={data} arrowPointAtCenter={false}>
        <span className={styles.cell}>
          {data}
        </span>
      </Tooltip>
    );
  };
  const columns = [
    {
      title: '',
      width: '3%',
      dataIndex: 'orderId',
      ellipsis: true,
      render: (id) => (
        <Tooltip title={id}>
          <span>
              {id}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '请求方式',
      width: '7%',
      dataIndex: 'requestMehod',
      ellipsis: true,
      render: (method) => {
        let methodToStr;
        if (method === 1) {
          methodToStr = 'Get';
        } else if (method === 2) {
          methodToStr = 'Post';
        } else {
          methodToStr = 'Undefind';
        }
        return (
          <Tooltip title={methodToStr}>
            <span>
                {methodToStr}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '用例名称',
      width: '14%',
      dataIndex: 'caseName',
      ellipsis: true,
      render: (name) => (
        <Tooltip title={name}>
          <span>
              {name}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '请求域名',
      width: '18%',
      dataIndex: 'requestHost',
      ellipsis: true,
      render: (host) => (
        <Tooltip title={host.realHost}>
          <span>
              {host.realHost}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '请求路径',
      width: '15%',
      dataIndex: 'requestPath',
      ellipsis: true,
      render: (path) => (
        <Tooltip title={path}>
          <span>
              {path}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '请求头部',
      width: '10%',
      dataIndex: 'requestHeaders',
      render: renderItem,
    },
    {
      title: '请求参数',
      width: '10%',
      dataIndex: 'requestQuery',
      render: renderItem,
    },
    {
      title: '请求主体',
      width: '10%',
      dataIndex: 'requestBody',
      render: renderItem,
    },
    {
      title: '操作',
      width: '13%',
      ellipsis: true,
      render: (item) => {
        return (
          <span className={styles.action}>
            <Button
              type='primary'
              shape="circle"
              icon={<FormOutlined />}
              size='small'
              onClick={() => {
                setCurrentApiCase(item);
                setVisible(true);
              }}
            />
            <Button
              type='primary'
              shape="circle"
              icon={<CloseOutlined />}
              danger
              size='small'
              onClick={() => {
                deleteHandler(item);
              }}
            />
        </span>
        );
      },
    },
  ];

  const deleteHandler = async (item) => {
    confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        let resData = await deleteApiCaseById(item.id, projectId);
        if (resData.status !== 1) {
          message.warning(resData.error);
          return Promise.reject(resData.error);
        } else {
          message.success('删除用例成功');
          if (dataSource.length <= 1 && pageNum > 1) {
            setpageNum(pre => pre - 1);
          } else {
            getData();
          }
        }
      },
      onCancel: () => setVisible(false),
    });
  };

  const onMethodChange = (value) => {
    setsSelectMethod(value);
  };

  const searchHandler = () => {
    if (pageNum === 1) {
      getData();
    } else {
      setpageNum(1);
    }
  };
  const title = (
    <div>
      <Select
        value={selectMethod}
        className={styles.method}
        onChange={(value) => {
          onMethodChange(value);
        }}
        bordered={false}
      >
        <Select.Option value={0}>全部</Select.Option>
        <Select.Option value={1}>Get</Select.Option>
        <Select.Option value={2}>Post</Select.Option>
      </Select>
      <Input
        placeholder='请输入关键字'
        className={styles.search}
        value={searchKeyword}
        onChange={(e) => {
          setSearchKeyword(e.target.value);
        }}
        onPressEnter={searchHandler}
        allowClear={true}
      />
      <Button
        type='primary'
        onClick={searchHandler}
      >搜索</Button>
    </div>
  );

  const extra = (
    <Button
      type='primary'
      icon={<PlusOutlined />}
      onClick={() => {
        setVisible(true);
        setCurrentApiCase({});
      }}
    />
  );
  const afterHandler = async (value) => {
    value = {...value, projectId}
    if (currentApiCase.id) {
      const res = await updateProjectApiCase({...value, id: currentApiCase.id})
      if (res.status === 1) {
        setVisible(false)
        message.success('更新用例成功')
        getData()
      } else {
        message.warning(res.error)
      }
    } else {
      const res = await createProjectApiCase(value)
      if (res.status === 1) {
        setVisible(false)
        message.success('新增用例成功')
        getData()
      } else {
        message.warning(res.error)
      }
    }
  };
  return (
    <>
      <Card
        title={title}
        extra={extra}
        bordered={false}
        className='project-case-card'
        bodyStyle={{ height: '100%' }}
      >
        <Table
          className={styles.table}
          dataSource={dataSource}
          columns={columns}
          size='middle'
          // bordered
          tableLayout='fixed'
          loading={isLoading}
          rowKey={item => item.id}
          pagination={{
            current: pageNum,
            defaultPageSize: pageSize,
            showQuickJumper: true,
            onChange: (page) => {
              setpageNum(page);
            },
            total: total,
          }}
        />
      </Card>
      <CreateApiCaseModal
        visible={visible}
        afterHandler={afterHandler}
        cancelHandler={() => setVisible(false)}
        currentApiCase={currentApiCase}
        projectId={projectId} />
    </>
  );

};

export default ApiCase;
