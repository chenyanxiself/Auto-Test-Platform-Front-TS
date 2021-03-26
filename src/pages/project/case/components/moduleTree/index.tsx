import React, { useEffect, useState } from 'react';
import { Tooltip, Tree, Modal, Form, Input, message, Button } from 'antd';
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  OrderedListOutlined,
  ExclamationCircleOutlined,
  SmileOutlined,
  DownOutlined,
  MehOutlined,
  FrownFilled,
  FrownOutlined,
} from '@ant-design/icons';
import {
  createModule,
  updateModule,
  getAllModule,
  deleteModule,
} from '@/pages/project/case/service';
import { connect } from 'umi';
import styles from './index.less';

const ModuleTree = props => {
  const [treeData, setTreeData] = useState([]);
  const [option, setOption] = useState(0);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    getData();
  }, []);

  const getDeleteIdList = id => {
    function getTargetTotal(source, targetId) {
      if (source.id === targetId) {
        return source;
      } else {
        if (source.children) {
          var result = null;
          for (var i = 0; i < source.children.length; i++) {
            result = getTargetTotal(source.children[i], targetId);
          }
          return result;
        }
      }
      return null;
    }

    function getIdList(data, targetList) {
      data.forEach(item => {
        targetList.push(item.id);
        if (item.children) {
          getIdList(item.children, targetList);
        }
      });
    }

    var returnData = null;
    for (var i = 0; i < treeData.length; i++) {
      const data = getTargetTotal(treeData[i], id);
      if (data) {
        returnData = data;
        break;
      }
    }
    var idList = [];
    getIdList([returnData], idList);
    return idList;
  };

  const getModalTitle = () => {
    switch (option) {
      case 0:
        return '创建根模块';
      case 1:
        return '创建子模块';
      case 2:
        return '修改子模块';
      default:
        return '创建根模块';
    }
  };
  const deleteHandler = id => {
    return Modal.confirm({
      title: '是否确认删除?',
      icon: <ExclamationCircleOutlined />,
      content: '若存在子模块,则会一并删除',
      onOk: async () => {
        const idList = getDeleteIdList(id);
        const res = await deleteModule(idList, props.projectId);
        if (res.status === 1) {
          message.success('删除成功');
          getData();
        } else {
          message.warning(res.error);
          return Promise.reject(res.error);
        }
      },
      maskClosable: true,
    });
  };

  const processData = list => {
    let curList = list.map(item => {
      return {
        title: (
          <>
            <span>{item.name}</span>
            {item.id === props.selectedModule.id ? (
              <div style={{ float: 'right' }}>
                <Tooltip title={'修改'}>
                  <EditOutlined
                    className={styles.icon}
                    onClick={() => {
                      form.setFieldsValue({ name: item.name });
                      setVisible(true);
                      setOption(2);
                    }}
                  />
                </Tooltip>
                <Tooltip title={'添加子模块'}>
                  <PlusCircleOutlined
                    className={styles.icon}
                    onClick={() => {
                      form.resetFields();
                      setVisible(true);
                      setOption(1);
                    }}
                  />
                </Tooltip>
                <Tooltip title={'删除'}>
                  <DeleteOutlined
                    className={styles.icon}
                    onClick={() => deleteHandler(item.id)}
                  />
                </Tooltip>
              </div>
            ) : null}
          </>
        ),
        key: item.id,
        name: item.name,
        id: item.id,
        parentId: item.parent_id,
        // icon: ({ selected }) => selected ? <SmileOutlined /> : <FrownOutlined />,
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
    //返回最终的结果
    return parents;
  };

  const getData = async () => {
    const res = await getAllModule(props.projectId);
    if (res.status === 1) {
      props.dispatch({ type: 'case/setModuleTree', payload: res.data });
      setTreeData(res.data);
    } else {
      message.warning(res.error);
    }
  };

  const selectHandler = (keys, { node }) => {
    if (keys.length !== 0) {
      const currentModule = {
        name: node.name,
        id: node.id,
        parentId: node.parentId,
      };
      props.dispatch({
        type: 'case/setSelectedModule',
        payload: currentModule,
      });
    }
  };
  const finishHandler = async value => {
    var res;
    if (option === 0) {
      res = await createModule(value.name, 0, props.projectId);
    } else if (option === 1) {
      res = await createModule(
        value.name,
        props.selectedModule.id,
        props.projectId,
      );
    } else {
      res = await updateModule(
        value.name,
        props.selectedModule.id,
        props.projectId,
        props.selectedModule.parentId,
      );
    }
    if (res.status === 1) {
      message.success(option === 2 ? '编辑成功' : '创建成功');
      setVisible(false);
      getData();
    } else {
      message.warning(res.error);
    }
  };

  const renderTree = () => {
    if (treeData.length === 0) {
      return null;
    } else {
      return (
        <Tree
          switcherIcon={<DownOutlined />}
          showIcon={true}
          treeData={processData(treeData)}
          blockNode={true}
          onSelect={selectHandler}
          selectedKeys={
            props.selectedModule.id ? [props.selectedModule.id] : []
          }
          defaultExpandAll={true}
        />
      );
    }
  };
  return (
    <div>
      <div className={styles.title}>
        <OrderedListOutlined style={{ marginRight: 20 }} />
        <span>模块列表</span>
        <Button
          icon={<PlusOutlined />}
          type={'primary'}
          style={{ float: 'right' }}
          onClick={() => {
            form.resetFields();
            setVisible(true);
            setOption(0);
          }}
        />
      </div>
      <div>
        {renderTree()}
        <Modal
          title={getModalTitle()}
          visible={visible}
          footer={false}
          onCancel={() => setVisible(false)}
          forceRender={true}
        >
          <Form form={form} onFinish={finishHandler}>
            <Form.Item
              label={'模块名'}
              name={'name'}
              rules={[{ required: true, message: '必填' }]}
              wrapperCol={{ span: 14 }}
              labelCol={{ span: 5 }}
            >
              <Input placeholder={'请输入模块名'} autoComplete={'off'} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 5 }}>
              <Button htmlType={'submit'} type={'primary'}>
                创建
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    selectedModule: state.case.selectedModule,
  };
};
export default connect(mapStateToProps)(ModuleTree);
