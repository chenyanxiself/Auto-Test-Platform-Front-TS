import React, { useEffect, useState } from 'react';
import {
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  TreeSelect,
} from 'antd';
import { priorityEnum } from '@/utils/enums';
import { getAllModule, getCaseByModuleId } from '@/pages/project/case/service';
import { SearchOutlined } from '@ant-design/icons';

interface CreateRelvanceModalProps {
  visible: boolean;
  cancelHandler: () => void;
  finishHandler: (value: any) => void;
  projectId: number;
  selectedRelevanceCases: any[];
}

const CreateRelvanceModal: React.FC<CreateRelvanceModalProps> = props => {
  const [moduleTree, setModuleTree] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number>(null);
  const inputRef = React.useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [innerSelectedRelevanceCasesId, setInnerRelevanceCasesId] = useState(
    [],
  );

  useEffect(() => {
    setInnerRelevanceCasesId(props.selectedRelevanceCases.map(item => item.id));
  }, [props.selectedRelevanceCases]);

  useEffect(() => {
    getModuleData();
  }, []);

  useEffect(() => {
    // @ts-ignore
    getCaseData(inputRef.current.state.value);
  }, [selectedModuleId]);

  const getModuleData = async () => {
    const mres = await getAllModule(props.projectId);
    if (mres.status === 1) {
      setModuleTree(mres.data);
    } else {
      message.warning(mres.error);
    }
  };

  const columns = [
    // {
    //   title: '',
    //   width: '7%',
    //   dataIndex: 'index',
    // },
    {
      title: '名称',
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
  ];

  const getCaseData = async keyword => {
    setIsLoading(true);
    const cres = await getCaseByModuleId(
      props.projectId,
      selectedModuleId,
      keyword,
    );
    setIsLoading(false);
    if (cres.status === 1) {
      let dataSource = cres.data.map(item => {
        item.moduleName = item['module_name'];
        item.moduleId = item['module_id'];
        return item;
      });
      setCaseData(dataSource);
    } else {
      message.warning(cres.error);
    }
  };

  const processData = list => {
    let curList = list.map(item => {
      return {
        title: item.name,
        key: item.id,
        value: item.id,
        id: item.id,
        parentId: item.parent_id,
      };
    });
    //筛选出 包含parentId的数组；
    let parents = curList.filter(value => value.parentId === 0);
    //筛选出 包含不parentId的数组；
    let childrens = curList.filter(value => value.parentId !== 0);
    let translator = (parents, childrens) => {
      //遍历每一个父数组
      parents.forEach(parent => {
        //遍历子数组 判断子节点的parentId等于父数组的id，
        childrens.forEach((child, index) => {
          if (child.parentId === parent.id) {
            //对子节点数据进行深复制
            let temp = [...childrens];
            //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
            temp.splice(index, 1);
            //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
            translator([child], temp);
            //把找到子节点放入父节点的ChildNodes属性中
            typeof parent.children !== 'undefined'
              ? parent.children.push(child)
              : (parent.children = [child]);
          }
        });
      });
    };
    translator(parents, childrens);
    return parents;
  };

  const changeHandler = (value: number) => {
    setSelectedModuleId(value);
  };

  const searchHandler = value => {
    getCaseData(value);
  };

  const selectHandler = record => {
    setInnerRelevanceCasesId([record.id]);
  };

  const finishHandler = async () => {
    setConfirmLoading(true);
    await props.finishHandler(
      caseData.filter(x => innerSelectedRelevanceCasesId.indexOf(x.id) != -1),
    );
    setConfirmLoading(false);
    props.cancelHandler();
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.cancelHandler}
      onOk={finishHandler}
      confirmLoading={confirmLoading}
      title={'选择关联用例'}
      width={800}
      forceRender={true}
    >
      <Row>
        <Col span={12}>
          <Input.Search
            ref={inputRef}
            placeholder={'根据名称搜索'}
            prefix={<SearchOutlined />}
            allowClear={true}
            enterButton
            style={{ width: 200, marginRight: 10 }}
            onSearch={searchHandler}
          />
        </Col>
        <Col span={8} offset={4}>
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={processData(moduleTree)}
            placeholder="请选择模块"
            treeDefaultExpandAll
            value={selectedModuleId}
            onChange={changeHandler}
            allowClear={true}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Table
            dataSource={caseData}
            columns={columns}
            rowKey={'id'}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            rowSelection={{
              selectedRowKeys: innerSelectedRelevanceCasesId,
              onSelect: selectHandler,
              hideSelectAll: true,
              type: 'radio',
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default CreateRelvanceModal;
