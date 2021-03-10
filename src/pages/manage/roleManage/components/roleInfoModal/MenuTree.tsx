import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';

interface MenuTreeProps {
  [name: string]: any;
}

const MenuTree: React.FC<MenuTreeProps> = props => {
  const [expendKeys, setExpendKeys] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    let menuListCp: Partial<MenuInfo>[] = props.menuList.map(item => {
      return {
        ...item,
        key: item.id,
        title: item.name,
      };
    });
    let rootMenus = menuListCp.filter(item => item.parentId == null);
    const childMenus = menuListCp.filter(item => item.parentId != null);
    childMenus.forEach(citem => {
      let target_menu = rootMenus.find(item => item.id == citem.parentId);
      if (target_menu.children instanceof Array) {
        target_menu.children.push(citem);
      } else {
        target_menu.children = [citem];
      }
    });
    const epk = [];
    props.menuList.forEach(item => {
      if (item.parentId && epk.indexOf(item.parentId) == -1) {
        epk.push(item.parentId);
      }
    });
    setExpendKeys(epk);
    setTreeData(rootMenus);
  }, [props.menuList]);

  // useEffect(() => {
  //   const epk = [];
  //   props.treeData.forEach(item => {
  //     if (item.children && item.children.length > 0) {
  //       epk.push(item.key);
  //     }
  //   });
  //   setExpendKeys(epk);
  // }, [props.treeData]);

  const checkHandler = ({ checked }) => {
    let cks = [...checked];
    cks.forEach(item => {
      const target = props.menuList.find(x => x.id == item && x.parentId);
      if (target && cks.indexOf(target.parentId) == -1) {
        cks.push(target.parentId);
      }
    });
    props.onChange(cks);
  };

  return (
    <Tree
      checkable
      expandedKeys={expendKeys}
      checkedKeys={props.value}
      treeData={treeData}
      checkStrictly={true}
      // @ts-ignore
      onCheck={checkHandler}
    />
  );
};

export default MenuTree;
