import React, { useEffect, useState } from 'react';
import Flow from '../components/flow';
import { useParams } from 'umi';
import { getEditorById, updateEditor } from '@/pages/project/editor/service';
import { message } from 'antd';
import { EditorInfo } from '@/pages/project/editor/data';
import styles from './index.less';
import GGEditor from 'gg-editor';

const EditorDetail = props => {
  const params = useParams<any>();
  const projectId = params.id;
  const editorId = params.eid;
  const [dataSource, setDataSource] = useState<Partial<EditorInfo>>({});
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getEditorById(editorId);
    if (res.status === 1) {
      res.data.data = JSON.parse(res.data.data);
      setDataSource(res.data);
    } else {
      message.warning(res.error);
    }
  };

  const savehandler = async (eId, data) => {
    let res = await updateEditor(
      eId,
      projectId,
      null,
      JSON.stringify(data),
      null,
    );
    if (res.status === 1) {
      message.success('修改成功');
    } else {
      message.warning(res.error);
    }
  };

  const renderEditor = () => {
    if (dataSource?.type == 1) {
      return <Flow data={dataSource.data} onSave={savehandler} />;
    }
  };
  return <GGEditor className={styles.editor}>{renderEditor()}</GGEditor>;
};

export default EditorDetail;
