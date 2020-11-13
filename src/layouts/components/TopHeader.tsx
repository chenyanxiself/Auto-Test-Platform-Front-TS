import React from 'react';
import { Menu, Avatar, Popover, Button } from 'antd';
import styles from './topHeader.less';
import ProjectMenusList from './ProjectMenusList';
import { connect,withRouter } from 'umi';
import storeageUtil, { localStorageKey } from '@/utils/storageUtil';

const TopHeader = (props) => {
  let selectedItem = ProjectMenusList.find(item => (item.regExp.test(props.history.location.pathname)));
  let isShowMenu = !!selectedItem;
  let key = selectedItem ? [selectedItem.path] : [];
  let { cname } = props.global;
  const getProjectIdByPath = (path) => {
    const regExp = /^\/project\/(.+?)\/\w+/;
    if (regExp.test(path)) {
      return path.match(regExp)[1];
    } else {
      return null;
    }
  };
  const handleUserInfo = () => {
    if (props.history.location.pathname !== `/user/info`) {
      props.history.push(`/user/info`);
    }
  };
  const onMenuClick = (item) => {
    let { key } = item;
    const projectId = getProjectIdByPath(props.history.location.pathname);
    const url = key.replace(':id', projectId);
    if (url !== props.history.location.pathname) {
      props.history.push(url);
    }
  };
  const logout = () => {
    storeageUtil.remove(localStorageKey.TOKEN);
    props.history.push('/login/');
  };

  const content = (
    <>
      <div>
        <Button type="link" onClick={handleUserInfo}>个人信息</Button>
      </div>
      <div>
        <Button type="link" onClick={logout}>退出</Button>
      </div>
    </>
  );
  return (
    <div className={styles.main}>
      {isShowMenu ?
        <Menu
          className={styles.menus}
          theme="light"
          mode="horizontal"
          onClick={onMenuClick}
          selectedKeys={key}
        >
          {ProjectMenusList.map(item => {
            return (
              <Menu.Item key={item.path} icon={item.icon}>{item.name}</Menu.Item>
            );
          })}
        </Menu>
        : null}
      <div className={styles.user}>
        <Popover
          content={content}
          placement="bottom"
        >
          <Avatar className={styles.avatar} size='default'>
            {cname ? cname.substring(cname.length - 2, cname.length) : null}
          </Avatar>
        </Popover>
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
