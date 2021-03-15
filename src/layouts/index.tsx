import React, { useEffect, useRef, useState } from 'react';
import { Layout, message } from 'antd';
import { connect } from 'umi';
import { getCurrentUser } from '@/layouts/service';
import TopHeader from '@/layouts/components/TopHeader';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import styles from './index.less';
import logo from '@/assert/logo.png';
import Menus from '@/layouts/components/Menus';
import { useHover, useDebounceFn } from '@umijs/hooks';

const { Sider, Content, Header } = Layout;
const Index = props => {
  const [expand, setExpand] = useState(false);
  const { run } = useDebounceFn(() => {
    setExpand(true);
  }, 380);

  const getData = async () => {
    const res = await getCurrentUser();
    if (res.status === 1) {
      props.dispatch({ type: 'global/setCurrentUser', payload: res.data });
    } else {
      message.warn(res.error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [_, hoverRef] = useHover<HTMLDivElement>({
    onEnter: () => {
      run();
    },
    onLeave: () => {
      setExpand(false);
    },
  });

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ height: '100%' }}>
        <Sider collapsed={!expand}>
          <div className={styles.leftNav} ref={hoverRef}>
            <header className={styles.leftNavHeader}>
              <img src={logo} alt="logo" />
              {expand ? <h1>Event</h1> : null}
            </header>
            <Menus />
          </div>
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: 'white' }}>
            <TopHeader />
          </Header>
          <Content
            style={{
              margin: '20px',
              backgroundColor: '#fff',
              padding: '10px 10px',
              overflowY: 'auto',
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default connect()(Index);
