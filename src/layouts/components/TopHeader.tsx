import React from 'react';
import { Menu, Avatar, Popover, Button, Dropdown } from 'antd';
import styles from './topHeader.less';
import ProjectMenusList from './ProjectMenusList';
import { connect, withRouter } from 'umi';
import storeageUtil, { localStorageKey } from '@/utils/storageUtil';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const TopHeader = props => {
  let selectedItem = ProjectMenusList.find(item =>
    item.regExp.test(props.history.location.pathname),
  );
  let isShowMenu = !!selectedItem;
  let key = selectedItem ? [selectedItem.path] : [];
  let { cname } = props.global;
  const getProjectIdByPath = path => {
    const regExp = /^\/project\/(.+?)\/\w+/;
    if (regExp.test(path)) {
      return path.match(regExp)[1];
    } else {
      return null;
    }
  };

  const onMenuClick = item => {
    let { key } = item;
    const projectId = getProjectIdByPath(props.history.location.pathname);
    const url = key.replace(':id', projectId);
    if (url !== props.history.location.pathname) {
      props.history.push(url);
    }
  };

  const userMenuClickHandler = ({ key }) => {
    if (key == 'center') {
      props.history.push(`/user/info`);
    } else if (key == 'logout') {
      storeageUtil.remove(localStorageKey.TOKEN);
      props.history.push('/login/');
    }
  };

  const content = (
    <Menu
      className={styles.menu}
      selectedKeys={[]}
      onClick={userMenuClickHandler}
    >
      <Menu.Item key="center">
        <UserOutlined />
        个人中心
      </Menu.Item>
      <Menu.Divider />

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.main}>
      {isShowMenu ? (
        <Menu
          className={styles.menus}
          theme="light"
          mode="horizontal"
          onClick={onMenuClick}
          selectedKeys={key}
        >
          {ProjectMenusList.map(item => {
            return (
              <Menu.Item key={item.path} icon={item.icon}>
                {item.name}
              </Menu.Item>
            );
          })}
        </Menu>
      ) : null}
      <div className={styles.user}>
        <Dropdown overlay={content} placement={'bottomCenter'}>
          <span className={styles.account}>
            <Avatar className={styles.avatar} size="default">
              {cname ? cname.substring(cname.length - 2, cname.length) : null}
            </Avatar>
            <span className={styles.name}>{cname}</span>
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

const mapStateToProps = ({ global }) => {
  return {
    global,
  };
};

export default connect(mapStateToProps)(withRouter(TopHeader));
