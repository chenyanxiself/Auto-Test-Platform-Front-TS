import React, { useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadProjectImgApi,delProjectImgApi } from '@/pages/project/service'
interface UploadInfo{
  previewImage:string
  previewTitle:string
  fileList:any[]
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const ProjectImgUpload=(props)=>{
  const [uploadInfo,setUploadInfo]=useState<UploadInfo>({
    previewImage:'',
    previewTitle:'',
    fileList:[]
  })
  const [isModalVisible,setIsModalVisible] = useState(false)
  const handleCancel = () => {
    setIsModalVisible(false)
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setUploadInfo(state=>({...state,
      previewImage: file.url || file.preview,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    }));
    setIsModalVisible(true)
  };
  const handleChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      const fileUid = file.uid
      let targetFileInFileList = fileList.find(file => file.uid === fileUid)
      targetFileInFileList.name = file.response.data.fileName
      targetFileInFileList.url = file.response.data.url
      props.onChange(targetFileInFileList.url)
      message.success('上传图片成功')
      setUploadInfo(state=>({...state,fileList}))
    } else if (file.status === 'error') {
      setUploadInfo(state=>({...state,fileList:[]}))
      message.error('上传图片失败')
    }
  };

  const handleRemove = async (file) => {
    const res = await delProjectImgApi(file.name)
    if(res.status===1){
      message.success('删除图片成功')
      setUploadInfo(state=>({...state,fileList:[]}))
      props.onChange(null)
      return true
    }else{
      message.error('删除图片失败: '+res.error)
      return false
    }
  }
  const onCustomRequest = async (file) => {
    const res = await uploadProjectImgApi(file)
    if (res.status === 1) {
      file.onSuccess(res)
    } else {
      file.onError()
    }
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <div className="clearfix">
      <Upload
        accept='image/*'    //只能接受图片,设置接受的文件属性
        customRequest={onCustomRequest}
        listType="picture-card"
        name='projectImg'   //后台接受文件的参数名
        fileList={uploadInfo.fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {uploadInfo.fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={isModalVisible}
        title={uploadInfo.previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={uploadInfo.previewImage} />
      </Modal>
    </div>
  );
}

export default ProjectImgUpload
