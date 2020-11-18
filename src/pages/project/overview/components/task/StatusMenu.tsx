import React, { useEffect, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { RowInfo } from '@/pages/project/overview/data';
import ex from 'umi/dist';

interface StatusMenuProps {
  row: RowInfo
}

const StatusMenu: React.FC<StatusMenuProps> = (props) => {
  const [isStatusHover, setStatusHover] = useState(false);
  const [status, setStatus] = useState<number | undefined>(undefined);

  useEffect(() => {
    setStatus(props.row.status);
  }, [props.row.status]);

  const statusEnum = {
    0: <span style={{color:'red'}}><BorderOutlined />未完成</span>,
    1: <span style={{color:'green'}}><CheckSquareOutlined />已完成</span>,
  };

  const clickHandler = ({ key }) => {
    console.log(key);
    if (key!==status){
      setStatus(key)
    }
  };

  const menu = (
    <Menu onClick={clickHandler}>
      <Menu.Item
        key={1}
      >
        {statusEnum[1]}
      </Menu.Item>
      <Menu.Item key={0}>
        {statusEnum[0]}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <div
        style={{
          backgroundColor: isStatusHover ? 'lightgray' : null,
          cursor: 'pointer',
          paddingLeft: 5,
          paddingRight: 5,
        }}
        onMouseOver={() => setStatusHover(true)}
        onMouseLeave={() => setStatusHover(false)}
      >
        {statusEnum[status]}
      </div>
    </Dropdown>
  );
};
export default StatusMenu;
