import React, { useEffect, useState } from 'react';
import { Menu, message } from 'antd';
import MenusList from './MenusList';
import { history } from 'umi';
import { getMenuAuth } from '@/layouts/service';

const { SubMenu } = Menu;
export default props => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [rootSubmenuKeys, setRootSubmenuKeyss] = useState([]);
  const [menusList, setMenuList] = useState([]);

  useEffect(() => {
    const getMenu = async () => {
      const res = await getMenuAuth();
      console.log(res);
      if (res.status == 1) {
        setMenuList(res.data);
      } else {
        message.warning(res.error);
      }
    };
    getMenu();
  }, []);

  useEffect(() => {
    const pathname = history.location.pathname;
    const data = MenusList.reduce(
      (pre, cur) => {
        if (cur.childMenu.length > 0) {
          pre.rootSubmenuKeys.push(cur.path);
          const isSelected = cur.childMenu.find(item =>
            item.regExp.test(pathname),
          );
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
      },
      {
        selectedKeys: [],
        openKeys: [],
        rootSubmenuKeys: [],
      },
    );
    setSelectedKeys(data.selectedKeys);
    setOpenKeys(data.openKeys);
    setRootSubmenuKeyss(data.rootSubmenuKeys);
  }, [history.location.pathname]);

  const onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onMenuClick = item => {
    let { key, keyPath } = item;
    if (key !== history.location.pathname) {
      setSelectedKeys(keyPath);
      history.push(key);
    }
  };

  const accessMenus = [1, 2, 3];
  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      theme="dark"
      onClick={onMenuClick}
      selectedKeys={selectedKeys}
    >
      {MenusList.map(item => {
        if (!accessMenus.includes(item.id)) {
          return null;
        }
        if (item.childMenu.length > 0) {
          return (
            <SubMenu key={item.path} icon={item.icon} title={item.name}>
              {item.childMenu.map(childItem => {
                if (!accessMenus.includes(childItem.id)) {
                  return null;
                }
                return (
                  <Menu.Item key={childItem.path}>{childItem.name}</Menu.Item>
                );
              })}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item key={item.path} icon={item.icon}>
              {item.name}
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );
};
