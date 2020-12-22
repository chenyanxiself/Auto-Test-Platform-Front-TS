import React, { useState } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { TaskInfo } from '@/pages/project/overview/data';
import { connect, Dispatch } from 'umi';
import { ColumnsInfo, ProgressInfo } from '../../data';
import { updateTask } from '../../service';
import { bugPriorityEnum, bugPriorityBgColor } from '@/utils/enums';
import styles from './index.less';

interface PriorityMenuProps {
  row: TaskInfo;
  dataSource: ColumnsInfo[];
  dispatch: Dispatch;
  projectId: number;
}

const PriorityMenu: React.FC<PriorityMenuProps> = props => {

  const clickHandler = async ({ key, domEvent }) => {
    domEvent.stopPropagation();
    key = parseInt(key);
    if (key !== props.row.priority) {
      const res = await updateTask(props.projectId, props.row.id, props.row.status, key,props.row.follower,props.row.description);
      if (res.status !== 1) {
        return message.warning(res.error);
      }
      const newData = [...props.dataSource];
      for (let i = 0; i < newData.length; i++) {
        let targetRow = newData[i].taskList.find(
          item => item.id === props.row.id,
        );
        if (targetRow) {
          targetRow.priority = key;
          break;
        }
      }
      props.dispatch({
        type: 'overview/setColumnsList',
        payload: newData,
      });
    }
  };

  const menu = (
    <Menu onClick={clickHandler} selectedKeys={[props.row.status.toString()]}>
      <Menu.Item key={1}>
        <div style={{ backgroundColor: bugPriorityBgColor[1] }}
             className={styles.priorityEnum}>{bugPriorityEnum[1]}</div>
      </Menu.Item>
      <Menu.Item key={2}>
        <div style={{ backgroundColor: bugPriorityBgColor[2] }}
             className={styles.priorityEnum}>{bugPriorityEnum[2]}</div>
      </Menu.Item>
      <Menu.Item key={3}>
        <div style={{ backgroundColor: bugPriorityBgColor[3] }}
             className={styles.priorityEnum}>{bugPriorityEnum[3]}</div>
      </Menu.Item>
      <Menu.Item key={4}>
        <div style={{ backgroundColor: bugPriorityBgColor[4] }}
             className={styles.priorityEnum}>{bugPriorityEnum[4]}</div>
      </Menu.Item>
      <Menu.Item key={5}>
        <div style={{ backgroundColor: bugPriorityBgColor[5] }}
             className={styles.priorityEnum}>{bugPriorityEnum[5]}</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div
        style={{
          cursor: 'pointer',
          fontWeight: 400,
          lineHeight: '16px',
          padding: '0 4px',
          borderRadius: 2,
          marginRight: 4,
          fontSize: 12,
          backgroundColor: bugPriorityBgColor[props.row.priority],
          color: 'white',
        }}
        onClick={e => e.stopPropagation()}
      >
        {bugPriorityEnum[props.row.priority]}
      </div>
    </Dropdown>
  );
};
const mapStateToProps = state => {
  return {
    dataSource: state.overview.columnsList,
  };
};
export default connect(mapStateToProps)(PriorityMenu);
