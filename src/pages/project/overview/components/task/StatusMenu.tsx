import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { BorderOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { TaskInfo } from '@/pages/project/overview/data';
import { connect, Dispatch } from 'umi';
import { ColumnsInfo, ProgressInfo } from '../../data';
import {updateTask} from '../../service'

interface StatusMenuProps {
  row: TaskInfo;
  dataSource: ColumnsInfo[];
  progress: ProgressInfo
  dispatch: Dispatch;
  projectId:number
}

const StatusMenu: React.FC<StatusMenuProps> = props => {
  const [isStatusHover, setStatusHover] = useState(false);
  const [selectedKey, setSelectedKey] = useState(undefined);

  useEffect(()=>{
    setSelectedKey(props.row.status)
  },[props.row.status])

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

  const clickHandler = async({ key }) => {
    key = parseInt(key)
    if (key !== selectedKey) {
      const res = await updateTask(props.projectId,props.row.id,key)
      if (res.status!==1){
        return message.warning(res.error)
      }
      let finish = props.progress.finish;
      key === 1 ? finish += 1 : finish -= 1;
      props.dispatch({
        type: 'overview/setProgress',
        payload: {
          ...props.progress,
          finish,
        },
      });
      setSelectedKey(key)
    }
  };

  const menu = (
    <Menu onClick={clickHandler} selectedKeys={[selectedKey]}>
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
        {statusEnum[selectedKey]}
      </div>
    </Dropdown>
  );
};
const mapStateToProps = state => {
  return {
    dataSource: state.overview.columnsList,
    progress: state.overview.progress,
  };
};
export default connect(mapStateToProps)(StatusMenu);
