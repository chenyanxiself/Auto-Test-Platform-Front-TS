import React, { useState } from 'react';
import {Card, Menu} from 'antd'
import Base from '@/pages/project/setting/components/base';
import Env from '@/pages/project/setting/components/env';
import Advance from '@/pages/project/setting/components/advance';
import styles from './index.less'

const menuMap ={
  base : '基础设置',
  env : '环境设置',
  advance : '高级设置'
}

const Setting=(props)=>{
  const projectId = parseInt(props.match.params.id)
  const [selectedKey,setSelectedKey]=useState('base')
  const onMenuClick = (key) => {
    setSelectedKey(key)
  }
  const renderRight=()=>{
    switch (selectedKey) {
      case 'base':
        return <Base projectId={projectId}/>
      case 'env':
        return <Env projectId={projectId}/>
      case 'advance':
        return <Advance projectId={projectId}/>
      default:
        return null
    }
  }
  return  (
    <div className={styles.main}>
      <div className={styles.left}>
        <Menu
          mode={"inline"}
          // theme={"light"}
          selectedKeys={[selectedKey]}
          onClick={({key}) => onMenuClick(key)}
        >
          {
            Object.keys(menuMap).map(item => {
              return <Menu.Item key={item}>{menuMap[item]}</Menu.Item>
            })
          }
        </Menu>
      </div>
      <div className={styles.right}>
        <Card
          title={menuMap[selectedKey]}
          bordered={false}
        >
          {renderRight()}
        </Card>

      </div>
    </div>
  );
}

export default Setting
