import { Button, Divider } from 'antd';
import React from 'react';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';
import { history } from '@@/core/history';

interface MindToolbarProps {
  clickHandler: (e: any) => void;
  loading: boolean;
}

const MindToolbar: React.FC<MindToolbarProps> = props => (
  <div className={styles.main}>
    <Toolbar className={styles.toolbar}>
      <ToolbarButton command="undo" />
      <ToolbarButton command="redo" />
      <Divider type="vertical" />
      <ToolbarButton command="zoomIn" icon="zoom-in" text="Zoom In" />
      <ToolbarButton command="zoomOut" icon="zoom-out" text="Zoom Out" />
      <ToolbarButton command="autoZoom" icon="fit-map" text="Fit Map" />
      <ToolbarButton
        command="resetZoom"
        icon="actual-size"
        text="Actual Size"
      />
      <Divider type="vertical" />
      <ToolbarButton command="append" text="Topic" />
      <ToolbarButton
        command="appendChild"
        icon="append-child"
        text="Subtopic"
      />
      <Divider type="vertical" />
      <ToolbarButton command="collapse" text="Fold" />
      <ToolbarButton command="expand" text="Unfold" />
    </Toolbar>
    <div>
      <Button
        onClick={() => {
          history.goBack();
        }}
        style={{ marginRight: 8 }}
        size={'small'}
      >
        返回
      </Button>
      <Button
        onClick={props.clickHandler}
        type={'primary'}
        size={'small'}
        loading={props.loading}
      >
        保存
      </Button>
    </div>
  </div>
);

export default MindToolbar;
