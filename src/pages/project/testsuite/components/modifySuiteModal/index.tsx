import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Table } from 'antd';

interface ModifySuiteModalProps {
  visible: boolean
  cancelHandler: () => void
  finishHandler: (value) => void
  caseSource: any[]
  relatedCase: any[]
}

const ModifySuiteModal: React.FC<ModifySuiteModalProps> = (props) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const columns = [
      {
        title: '编号',
        dataIndex: 'order_id',
      },
      {
        title: '用例名',
        dataIndex: 'name',
      },
      {
        title: '请求方式',
        dataIndex: 'method',
        render: (method) => method === 1 ? 'Get' : 'Post',
      },
      {
        title: '请求域名',
        dataIndex: 'real_host',
      },
      {
        title: '请求路径',
        dataIndex: 'request_path',
      },
    ];

    const searchHandler = (value) => {
      if (value) {
        setDataSource(props.caseSource.filter(item => item.name.includes(value)));
      } else {
        setDataSource(props.caseSource);
      }
    };

    useEffect(() => {
      if (props.visible) {
        const keys = props.relatedCase.map(item => item.id);
        setSelectedKeys(keys);
        searchHandler('');
      }
    }, [props.visible]);

    const onSelectChange = (record,selected) => {
      if (selected){
        setSelectedKeys(Array.from(new Set(selectedKeys.concat([record.id]))));
      }else {
        setSelectedKeys(selectedKeys.filter(item=>item!==record.id))
      }
    };

    const onSelectAll = (selected) => {
      if (selected) {
        const keys = dataSource.map(item => item.id);
        setSelectedKeys(Array.from(new Set(selectedKeys.concat(keys))));
      } else {
        setSelectedKeys([]);
      }
    };

    const okHandler=()=>{
      props.finishHandler(selectedKeys)
    }

    return (
      <Modal
        visible={props.visible}
        onCancel={props.cancelHandler}
        width={1000}
        bodyStyle={{ overflowY: 'scroll', height: 600 }}
        onOk={okHandler}
        title={'编辑测试集'}
        forceRender={true}
        maskClosable={false}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Input.Search
              placeholder='请输入关键字'
              onSearch={searchHandler}
              allowClear={true}
              style={{ width: 200, marginRight: 10 }}
              enterButton={'搜索'}
            />
          </div>
          <Table
            rowSelection={
              {
                selectedRowKeys: selectedKeys,
                onSelect: onSelectChange,
                onSelectAll: onSelectAll,
              }
            }
            columns={columns}
            dataSource={dataSource}
            rowKey={(item) => item.id}
            pagination={false}
            size={'small'}
          />
        </div>
      </Modal>
    );
  }
;

export default ModifySuiteModal;
