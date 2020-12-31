import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, message, Row, Statistic, Table } from 'antd';
import styles from './index.less';
import { connect,Link } from 'umi';
import { getWorkstationProjects } from './service';

interface viewProps {
  underwayProjects: any[],
  partedProjects: any[],
  myReports: any[],
  totalProjectsNum: number,
  totalUnderwayProjectsNum: number
}

const Workspace = (props) => {
  const [view, setView] = useState<viewProps>({
    underwayProjects: [],
    partedProjects: [],
    myReports: [],
    totalProjectsNum: 0,
    totalUnderwayProjectsNum: 0,
  });

  const { cname, email } = props.global;

  useEffect(() => {
    getData();
  }, []);

  const reportColumns = [
    {
      title: '报告名',
      dataIndex: 'report_name',
      width: '70%',
    },
    {
      title: '操作',
      render: (item) => {
        return <Link to={`/project/${item.project_id}/testReport/${item.id}/detail`}>查看</Link>;
      },
    },
  ];

  const getData = async () => {
    const res = await getWorkstationProjects();
    if (res.status === 1) {
      setView({
        underwayProjects: res.data.underway_projects,
        partedProjects: res.data.parted_projects,
        myReports: res.data.my_reports,
        totalProjectsNum: res.data.total_projects_num,
        totalUnderwayProjectsNum: res.data.total_underway_projects_num,
      });
    } else {
      message.warning(res.error);
    }
  };

  const headerContent = (
    <div className={styles.headerMain}>
      <div className={styles.headerAvatar}>
        <Avatar size={"large"}>
          <div className={styles.headerAvatarText}>
            {cname ? cname.substring(cname.length - 2, cname.length) : null}
          </div>
        </Avatar>
      </div>
      <div className={styles.headerContent}>
        <div className={styles.headerTitle}>
          你好，
          {cname}
          ，祝你开心每一天！
        </div>
        <div>
          {email}
        </div>
      </div>
    </div>
  )

  const extra = (
    <div className={styles.extra}>
      <div className={styles.extraItem}>
        <Statistic
          title={'项目总数'}
          value={view.totalUnderwayProjectsNum}
          suffix={`/ ${view.totalProjectsNum}`}
        />
      </div>
    </div>
  )

  return (
    <div className={styles.main}>
      <Card
        title={headerContent}
        extra={extra}
        bordered={false}
        bodyStyle={{
          backgroundColor:'#f0f2f5',
          paddingLeft: 0,
          paddingRight: 0,
          width:'100%'
        }}
      >
        <Row>
          <Col xl={15} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{marginBottom: 24}}
              title={'我参与的项目'}
              bordered={false}
              extra={<Link to={'/project'}>全部项目</Link>}
              bodyStyle={{padding: 0}}
            >
              {view.partedProjects.map(item=>{
                return (
                  <Card.Grid
                    key={item.id}
                    className={styles.grid}
                    // @ts-ignore
                    onClick={()=>props.history.push(`/project/${item.id}/overview`)}
                  >
                    <Card.Meta
                      title={item.name}
                      description={<div className={styles.remark}>{item.remark}</div>}
                      avatar={<Avatar src={item.img.url}/>}
                    />
                  </Card.Grid>
                )
              })}
            </Card>
            <Card
              style={{marginBottom: 24}}
              title={'进行中的项目'}
              bordered={false}
              extra={<Link to={'/project'}>全部项目</Link>}
              bodyStyle={{padding: 0}}
            >
              {view.underwayProjects.map(item=>{
                return (
                  <Card.Grid
                    key={item.id}
                    className={styles.grid}
                    // @ts-ignore
                    onClick={()=>props.history.push(`/project/${item.id}/overview`)}
                  >
                    <Card.Meta
                      title={item.name}
                      description={<div className={styles.remark}>{item.remark}</div>}
                      avatar={<Avatar src={item.img.url}/>}
                    />
                  </Card.Grid>
                )
              })}
            </Card>
          </Col>
          <Col xl={1} lg={0} md={0} sm={0} xs={0}/>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{marginBottom: 24}}
              title={'我的测试报告'}
              bordered={false}
            >
              <Table
                columns={reportColumns}
                showHeader={false}
                dataSource={view.myReports}
                rowKey={'id'}
                pagination={false}
                size={'small'}
              />
            </Card>
          </Col>

        </Row>
      </Card>
    </div>
  );
};

const mapStateToProps = ({ global }) => {
  return {
    global,
  };
};

export default connect(mapStateToProps)(Workspace);

