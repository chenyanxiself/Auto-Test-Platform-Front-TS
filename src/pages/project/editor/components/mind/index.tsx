import { Col, Row } from 'antd';
import GGEditor, { Mind, withPropsAPI } from 'gg-editor';
import { useParams } from 'umi';
import React, { useState } from 'react';
import EditorMinimap from '../EditorMinimap';
import { MindContextMenu } from '../EditorContextMenu';
import { MindDetailPanel } from '../EditorDetailPanel';
import { FlowToolbar, MindToolbar } from '../EditorToolbar';
import styles from './index.less';

GGEditor.setTrackable(false);

interface MindGraphProps {
  data: any;
  onSave: any;
  propsAPI?: any;
}

const MindGraph: React.FC<MindGraphProps> = props => {
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
          <MindToolbar clickHandler={saveHandler} loading={saveLoading} />
        </Col>
      </Row>
      <Row className={styles.editorBd}>
        <Col span={20} className={styles.editorContent}>
          <Mind className={styles.mind} data={props.data} />
        </Col>
        <Col span={4} className={styles.editorSidebar}>
          <MindDetailPanel />
          <EditorMinimap />
        </Col>
      </Row>
      <MindContextMenu />
    </>
  );
};

export default withPropsAPI(MindGraph as any);
