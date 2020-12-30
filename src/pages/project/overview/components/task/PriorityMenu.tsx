import React, { useState } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { bugPriorityEnum, bugPriorityBgColor } from '@/utils/enums';
import styles from '../columns/index.less';

interface PriorityMenuProps {
  value?: any;
  onChange?: (v: any) => void;
  onSave?: (v: any) => void
}

const PriorityMenu: React.FC<PriorityMenuProps> = props => {
  const clickHandler = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    key = parseInt(key);
    if (props.onSave){
      props.onSave(key)
    }else {
      props.onChange(key);
    }
  };

  const menu = (
    <Menu onClick={clickHandler} selectedKeys={props.value?[props.value.toString()]:[]}>
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
          backgroundColor: bugPriorityBgColor[props.value],
          color: 'white',
          width: 32,
          height: 16,
        }}
        onClick={e => e.stopPropagation()}
      >
        {bugPriorityEnum[props.value]}
      </div>
    </Dropdown>
  );
};

export default PriorityMenu;
