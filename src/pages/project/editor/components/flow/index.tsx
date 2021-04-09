import { Col, message, Row } from 'antd';
import GGEditor, { Flow, withPropsAPI } from 'gg-editor';
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
  // onChange: any
  onSave: any;
  propsAPI?: any;
}

const FlowGraph: React.FC<FlowGraphProps> = props => {
  const params = useParams<any>();
  const eId = params.eid;
  const [saveLoading, setSaveLoading] = useState(false);
  const { propsAPI } = props;

  const saveHandler = async () => {
    setSaveLoading(true);
    props.onSave(eId, propsAPI.save());
    setSaveLoading(false);
  };

  return (
    <>
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
          <Flow className={styles.flow} data={props.data} />
        </Col>
        <Col span={5} className={styles.editorSidebar}>
          <FlowDetailPanel />
          <EditorMinimap />
        </Col>
      </Row>
      <FlowContextMenu />
    </>
  );
};

export default withPropsAPI(FlowGraph as any);
