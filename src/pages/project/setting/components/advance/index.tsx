import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import {history} from 'umi'
import styles from './index.less';
import { getProjectById, updateProjectType, deleteProject } from '@/pages/project/service';

const Advance = (props) => {
  const [projectType, setProjectType] = useState(1);
  const [isFiledVisible, setIsFiledVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getProjectById(props.projectId);
    if (res.status === 1) {
      setProjectType(res.data.type);
    } else {
      message.warning(res.error);
    }
  };
  const getFiledButton = () => {
    let buttonText = '归档项目';
    if (projectType === 0) {
      buttonText = '激活项目';
    }
    return <Button
      type={'primary'}
      ghost={true}
      onClick={
        () => {setIsFiledVisible(true)}
      }
      danger={projectType !== 0}
    >{buttonText}</Button>;
  };

  const onFiledOk = async() => {
    const res = await updateProjectType(props.projectId,!projectType)
    if (res.status===1){
      message.success('操作成功')
      setIsFiledVisible(false)
      getData()
    }else {
      message.warning(res.error)
    }
  }

  const onDeleteOk = async() => {
    const res = await deleteProject(props.projectId)
    if (res.status===1){
      message.success('操作成功')
      history.replace('/project/')
    }else {
      message.warning(res.error)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.item}>
        <div>
          <span className={styles.title}>归档项目</span>
          <div className={styles.text}>
            归档后,所有项目数据不可再次编辑,只可查看,您可以重新激活项目
          </div>
        </div>
        <div>
          {getFiledButton()}
        </div>
      </div>
      <div className={styles.item}>
        <div>
          <span className={styles.title}>删除项目</span>
          <div className={styles.text}>
            删除后,该项目无法复原
          </div>
        </div>
        <div>
          <Button
            type={"primary"}
            danger={true}
            onClick={() => setIsDeleteVisible(true)}
          >删除项目</Button>
        </div>
      </div>
      <Modal
        title={projectType === 1 ? '归档项目' : '激活项目'}
        visible={isFiledVisible}
        destroyOnClose={true}
        onOk={onFiledOk}
        onCancel={() =>setIsFiledVisible(false)}
      >
        <span>{projectType === 1 ? '是否确认归档项目?' : '是否确认激活项目?'}</span>
      </Modal>
      <Modal
        title={'删除项目'}
        visible={isDeleteVisible}
        destroyOnClose={true}
        onOk={onDeleteOk}
        onCancel={() => setIsDeleteVisible(false)}
      >
        <span>删除后,该项目数据无法复原,确认删除该项目?</span>
      </Modal>
    </div>
  );

};

export default Advance;