import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons';

interface StatusMenuProps {
  value?: any;
  onChange?: (v: any) => void;
  onSave?: (v: any) => void
}

const StatusMenu: React.FC<StatusMenuProps> = props => {
  const [isStatusHover, setStatusHover] = useState(false);

  const statusEnum = {
    1: (
      <span style={{ color: 'green' }}>
        <CheckSquareOutlined />
        已完成
      </span>
    ),
    2: (
      <span style={{ color: 'red' }}>
        <BorderOutlined />
        未完成
      </span>
    ),
  };

  const clickHandler = async ({ key, domEvent }) => {
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
      <Menu.Item key={1}>{statusEnum[1]}</Menu.Item>
      <Menu.Item key={2}>{statusEnum[2]}</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div
        style={{
          backgroundColor: isStatusHover ? 'lightgray' : null,
          cursor: 'pointer',
          paddingLeft: 5,
          paddingRight: 5,
          width: 66,
          height: 22,
        }}
        onMouseOver={() => setStatusHover(true)}
        onMouseLeave={() => setStatusHover(false)}
        onClick={e => e.stopPropagation()}
      >
        {statusEnum[props.value]}
      </div>
    </Dropdown>
  );
};

export default StatusMenu;
