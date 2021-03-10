import React, { useEffect, useState } from 'react';
import { Menu, message } from 'antd';
import { history } from 'umi';
import { getMenuAuth } from '@/layouts/service';
import { navigationIcon } from '@/utils/enums';

const { SubMenu } = Menu;
export default props => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [rootSubmenuKeys, setRootSubmenuKeyss] = useState([]);
  const [menusList, setMenuList] = useState([]);

  useEffect(() => {
    const getMenu = async () => {
      const res = await getMenuAuth();
      if (res.status == 1) {
        const formatRegData = res.data.map(item => {
          item.regExp = new RegExp(item.regExp);
          item.icon = navigationIcon[item.icon];
          return item;
        });
        let rootMenus = formatRegData.filter(item => item.parentId == null);
        const childMenus = formatRegData.filter(item => item.parentId != null);
        childMenus.forEach(citem => {
          let target_menu = rootMenus.find(item => item.id == citem.parentId);
          if (target_menu.childMenu instanceof Array) {
            target_menu.childMenu.push(citem);
          } else {
            target_menu.childMenu = [citem];
          }
        });
        setMenuList(rootMenus);
      } else {
        message.warning(res.error);
      }
    };
    getMenu();
  }, []);

  useEffect(() => {
    const pathname = history.location.pathname;
    const data = menusList.reduce(
      (pre, cur) => {
        if (cur.childMenu != undefined && cur.childMenu.length > 0) {
          pre.rootSubmenuKeys.push(cur.path);
          const isSelected = cur.childMenu.find(item => {
            return item.regExp.test(pathname);
          });
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
  }, [history.location.pathname, menusList]);

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

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      theme="dark"
      onClick={onMenuClick}
      selectedKeys={selectedKeys}
    >
      {menusList.map(item => {
        if (item.childMenu != undefined && item.childMenu.length > 0) {
          return (
            <SubMenu key={item.path} icon={item.icon} title={item.name}>
              {item.childMenu.map(childItem => {
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
