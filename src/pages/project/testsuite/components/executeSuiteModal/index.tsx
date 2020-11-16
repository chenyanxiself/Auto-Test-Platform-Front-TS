import React, { useEffect, useState } from 'react';
import { Modal, Form, Checkbox, Button, message } from 'antd';
import Host from '@/pages/project/apicase/components/createApiCaseModal/Host';
import RequestArgsModal from '@/pages/project/apicase/components/createApiCaseModal/RequestArgsModal';
import { getEnvByProjectId } from '@/pages/project/service';

interface ExecuteSuiteModalProps {
  visible: boolean
  cancelHandler: () => void
  finishHandler: (value) => void
  projectId:number
}

const ExecuteSuiteModal: React.FC<ExecuteSuiteModalProps> = (props) => {
  const [envSections, setEnvSections] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        isSaveCookie: true,
        globalHost: {
          isUseEnv: true,
          requestHost: undefined,
          envHost: undefined,
        },
      });
    }
  }, [props.visible]);

  useEffect(()=>{
    getEnvData()
  },[])

  const getEnvData = async () => {
    const res = await getEnvByProjectId(props.projectId);
    if (res.status === 1) {
      setEnvSections(res.data);
    } else {
      message.warning(res.error);
    }
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.cancelHandler}
      title={'执行测试集'}
      footer={null}
      width={600}
      forceRender={true}
    >
      <Form
        {...layout}
        form={form}
        onFinish={props.finishHandler}
        labelAlign={'left'}
      >
        <Form.Item
          label={'全局域名'}
          name={'globalHost'}
        >
          <Host envSections={envSections}/>
        </Form.Item>
        <Form.Item
          label={'全局请求头'}
          name={'globalHeaders'}
        >
          <RequestArgsModal />
        </Form.Item>
        <Form.Item
          {...tailLayout}
          name="isSaveCookie"
          valuePropName="checked"
        >
          <Checkbox>自动保存Cookie</Checkbox>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            htmlType={'submit'}
            type={'primary'}
          >提交</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExecuteSuiteModal;