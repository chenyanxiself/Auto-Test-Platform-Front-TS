import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import {connect} from 'umi'
import ProjectMember from '@/pages/project/components/projectMember';
import ProjectImgUpload from '@/pages/project/components/projectImgUpload';
import { delProjectImgApi, uploadProjectImgApi } from '@/pages/project/service';
interface CreateProjectModalProps{
  cancelHandler:()=>void
  isModalVisible:boolean
  finishHandler:(value:{[props:string]:any})=>void
  [props:string]:any
}
const CreateProjectModal:React.FC<CreateProjectModalProps> = (props) => {
  const {cancelHandler,isModalVisible,finishHandler} = props
  const formItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 11
    },
  }
  const customRequestHandle = async (file) => {
    const res = await uploadProjectImgApi(file)
    if (res.status === 1) {
      file.onSuccess(res)
    } else {
      file.onError()
    }
  }
  const removeHandle = async (file) => {
    const res = await delProjectImgApi(file.name)
    if(res.status===1){
      message.success('删除图片成功')
      return true
    }else{
      message.error('删除图片失败: '+res.error)
      return false
    }
  }
  return (
    <Modal
      className='project-modal'
      visible={isModalVisible}
      onCancel={cancelHandler}
      width={800}
      title={<div style={{ textAlign: 'center' }}>新建项目</div>}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        {...formItemLayout}
        onFinish={finishHandler}
        name='projectForm'
        initialValues={{
          projectMember: [{
            id: props.user.id,
            cname: props.user.cname,
            briefName: props.user.cname.substring(props.user.cname.length - 2, props.user.cname.length),
            disabled: true,
          }],
          projectImg:[]
        }}
      >
        <Form.Item
          name='projectName'
          label='项目名称'
          rules={[{required: true, message: '必填'}]}
        >
          <Input placeholder='请输入项目名称' autoComplete="off"/>
        </Form.Item>
        <Form.Item
          name='projectDesc'
          label='项目简介'
        >
          <Input.TextArea
            placeholder='请输入项目简介'
            allowClear={true}
            autoSize={{minRows: 4, maxRows: 6}}
            maxLength={200}
          />
        </Form.Item>
        <Form.Item
          label='项目成员'
          name='projectMember'
        >
          <ProjectMember/>
        </Form.Item>
        <Form.Item
          label='项目封面'
          name='projectImg'
        >
          <ProjectImgUpload
            customRequestHandle={customRequestHandle}
            removeHandle={removeHandle}
          />
        </Form.Item>
        <Form.Item wrapperCol={{offset: 10}}>
          <Button type='primary' htmlType="submit">确认新建</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const mapStateToProps = ({ global }) => ({
  user:global
});
export default connect(mapStateToProps)(CreateProjectModal);
