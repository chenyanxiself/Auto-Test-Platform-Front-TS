import { Divider, Button } from 'antd';
import React from 'react';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';
import { history } from 'umi';

interface FlowToolbarProps {
  clickHandler: (e: any) => void;
  loading: boolean;
}

const FlowToolbar: React.FC<FlowToolbarProps> = props => (
  <div className={styles.main}>
    <Toolbar className={styles.toolbar}>
      <ToolbarButton command="undo" />
      <ToolbarButton command="redo" />
      <Divider type="vertical" />
      <ToolbarButton command="copy" />
      <ToolbarButton command="paste" />
      <ToolbarButton command="delete" />
      <Divider type="vertical" />
      <ToolbarButton command="zoomIn" icon="zoom-in" text="Zoom In" />
      <ToolbarButton command="zoomOut" icon="zoom-out" text="Zoom Out" />
      <ToolbarButton command="autoZoom" icon="fit-map" text="Fit Map" />
      <ToolbarButton
        command="resetZoom"
        icon="actual-size"
        text="Actual Size"
      />
      {/*<Divider type="vertical" />*/}
      {/*<ToolbarButton command="toBack" icon="to-back" text="To Back" />*/}
      {/*<ToolbarButton command="toFront" icon="to-front" text="To Front" />*/}
      <Divider type="vertical" />
      <ToolbarButton
        command="multiSelect"
        icon="multi-select"
        text="Multi Select"
      />
      {/*<ToolbarButton command="addGroup" icon="group" text="Add Group" />*/}
      {/*<ToolbarButton command="unGroup" icon="ungroup" text="Ungroup" />*/}
    </Toolbar>
    <div>
      <Button
        onClick={() => {
          history.goBack();
        }}
        style={{ marginRight: 8 }}
        size={'small'}
        loading={props.loading}
      >
        返回
      </Button>
      <Button onClick={props.clickHandler} type={'primary'} size={'small'}>
        保存
      </Button>
    </div>
  </div>
);

export default FlowToolbar;
