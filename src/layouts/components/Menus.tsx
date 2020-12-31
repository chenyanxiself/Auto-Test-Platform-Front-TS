import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import MenusList from './MenusList';
import {history} from 'umi';

const { SubMenu } = Menu;
export default (props) => {
  const [selectedKeys,setSelectedKeys] = useState([])
  const [openKeys,setOpenKeys] = useState([])
  const [rootSubmenuKeys,setRootSubmenuKeyss] = useState([])
  useEffect(()=>{
    const pathname = history.location.pathname;
    const data=MenusList.reduce((pre, cur) => {
      if (cur.childMenu.length > 0) {
        pre.rootSubmenuKeys.push(cur.path);
        const isSelected = cur.childMenu.find(item => item.regExp.test(pathname));
        if (isSelected) {
          pre.openKeys.push(cur.path);
          pre.selectedKeys.push(isSelected.path);
        }
      } else {
        if (cur.regExp.test(pathname)) {
          pre.selectedKeys.push(cur.path);
        }
      }
      return pre;
    }, {
      selectedKeys: [],
      openKeys: [],
      rootSubmenuKeys: [],
    });
    setSelectedKeys(data.selectedKeys)
    setOpenKeys(data.openKeys)
    setRootSubmenuKeyss(data.rootSubmenuKeys)
  },[history.location.pathname])

  const onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  };

  const onMenuClick = (item) => {
    let {key, keyPath} = item
    if (key !== history.location.pathname) {
      setSelectedKeys(keyPath)
      history.push(key)
    }
  };

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      theme='dark'
      onClick={onMenuClick}
      selectedKeys={selectedKeys}
    >
      {
        MenusList.map(item => {
          if (item.childMenu.length > 0) {
            return (
              <SubMenu
                key={item.path}
                icon={item.icon}
                title={item.name}
              >
                {
                  item.childMenu.map(childItem => (
                    <Menu.Item
                      key={childItem.path}
                    >
                      {childItem.name}
                    </Menu.Item>
                  ))
                }
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={item.path}
                icon={item.icon}
              >
                {item.name}
              </Menu.Item>
            );
          }
        })}
    </Menu>
  );
}
