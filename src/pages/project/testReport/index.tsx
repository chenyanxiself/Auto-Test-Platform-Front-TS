import React, { useEffect, useState } from 'react';
import {message, Tabs, Button, Modal} from 'antd';
import ProTable from '@ant-design/pro-table';
import {deleteReportById, getReportByCondition} from './service'
import {ExclamationCircleOutlined} from '@ant-design/icons';

const valueEnum = {
  0: 'unStarted',
  1: 'underWay',
  2: 'finished',
  3: 'error'
};

interface TableListItem {
  id: number;
  name: string;
  status: string;
  progress:number
  totalCaseNum:number
  successCaseNum:number
  failedCaseNum:number
  startTime:string
  finishTime:string
  creator:string
}

const TestReport=(props)=>{
  const [dataSource,setDataSource] = useState([])

  useEffect(()=>{
    getData()
    const intervalId = setInterval(() => {
      getData()
    }, 1000);
    return ()=>{
      clearInterval(intervalId)
    }
  },[])


  const projectId = parseInt(props.match.params.id)
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
    },
    {
      title: '报告名',
      width: 120,
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: 'all',
      width: 100,
      filters: true,
      valueEnum: {
        all: {text: '全部', status: 'Default'},
        unStarted: {text: '未开始', status: 'Default'},
        underWay: {text: '运行中', status: 'Processing'},
        finished: {text: '已完成', status: 'Success'},
        error: {text: '错误', status: 'Error'}
      },
    },

    {
      title: '进度',
      dataIndex: 'progress',
      valueType: (item) => ({
        type: 'progress',
        status: item.status === 3 ? 'exception' : 'active',
      }),
      width: 200,
      hideInSearch: true
    },
    {
      title: '用例总数',
      width: 120,
      dataIndex: 'totalCaseNum',
      valueType: 'text',
    },
    {
      title: '成功用例数',
      width: 120,
      dataIndex: 'successCaseNum',
      valueType: 'text',
    },
    {
      title: '失败用例数',
      width: 120,
      dataIndex: 'failedCaseNum',
      valueType: 'text',
    },
    {
      title: '开始时间',
      width: 120,
      dataIndex: 'startTime',
      valueType: 'dateTime',
    },
    {
      title: '结束时间',
      width: 120,
      dataIndex: 'finishTime',
      valueType: 'dateTime',
    },
    {
      title: '创建人',
      width: 120,
      dataIndex: 'creator',
      valueType: 'text',
    },
    {
      title: '操作',
      width: 120,
      valueType: 'option',
      render: (_,item) => [
        <Button size={"small"} key={0} type={"primary"} onClick={() => detailHandler(item)}>详情</Button>,
        <Button size={"small"} key={1} danger={true} type={"primary"} onClick={() => {
          deleteHandler(item)
        }}>删除</Button>
      ],
    },
  ];
  const getData = async () => {
    const res = await getReportByCondition(projectId)
    if (res.status === 1) {
      const tableListDataSource: TableListItem[] = [];
      res.data.forEach(item => {
        const progress = Math.ceil(((item.success_case_num + item.failed_case_num) / item.total_case_num) * 100)
        tableListDataSource.push(
          {
            id: item.id,
            name: item.report_name,
            status: valueEnum[item.status],
            progress,
            totalCaseNum: item.total_case_num,
            successCaseNum: item.success_case_num,
            failedCaseNum: item.failed_case_num,
            startTime: item.start_time,
            finishTime: item.finish_time,
            creator: item.cname,
          }
        )
      })
      setDataSource(tableListDataSource)
    } else {
      message.warning(res.error)
    }
  }

  const deleteHandler = async (item) => {
    Modal.confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined/>,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: async () => {
        let resData = await deleteReportById(item.id,projectId)
        if (resData.status !== 1) {
          message.error('删除报告失败 :' + resData.error)
        } else {
          message.success('删除报告成功')
          getData()
        }
      },
    });
  }
  const detailHandler = (item) => {
    props.history.push(`/project/${projectId}/testReport/${item.id}/detail`)
  }



  return (
    <Tabs defaultActiveKey="1" style={{padding: '0 15px'}}>
      <Tabs.TabPane tab="接口测试报告" key="1">
        <ProTable<TableListItem>
          // @ts-ignore
          columns={columns}
          rowKey="id"
          pagination={{
            showSizeChanger: false,
            pageSize: 15,
            showQuickJumper: true,
          }}
          dataSource={dataSource}
          options={false}
          dateFormatter="string"
          toolBarRender={null}
          search={false}
        />
      </Tabs.TabPane>
    </Tabs>
  );

}

export default TestReport
