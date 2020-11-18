import React, { useEffect, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { TaskInfo } from '@/pages/project/overview/data';
import { connect, Dispatch } from 'umi';
import { ColumnsInfo } from '../../data';

interface StatusMenuProps {
  row: TaskInfo;
  dataSource: ColumnsInfo[];
  dispatch: Dispatch;
}

const StatusMenu: React.FC<StatusMenuProps> = props => {
  const [isStatusHover, setStatusHover] = useState(false);

  const { status } = props.row;

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

  const clickHandler = ({ key }) => {
    if (key !== status) {
      //TODO api

      const newData = [...props.dataSource];
      for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < newData[i].taskList.length; j++) {
          if (newData[i].taskList[j].id === props.row.id) {
            newData[i].taskList[j].status = parseInt(key);
            props.dispatch({
              type: 'overview/setColumnsList',
              payload: newData,
            });
            return;
          }
        }
      }
    }
  };

  const menu = (
    <Menu onClick={clickHandler}>
      <Menu.Item key={1}>{statusEnum[1]}</Menu.Item>
      <Menu.Item key={2}>{statusEnum[2]}</Menu.Item>
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
const mapStateToProps = state => {
  return {
    dataSource: state.overview.columnsList,
  };
};
export default connect(mapStateToProps)(StatusMenu);
