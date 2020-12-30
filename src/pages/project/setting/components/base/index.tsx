import React, { useEffect, useState } from 'react';
import { Upload, Button, message, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadProjectImgApi, getProjectById, updateProjectById } from '@/pages/project/service';
import styles from './index.less';
import ProjectMember from '@/pages/project/components/projectMember';

interface BaseProps {
  projectId: number
}

const Base: React.FC<BaseProps> = (props) => {
  const [projectImgUrl, setProjectImgUrl] = useState('');
  const [form] = Form.useForm();
  const getData = async () => {
    const res = await getProjectById(props.projectId);
    if (res.status === 1) {
      const projectMember = res.data.member.map(item => {
        return {
          id: item.id,
          cname: item.cname,
          briefName: item.cname.substring(item.cname.length - 2, item.cname.length),
          disabled: item.id === res.data.creator,
        };
      });
      setProjectImgUrl(res.data.img.url);
      form.setFieldsValue({
        projectName: res.data.name,
        projectMember,
        projectDesc: res.data.remark,
      });
    } else {
      message.warning(res.error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onCustomRequest = async (file) => {
    const res = await uploadProjectImgApi(file, props.projectId);
    if (res.status === 1) {
      message.success('上传成功');
      setProjectImgUrl(res.data.url);
    } else {
      message.warning(res.error);
    }
  };

  const onFinish = async (value) => {
    const projectMember = value.projectMember.map(item => {
      return item.id;
    });
    const postData = {
      ...value,
      id: props.projectId,
      projectMember,
    };
    const res = await updateProjectById(postData);
    if (res.status === 1) {
      message.success('更新成功');
      getData();
    } else {
      message.warning(res.error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <Form
          layout={'vertical'}
          onFinish={onFinish}
          hideRequiredMark={true}
          form={form}
          initialValues={{
            projectName: '',
            projectDesc: '',
            projectMember: [],
          }}
        >
          <Form.Item
            name='projectName'
            label='项目名称'
            rules={[{ required: true, message: '必填' }]}
          >
            <Input
              placeholder='请输入项目名称'
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name='projectDesc'
            label='项目简介'
          >
            <Input.TextArea
              placeholder='请输入项目简介'
              allowClear={true}
              autoSize={{ minRows: 1, maxRows: 6 }}
              maxLength={200}
            />
          </Form.Item>
          <Form.Item
            label='项目成员'
            name='projectMember'
          >
            <ProjectMember />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType="submit">更新项目</Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <div className={styles.avatarTitle}>
          项目封面
        </div>
        <div className={styles.avatarImg}>
          <img src={projectImgUrl} alt={'avatar'} />
        </div>
        <Upload
          showUploadList={false}
          accept='image/*'
          customRequest={onCustomRequest}
          name='projectImg'
        >
          <div className={styles.avatarButton}>
            <Button icon={<UploadOutlined />}>
              更换封面
            </Button>
          </div>
        </Upload>
      </div>
    </div>
  );
};
export default Base;
