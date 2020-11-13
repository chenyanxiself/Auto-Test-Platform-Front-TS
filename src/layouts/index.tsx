import React, { useEffect } from 'react';
import { Layout,message } from 'antd';
import LeftNavigation from '@/layouts/components/LeftNavigation';
import {connect} from 'umi'
import { getCurrentUser } from '@/layouts/service';
import TopHeader from '@/layouts/components/TopHeader';
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider} from 'antd'

const { Sider, Content, Header } = Layout;
const Index= (props) => {

  const getData = async ()=>{
    const res =await getCurrentUser()
    if (res.status===1){
      props.dispatch({type:'global/setCurrentUser',payload:res.data})
    }else {
      message.warn(res.error)
    }
  }

  useEffect(()=>{
    getData()
  },[])

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ height: '100%' }}>
        <Sider>
          <LeftNavigation />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: 'white' }}>
            <TopHeader />
          </Header>
          <Content style={{
            margin: '20px',
            backgroundColor: '#fff',
            padding: '10px 10px',
            overflowY: 'scroll',
          }}>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default connect()(Index);
