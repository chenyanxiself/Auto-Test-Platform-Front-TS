import { Col, Row } from 'antd';
import GGEditor, { Flow, withPropsAPI } from 'gg-editor';
import { useParams } from 'umi';
import React, { useState } from 'react';
import EditorMinimap from '../EditorMinimap';
import { FlowContextMenu } from '../EditorContextMenu';
import { FlowDetailPanel } from '../EditorDetailPanel';
import { FlowItemPanel } from '../EditorItemPanel';
import { FlowToolbar } from '../EditorToolbar';
import styles from './index.less';

GGEditor.setTrackable(false);

interface FlowGraphProps {
  data: any;
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
    await props.onSave(eId, propsAPI.save());
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
