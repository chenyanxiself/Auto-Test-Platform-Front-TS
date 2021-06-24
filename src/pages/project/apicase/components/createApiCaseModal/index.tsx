import React, { useEffect, useState } from 'react';
import styles from './index.less';
import {
  Input,
  Form,
  Select,
  Button,
  Tabs,
  message,
  Spin,
  Modal,
  Row,
  Col,
} from 'antd';
import Host from './Host';
import { getStrDataFromJson, getJsonDataFromStr } from '@/utils/common';
import { singleCaseDebug } from '@/pages/project/apicase/service';
import { ApiCaseInfo } from '@/pages/project/apicase/data';
import { getEnvByProjectId } from '@/pages/project/service';
import ReactJson from 'react-json-view';
import EditableTable from '@/pages/project/apicase/components/createApiCaseModal/RequestArgs';
import axios from 'axios';
import { SuiteInfo } from '@/pages/project/apicase/data';

const { TabPane } = Tabs;

interface CreateApiCaseModalProps {
  visible: boolean;
  cancelHandler: () => void;
  afterHandler: (value: any) => void;
  currentApiCase: Partial<ApiCaseInfo>;
  projectId: number;
  suiteList: SuiteInfo[];
}

interface ResponseInfo {
  data: any;
  time: number;
  status: number;
  assert: any;
  isLoading: boolean;
}

const defaultResponse: ResponseInfo = {
  data: undefined,
  time: undefined,
  status: undefined,
  assert: undefined,
  isLoading: false,
};

const CreateApiCaseModal: React.FC<CreateApiCaseModalProps> = props => {
  const [response, setResponse] = useState<ResponseInfo>(defaultResponse);
  const [baseTabkey, setBaseTabkey] = useState<'case' | 'response'>('case');
  const [requestTabkey, setRequestTabKey] = useState<
    'Params' | 'Headers' | 'Body'
  >('Headers');
  const [resTabkey, setResTabkey] = useState<'row' | 'json'>('row');
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
    setResponse(defaultResponse);
    if (props.visible) {
      setBaseTabkey('case');
      setResTabkey('row');
      setRequestTabKey('Params');
      form.setFieldsValue({
        caseName: props.currentApiCase.caseName,
        suiteId: props.currentApiCase.suiteId,
        requestMehod: props.currentApiCase.requestMehod,
        requestUrl: props.currentApiCase.requestUrl,
        requestHost: props.currentApiCase.requestHost,
        requestHeaders: props.currentApiCase.requestHeaders,
        requestQuery: props.currentApiCase.requestQuery,
        requestBody: props.currentApiCase.requestBody,
      });
    }
  }, [props.visible]);

  useEffect(() => {
    getData();
  }, []);

  const okHandler = () => {
    form
      .validateFields()
      .then(async value => {
        props.afterHandler(value);
      })
      .catch();
  };

  const submitHandler = async value => {
    let url = value.requestUrl;
    if (value.requestHost && value.requestHost.isUseEnv) {
      const envHost = envSections.find(
        item => item.id == value.requestHost.envHost,
      ).host;
      try {
        let temp = new URL(url);
        const envTemp = new URL(envHost);
        temp.host = envTemp.host;
        url = temp.toString();
      } catch (e) {
        url = envHost + url;
      }
    }
    let requestProps = { url };
    if (value.requestMehod == 1) {
      requestProps['method'] = 'get';
    } else if (value.requestMehod == 2) {
      requestProps['method'] = 'post';
    }
    requestProps['headers'] = value.requestHeaders;
    requestProps['params'] = value.requestQuery;
    requestProps['data'] = value.requestBody;
    const instanse = axios.create({
      baseURL: '',
    });
    setResponse({ ...defaultResponse, isLoading: true });
    var start = Date.now();
    try {
      const res = await instanse.request(requestProps);
      var millis = Date.now() - start;
      setResponse({
        ...response,
        data: res.data,
        time: millis,
        status: res.status,
        isLoading: false,
      });
    } catch (e) {
      setResponse({
        ...response,
        data: '',
        time: 0,
        status: null,
        isLoading: false,
      });
      message.warning(e.toString());
    }
    setBaseTabkey('response');
  };

  const getExtra = () => {
    let styleAssert = { marginLeft: 8, marginRight: 20 };
    let styleStatus = { marginLeft: 8, marginRight: 20 };
    let styleTime = { marginLeft: 8, marginRight: 8 };
    if (response.status) {
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
          return Promise.reject();
        }
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.resolve();
    }
  };
  return (
    <Modal
      visible={props.visible}
      onCancel={props.cancelHandler}
      width={1000}
      title="用例编辑"
      onOk={okHandler}
      centered={true}
      bodyStyle={{ height: 580, paddingLeft: 5, paddingRight: 20 }}
      maskClosable={false}
      forceRender={true}
    >
      <div className={styles.main}>
        <Tabs
          activeKey={baseTabkey}
          onTabClick={(k: 'case' | 'response') => setBaseTabkey(k)}
          tabPosition={'left'}
        >
          <TabPane tab="Case" key="case" style={{ height: 532 }}>
            <Spin spinning={response.isLoading}>
              <Form onFinish={submitHandler} name="projecrCase" form={form}>
                <Row>
                  <Col span={18}>
                    <Form.Item
                      name="caseName"
                      label="用例名称"
                      rules={[{ required: true, message: '必填' }]}
                    >
                      <Input placeholder="请输入用例名称" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={5} offset={1}>
                    <Form.Item
                      name="suiteId"
                      label="测试集"
                      rules={[{ required: true, message: '必填' }]}
                    >
                      <Select
                        placeholder="选择集合"
                        allowClear={true}
                        bordered={true}
                      >
                        {props.suiteList.map(item => {
                          return (
                            <Select.Option value={item.id} key={item.id}>
                              {item.title}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      name="requestMehod"
                      label="请求方式"
                      rules={[{ required: true, message: '必填' }]}
                    >
                      <Select
                        placeholder="请求方式"
                        style={{ width: '80px' }}
                        bordered={true}
                      >
                        <Select.Option value={1}>Get</Select.Option>
                        <Select.Option value={2}>Post</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item
                      name="requestUrl"
                      rules={[{ required: true, message: '必填' }]}
                    >
                      <Input placeholder="请输入请求地址" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={2} offset={1}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        调试
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="requestHost"
                      label="请求域名"
                      rules={[{ validator: hostValidator }]}
                    >
                      <Host envSections={envSections} />
                    </Form.Item>
                  </Col>
                </Row>
                <Tabs
                  activeKey={requestTabkey}
                  onTabClick={(k: 'Params' | 'Headers' | 'Body') =>
                    setRequestTabKey(k)
                  }
                >
                  <TabPane tab="Params" key="Params">
                    <Form.Item name="requestQuery">
                      <EditableTable />
                    </Form.Item>
                  </TabPane>
                  <TabPane tab="Headers" key="Headers">
                    <Form.Item name="requestHeaders">
                      <EditableTable />
                    </Form.Item>
                  </TabPane>
                  <TabPane tab="Body" key="Body">
                    <Form.Item name="requestBody">
                      <Input.TextArea
                        style={{
                          resize: 'none',
                          width: '100%',
                          height: '100%',
                          minHeight: 260,
                          overflowY: 'auto',
                        }}
                      />
                    </Form.Item>
                  </TabPane>
                </Tabs>
              </Form>
            </Spin>
          </TabPane>
          <TabPane tab="Response" key="response">
            <Tabs
              activeKey={resTabkey}
              tabBarExtraContent={getExtra()}
              onTabClick={(k: 'row' | 'json') => setResTabkey(k)}
            >
              <TabPane tab="Rows" key="row">
                <div
                  style={{
                    border: '1px solid #d9d9d9',
                    height: 350,
                    overflowY: 'scroll',
                  }}
                >
                  <span>{getStrDataFromJson(response.data)}</span>
                </div>
              </TabPane>
              <TabPane tab="Json" key="json">
                <Spin spinning={response.isLoading}>
                  <div
                    style={{
                      border: '1px solid #d9d9d9',
                      height: 350,
                      overflowY: 'scroll',
                    }}
                  >
                    <div>
                      <ReactJson
                        src={getJsonDataFromStr(response.data)}
                        name={false}
                        iconStyle={'square'}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        enableClipboard={false}
                        shouldCollapse={false}
                      />
                    </div>
                  </div>
                </Spin>
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default CreateApiCaseModal;
