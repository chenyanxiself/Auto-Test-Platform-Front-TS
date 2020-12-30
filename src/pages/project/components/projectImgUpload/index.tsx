import React, { useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface ProjectImgUpload {
  customRequestHandle: (f: any) => void
  removeHandle: (f: any) => Promise<boolean>
  value?: any
  onChange?: any
  maxLength?: number
  onSave?: any
}

const ProjectImgUpload: React.FC<ProjectImgUpload> = (props) => {
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setIsModalVisible(true);
  };

  const handleChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      const fileUid = file.uid;
      let targetFileInFileList = fileList.find(f => f.uid === fileUid);
      targetFileInFileList.name = file.response.data.fileName;
      targetFileInFileList.url = file.response.data.url;
      targetFileInFileList.id = file.response.data.id;
      if (props.onSave) {
        props.onSave(fileList);
      } else {
        props.onChange(fileList);
      }
      message.success('上传图片成功');
    } else if (file.status === 'error') {
      message.error('上传图片失败');
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const onCustomRequest = async (file) => {
    await props.customRequestHandle(file);
  };
  const handleRemove = async (file) => {
    const isSuccess = await props.removeHandle(file);
    if (isSuccess) {
      const newFileList = props.value.filter(f => f.id != file.id);
      if (props.onSave) {
        props.onSave(newFileList);
      } else {
        props.onChange(newFileList);
      }
    }
  };
  const maxLength = props.maxLength ? props.maxLength : 1;
  const valueLength = props.value ? props.value.length : 0;
  return (
    <div className="clearfix">
      <Upload
        accept='image/*'    //只能接受图片,设置接受的文件属性
        customRequest={onCustomRequest}
        listType="picture-card"
        name='projectImg'   //后台接受文件的参数名
        fileList={props.value}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {valueLength >= maxLength ? null : uploadButton}
      </Upload>
      <Modal
        visible={isModalVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ProjectImgUpload;
