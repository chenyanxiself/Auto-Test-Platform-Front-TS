import React, { useEffect, useState } from 'react';
import Flow from '../components/flow';
import { useParams } from 'umi';
import { getEditorById } from '@/pages/project/editor/service';
import { message } from 'antd';
import { EditorInfo } from '@/pages/project/editor/data';

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
      setDataSource(res.data);
    } else {
      message.warning(res.error);
    }
  };
  const renderComponent = () => {
    if (dataSource?.type == 1) {
      return <Flow data={dataSource.data} />;
    } else {
      return <div>{JSON.stringify(dataSource)}</div>;
    }
  };
  return renderComponent();
};

export default EditorDetail;
