import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, TreeSelect, Select, Modal, message, Tooltip } from 'antd';
import TableForm from './TableForm';
import { priorityEnum } from '@/utils/enums';
import { CaseModule, Case } from '@/pages/project/case/data';
import { createProjectCase, updateProjectCase } from '@/pages/project/case/service';
import { connect } from 'umi';

interface CreateCaseModalProps {
  visible: boolean
  cancelHandler: () => void
  currentCase: Partial<Case>
  selectedModule: CaseModule
  moduleTree: CaseModule[]
  afterHandler: () => void
  projectId: number
}

const CreateCaseModal: React.FC<CreateCaseModalProps> = (props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      var value;
      var initSteps = [];
      if (props.currentCase.steps) {
        props.currentCase.steps.forEach((item, index) => {
          item.key = index + 1;
          initSteps.push(item);
        });
      }
      initSteps.push({ key: initSteps.length + 1, step: null, exception: null });
      value = {
        caseName: props.currentCase.name,
        caseModule: props.currentCase.moduleId || props.selectedModule.id,
        priority: props.currentCase.priority ? props.currentCase.priority.toString() : undefined,
        precondition: props.currentCase.precondition,
        remark: props.currentCase.remark,
        caseStep: initSteps,
      };
      form.setFieldsValue(value);
    }, [props.currentCase, props.selectedModule]);


    const finishHandler = async (value) => {
      let postData = {
        name: value.caseName,
        module_id: value.caseModule,
        priority: value.priority,
        precondition: value.precondition,
        remark: value.remark,
        steps: value.caseStep.filter(item => {
          return item.step || item.exception;
        }),
        project_id: props.projectId,
      };
      setLoading(true);
      var res;
      if (props.currentCase.id) {
        postData['id'] = props.currentCase.id;
        res = await updateProjectCase(postData);
      } else {
        res = await createProjectCase(postData);
      }
      if (res.status === 1) {
        message.success(props.currentCase.id ? '修改成功' : '创建成功');
      } else {
        message.warning(res.error);
      }
      setLoading(false);
      props.afterHandler();
    };
    const processData = (list) => {
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
        parents.forEach((parent) => {
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
              typeof parent.children !== 'undefined' ? parent.children.push(child) : parent.children = [child];
            }
          });

        });
      };
      translator(parents, childrens);
      return parents;
    };
    return (
      <Modal
        forceRender={true}
        visible={props.visible}
        onCancel={props.cancelHandler}
        width={1000}
        title={props.currentCase.id ? '编辑用例' : '新建用例'}
        bodyStyle={{ padding: '24px 100px' }}
        onOk={() => form.submit()}
        maskClosable={false}
        confirmLoading={loading}
      >
        <Form
          form={form}
          labelAlign={'left'}
          onFinish={finishHandler}
        >
          <Row>
            <Col
              span={12}
            >
              <Form.Item
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
                label={'用例名称'}
                name={'caseName'}
                rules={[{ required: true, message: '必填!' }]}
              >
                <Input autoComplete={'off'} placeholder={'请输入用例名称'} />
              </Form.Item>
            </Col>
            <Col
              span={12}
            >
              <Form.Item
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
                label={'所属模块'}
                name={'caseModule'}
                rules={[{ required: true, message: '必填!' }]}
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={processData(props.moduleTree)}
                  placeholder="请选择模块"
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
            <Col
              span={12}
            >
              <Form.Item
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 8 }}
                label={'优先级'}
                name={'priority'}
                rules={[{ required: true, message: '必填!' }]}
              >
                <Select
                  placeholder='请选择优先级'
                  bordered={true}
                >
                  {Object.keys(priorityEnum).map(key => {
                    return (
                      <Select.Option value={key} key={key}>
                        {priorityEnum[key]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col
              span={24}>
              <p style={{ color: '#000000D9' }}>前置条件:</p>
            </Col>
            <Col
              span={24}
            >
              <Form.Item
                name={'precondition'}
              >
                <Input.TextArea
                  placeholder='请输入前置条件'
                  allowClear={true}
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
            <Col
              span={24}>
              <p style={{ color: '#000000D9' }}>用例步骤:</p>
            </Col>
            <Col
              span={24}
            >
              <Form.Item
                name={'caseStep'}
              >
                <TableForm />
              </Form.Item>
            </Col>
            <Col
              span={24}>
              <p style={{ color: '#000000D9' }}>备注:</p>
            </Col>
            <Col
              span={24}
            >
              <Form.Item
                name={'remark'}
              >
                <Input.TextArea
                  placeholder='请输入用例备注'
                  allowClear={true}
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
;

const mapStateToProps = (state) => {
  return {
    moduleTree: state.case.moduleTree,
    selectedModule: state.case.selectedModule,
  };
};
export default connect(mapStateToProps)(CreateCaseModal);
