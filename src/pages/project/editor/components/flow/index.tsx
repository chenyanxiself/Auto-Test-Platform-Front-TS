import { Col, message, Row } from 'antd';
import GGEditor, { Flow } from 'gg-editor';
import { useParams } from 'umi';
import React, { useEffect, useState } from 'react';
import EditorMinimap from './components/EditorMinimap';
import { FlowContextMenu } from './components/EditorContextMenu';
import { FlowDetailPanel } from './components/EditorDetailPanel';
import { FlowItemPanel } from './components/EditorItemPanel';
import { FlowToolbar } from '../EditorToolbar';
import styles from './index.less';
import { updateEditor } from '@/pages/project/editor/service';

GGEditor.setTrackable(false);

interface FlowGraphProps {
  data: any;
}

const FlowGraph: React.FC<FlowGraphProps> = props => {
  const params = useParams<any>();
  const projectId = params.id;
  const eId = params.eid;
  const [saveLoading, setSaveLoading] = useState(false);
  // var dataSource = JSON.parse(JSON.parse(JSON.stringify(props.data)));
  const [dataSource, setDataSource] = useState({});
  useEffect(() => {
    setDataSource({ ...JSON.parse(props.data) });
  }, [props.data]);

  console.log(dataSource);
  const saveHandler = async () => {
    setSaveLoading(true);
    let res = await updateEditor(
      eId,
      projectId,
      null,
      JSON.stringify(dataSource),
      null,
    );
    setSaveLoading(false);
    if (res.status === 1) {
      message.success('修改成功');
    } else {
      message.warning(res.error);
    }
  };

  const changeHandler = e => {
    console.log(e);
    if (e.action == 'changeData') {
    }

    // let eType;
    // switch (e.action) {
    //   case 'add':
    //     eType = `${e.item.type}s`;
    //     if (dataSource[eType]) {
    //       dataSource[eType].push(e.model);
    //     } else {
    //       dataSource[eType] = [e.model];
    //     }
    //     break;
    //   case 'update':
    //     eType = `${e.item.type}s`;
    //     for (var i = 0; i < dataSource[eType].length; i++) {
    //       if (dataSource[eType][i].id == e.item.id) {
    //         dataSource[eType][i] = { ...dataSource[eType][i], ...e.updateModel };
    //         break;
    //       }
    //     }
    //     break;
    //   case 'remove':
    //     const removeList = e.affectedItemIds;
    //     for (const key of Object.keys(dataSource)) {
    //       dataSource[key] = dataSource[key].filter(item => removeList.indexOf(item.id) == -1);
    //     }
    //     break;
    //   default:
    //     break;
    // }
  };

  return (
    <GGEditor className={styles.editor}>
      <Row className={styles.editorHd}>
        <Col span={24}>
          <FlowToolbar clickHandler={saveHandler} loading={saveLoading} />
        </Col>
      </Row>
      <Row className={styles.editorBd}>
        <Col span={3} className={styles.editorSidebar}>
          <FlowItemPanel />
        </Col>
        <Col span={16} className={styles.editorContent}>
          <Flow
            className={styles.flow}
            data={dataSource}
            onAfterChange={changeHandler}
          />
        </Col>
        <Col span={5} className={styles.editorSidebar}>
          <FlowDetailPanel />
          <EditorMinimap />
        </Col>
      </Row>
      <FlowContextMenu />
    </GGEditor>
  );
};

export default FlowGraph;
