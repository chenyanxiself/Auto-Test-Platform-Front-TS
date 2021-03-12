import React, { useEffect, useState } from 'react';
import { Menu, message } from 'antd';
import { history } from 'umi';
import { getMenuAuth } from '@/layouts/service';
import { navigationIcon } from '@/utils/enums';

const { SubMenu } = Menu;
export default props => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [menusList, setMenuList] = useState([]);
  const [menusData, setMenuData] = useState([]);

  useEffect(() => {
    const getMenu = async () => {
      const res = await getMenuAuth();
      if (res.status == 1) {
        const formatRegData = res.data.map(item => {
          item.regExp = new RegExp(item.regExp);
          item.icon = navigationIcon[item.icon];
          return item;
        });
        let newRegData = [...formatRegData];
        let rootMenus = newRegData.filter(item => item.parentId == null);
        const childMenus = newRegData.filter(item => item.parentId != null);
        let opks = [];
        childMenus.forEach(citem => {
          let target_menu = rootMenus.find(item => item.id == citem.parentId);
          if (target_menu.childMenu instanceof Array) {
            target_menu.childMenu.push(citem);
          } else {
            target_menu.childMenu = [citem];
          }
          if (opks.indexOf(target_menu.id) == -1) {
            opks.push(target_menu.id.toString());
          }
        });
        setMenuData(formatRegData);
        setMenuList(rootMenus);
        setOpenKeys(opks);
      } else {
        message.warning(res.error);
      }
    };
    getMenu();
  }, []);

  useEffect(() => {
    const pathname = history.location.pathname;
    const target = menusData.find(item => {
      return item.regExp.test(pathname);
    });
    if (target) {
      setSelectedKeys([target.id.toString()]);
    }
  }, [history.location.pathname, menusData]);

  const onMenuClick = record => {
    const { key } = record;
    const target = menusData.find(item => item.id == parseInt(key));
    if (target.path !== history.location.pathname) {
      setSelectedKeys(key.toString());
      history.push(target.path);
    }
  };

  return (
    <Menu
      mode="inline"
      theme="dark"
      onClick={onMenuClick}
      selectedKeys={selectedKeys}
      triggerSubMenuAction={'click'}
    >
      {menusList.map(item => {
        if (item.childMenu != undefined && item.childMenu.length > 0) {
          return (
            <SubMenu key={item.id} icon={item.icon} title={item.name}>
              {item.childMenu.map(childItem => {
                return (
                  <Menu.Item key={childItem.id}>{childItem.name}</Menu.Item>
                );
              })}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item key={item.id} icon={item.icon}>
              {item.name}
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );
};
