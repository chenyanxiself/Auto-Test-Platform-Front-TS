import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import ModuleTree from '@/pages/project/case/components/moduleTree';
import { Button, Card, Input, Table, Modal, message } from 'antd';
import {
  HomeOutlined,
  SearchOutlined,
  FormOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  CopyOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { getCaseByModuleId, deleteProjectCase } from './service';
import CreateCaseModal from '@/pages/project/case/components/createCaseModal';
import { priorityEnum } from '@/utils/enums';
import { connect, history } from 'umi';

const Case = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCase, setCurrentCase] = useState({});
  const projectId = parseInt(props.match.params.id);
  const inputRef = useRef();
  useEffect(() => {
    // @ts-ignore
    getData();
  }, [props.selectedModule]);

  const columns = [
    {
      title: '',
      width: '7%',
      dataIndex: 'index',
    },
    {
      title: '名称',
      width: '20%',
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: '优先级',
      width: '20%',
      dataIndex: 'priority',
      render: text => {
        return priorityEnum[text];
      },
    },
    {
      title: '所属模块',
      width: '20%',
      ellipsis: true,
      dataIndex: 'moduleName',
    },
    {
      title: '创建人',
      width: '10%',
      ellipsis: true,
      dataIndex: 'cname',
    },
    {
      title: '操作',
      width: '23%',
      render: record => (
        <span>
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              history.push(`${history.location.pathname}/${record.id}/detail`);
            }}
            style={{ marginRight: 10 }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<FormOutlined />}
            size="small"
            onClick={() => {
              setModalVisible(true);
              setCurrentCase(record);
            }}
            style={{ marginRight: 10 }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<CopyOutlined />}
            size="small"
            style={{ marginRight: 10 }}
            onClick={() => onCopy(record)}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<CloseOutlined />}
            danger
            size="small"
            onClick={() => {
              onDelete(record);
            }}
          />
        </span>
      ),
    },
  ];
  const onCopy = record => {
    let newRecord = { ...record };
    newRecord.name = '';
    newRecord.id = undefined;
    setModalVisible(true);
    setCurrentCase(newRecord);
  };

  const onDelete = async record => {
    Modal.confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        let res = await deleteProjectCase([record.id], projectId);
        if (res.status === 1) {
          message.success('删除成功');
          getData();
        } else {
          message.warning(res.error);
          return Promise.reject(res.error);
        }
      },
    });
  };

  const afterHandler = () => {
    setModalVisible(false);
    getData();
  };

  const getData = async () => {
    setIsLoading(true);
    const res = await getCaseByModuleId(
      projectId,
      props.selectedModule.id,
      // @ts-ignore
      inputRef.current.state.value,
    );
    if (res.status === 1) {
      let dataSource = res.data.map(item => {
        item.moduleName = item['module_name'];
        item.moduleId = item['module_id'];
        return item;
      });
      setDataSource(dataSource);
    } else {
      message.warning(res.error);
    }
    setIsLoading(false);
  };

  const title = (
    <div style={{ fontWeight: 'normal', fontSize: 14 }}>
      <div style={{ marginBottom: 10 }}>
        <Button
          icon={<HomeOutlined />}
          type={'text'}
          onClick={() => {
            props.dispatch({
              type: 'case/setSelectedModule',
              payload: {},
            });
          }}
          size={'large'}
          style={{ padding: 0 }}
        >
          全部用例
        </Button>
      </div>
      <div style={{ height: 40, lineHeight: '40px' }}>
        <div style={{ float: 'left' }}>
          <Button
            style={{ marginRight: 10 }}
            size={'small'}
            onClick={() => {
              setModalVisible(true);
              setCurrentCase({});
            }}
            icon={<PlusCircleOutlined />}
          >
            新建用例
          </Button>
          <Button
            style={{ marginRight: 10 }}
            size={'small'}
            icon={<DownloadOutlined />}
          >
            导入用例
          </Button>
          <Button
            style={{ marginRight: 10 }}
            size={'small'}
            icon={<UploadOutlined />}
          >
            导出用例
          </Button>
        </div>
        <div style={{ float: 'right' }}>
          <Input.Search
            ref={inputRef}
            placeholder={'根据名称搜索'}
            prefix={<SearchOutlined />}
            // allowClear
            enterButton
            style={{ width: 200, marginRight: 10 }}
            onSearch={getData}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <ModuleTree projectId={projectId} />
      </div>
      <div className={styles.right}>
        <Card bordered={false} title={title}>
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={'index'}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            // onRow={record =>{
            //   return {
            //     onMouseEnter:event=>{
            //       event.currentTarget.setAttribute('style','cursor:pointer;  border: 1px solid green;')
            //       console.log(event.currentTarget)
            //       console.log(record)
            //     }
            //   }
            // }}
          />
        </Card>
      </div>
      <CreateCaseModal
        visible={isModalVisible}
        cancelHandler={() => setModalVisible(false)}
        currentCase={currentCase}
        afterHandler={afterHandler}
        projectId={projectId}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    selectedModule: state.case.selectedModule,
  };
};

export default connect(mapStateToProps)(Case);
