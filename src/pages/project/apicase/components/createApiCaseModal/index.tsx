import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Input, Form, Select, Button, Tabs, message, Spin, Modal } from 'antd';
import Host from './Host';
import RequestArgsModal from './RequestArgsModal';
import { getStrDataFromJson, getJsonDataFromStr } from '@/utils/common';
import { singleCaseDebug } from '@/pages/project/apicase/service';
import { ApiCaseInfo } from '@/pages/project/apicase/data';
import { getEnvByProjectId } from '@/pages/project/service';
import JSONTree from 'react-json-tree';

const { TabPane } = Tabs;

interface CreateApiCaseModalProps {
  visible: boolean
  cancelHandler: () => void
  afterHandler: (value: any) => void
  currentApiCase: Partial<ApiCaseInfo>
  projectId: number
}

interface ResponseInfo {
  data: any
  time: number
  status: number
  assert: any
  isLoading: boolean
}

const defaultResponse: ResponseInfo = {
  data: undefined,
  time: undefined,
  status: undefined,
  assert: undefined,
  isLoading: false,
};

const CreateApiCaseModal: React.FC<CreateApiCaseModalProps> = (props) => {
  const [response, setResponse] = useState<ResponseInfo>(defaultResponse);
  const [envSections, setEnvSections] = useState([]);
  const [form] = Form.useForm();

  const getData = async () => {
    const res = await getEnvByProjectId(props.projectId);
    if (res.status === 1) {
      setEnvSections(res.data);
    } else {
      message.warning(res.error);
    }
  };

  useEffect(() => {
    if (props.visible){
      setResponse(defaultResponse)
      form.setFieldsValue({
        caseName: props.currentApiCase.caseName,
        requestMehod: props.currentApiCase.requestMehod,
        requestPath: props.currentApiCase.requestPath,
        requestHost: props.currentApiCase.requestHost,
        requestHeaders: props.currentApiCase.requestHeaders,
        requestQuery: props.currentApiCase.requestQuery,
        requestBody: props.currentApiCase.requestBody,
      })
      getData();
    }
  }, [props.visible]);

  const okHandler = () => {
    form.validateFields()
      .then(async (value) => {
        props.afterHandler(value);
      })
      .catch();
  };

  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 17,
    },
  };

  const submitHandler = async (value) => {
    setResponse((pre) => ({ ...pre, isLoading: true }));
    let res = await singleCaseDebug(value);
    var newResponse = { ...response };
    if (res.status === 1) {
      newResponse.data = res.data.response;
      newResponse.status = res.data.status;
      newResponse.time = res.data.time;
      newResponse.assert = res.data.assert;
    } else {
      message.warning(res.error);
    }
    newResponse.isLoading = false;
    setResponse(newResponse);
  };

  const getExtra = () => {
    let styleAssert = { marginLeft: 8, marginRight: 20 };
    let styleStatus = { marginLeft: 8, marginRight: 20 };
    let styleTime = { marginLeft: 8, marginRight: 8 };
    if (response.status){
      const status = response.status.toString();
      if (status.startsWith('4') || status.startsWith('5')) {
        styleStatus['color'] = 'red';
        styleTime['color'] = 'red';
      } else {
        styleStatus['color'] = '#00CC00';
        styleTime['color'] = '#00CC00';
      }
    }
    var assertText;
    if (response.assert === 1) {
      assertText = 'pass';
      styleAssert['color'] = '#00CC00';
    } else if (response.assert === 0) {
      assertText = 'error';
      styleAssert['color'] = 'red';
    } else {
      assertText = '';
    }
    return (
      <span>
        {/*Assert:*/}
        {/*<span style={styleAssert}>{assertText}</span>*/}
        Status:
        <span style={styleStatus}>{response.status}</span>
        Time:
        <span style={styleTime}>{response.time}</span>
        ms
      </span>
    );
  };

  const hostValidator = (rule, value) => {
    if (value) {
      if (value.isUseEnv) {
        if (value.envHost) {
          return Promise.resolve();
        } else {
          return Promise.reject('必填');
        }
      } else {
        if (value.requestHost) {
          return Promise.resolve();
        } else {
          return Promise.reject('必填');
        }
      }
    } else {
      return Promise.reject('必填');
    }
  };
  return (
    <Modal
      visible={props.visible}
      onCancel={props.cancelHandler}
      width={1000}
      title='用例编辑'
      onOk={okHandler}
      centered={true}
      bodyStyle={{ height: 480 }}
      maskClosable={false}
      forceRender={true}
    >
      <div className={styles.main}>
        <div className={styles.left}>
          <Form
            {...formItemLayout}
            onFinish={submitHandler}
            name='projecrCase'
            form={form}
          >
            <Form.Item
              name='caseName'
              label='用例名称'
              rules={[{ required: true, message: '必填' }]}
            >
              <Input placeholder='请输入用例名称' autoComplete="off" />
            </Form.Item>
            <Form.Item
              name='requestMehod'
              label='请求方式'
              rules={[{ required: true, message: '必填' }]}
              wrapperCol={{
                span: 7,
              }}
            >
              <Select
                placeholder='请求方式'
                style={{ width: '80px' }}
                bordered={true}
              >
                <Select.Option value={1}>Get</Select.Option>
                <Select.Option value={2}>Post</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='requestPath'
              label='请求路径'
              rules={[{ required: true, message: '必填' }]}
            >
              <Input placeholder='请输入请求地址' autoComplete="off" />
            </Form.Item>
            <Form.Item
              name='requestHost'
              label='请求域名'
              required={true}
              rules={[{ validator: hostValidator }]}
            >
              <Host envSections={envSections} />
            </Form.Item>
            <Form.Item
              name='requestHeaders'
              label='请求头部'
            >
              <RequestArgsModal />
            </Form.Item>
            <Form.Item
              name='requestQuery'
              label='请求参数'
            >
              <RequestArgsModal />
            </Form.Item>
            <Form.Item
              name='requestBody'
              label='请求主体'
            >
              <RequestArgsModal />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Button type='primary' htmlType="submit">调试</Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.right}>
          <span>响应结果:</span>
          <Tabs defaultActiveKey="1" tabBarExtraContent={getExtra()}>
            <TabPane tab="Rows" key="1">
              <Spin
                spinning={response.isLoading}
              >
                <div style={{
                  border: '1px solid #d9d9d9',
                  height: 300,
                  overflowY: 'scroll',
                }}>
                  <span>{getStrDataFromJson(response.data)}</span>
                </div>
              </Spin>
            </TabPane>
            <TabPane tab="Json" key="2">
              <Spin
                spinning={response.isLoading}
              >
                <div style={{
                  border: '1px solid #d9d9d9',
                  height: 300,
                  overflowY: 'scroll',
                }}>
                  <div>
                    <JSONTree
                      invertTheme={true}
                      // hideRoot={true}
                      data={response.data || {}}
                      theme={{
                        scheme: 'london tube',
                        author: 'jan t. sott',
                        base00: '#231f20',
                        base01: '#1c3f95',
                        base02: '#5a5758',
                        base03: '#737171',
                        base04: '#959ca1',
                        base05: '#d9d8d8',
                        base06: '#e7e7e8',
                        base07: '#ffffff',
                        base08: '#ee2e24',
                        base09: '#f386a1',
                        base0A: '#ffd204',
                        base0B: '#00853e',
                        base0C: '#85cebc',
                        base0D: '#009ddc',
                        base0E: '#98005d',
                        base0F: '#b06110',
                      }}
                    />
                  </div>
                </div>
              </Spin>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
  );
};

export default CreateApiCaseModal;
