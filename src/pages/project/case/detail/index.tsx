import React, { useEffect, useState } from 'react';
import {
  Divider,
  Row,
  Col,
  Card,
  Breadcrumb,
  message,
  Descriptions,
  PageHeader,
  Table,
  Empty,
} from 'antd';
import { CaseDetailInfo } from '@/pages/project/case/data';
import { getCaseById } from '@/pages/project/case/service';
import { priorityEnum } from '@/utils/enums';

interface CaseDetailProps {
  [name: string]: any;
}

const CaseDetail: React.FC<CaseDetailProps> = props => {
  const projectId = props.match.params.id;
  const caseId = props.match.params.caseId;
  const [caseInfo, setCaseInfo] = useState<Partial<CaseDetailInfo>>({});

  useEffect(() => {
    const getData = async () => {
      const res = await getCaseById(caseId, projectId);
      if (res.status == 1) {
        setCaseInfo(res.data);
      } else {
        message.warning(res.error);
      }
    };
    getData();
  }, []);

  const columns = [
    {
      dataIndex: 'id',
      width: '2%',
      render: () => {
        return (
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: '#1890ff',
              borderRadius: '50%',
            }}
          />
        );
      },
    },
    {
      title: <span style={{ fontSize: 16, fontWeight: 800 }}>步骤描述</span>,
      dataIndex: 'step',
      width: '38%',
    },
    {
      title: <span style={{ fontSize: 16, fontWeight: 800 }}>预期结果</span>,
      dataIndex: 'exception',
      width: '60%',
    },
  ];

  const renderModules = () => {
    if (caseInfo.modules) {
      const res = [];
      for (var i = caseInfo.modules.length - 1; i >= 0; i--) {
        res.push(
          <Breadcrumb.Item key={i}>{caseInfo.modules[i]}</Breadcrumb.Item>,
        );
      }
      return <Breadcrumb>{res}</Breadcrumb>;
    } else {
      return <span />;
    }
  };

  return (
    <div>
      <Card
        headStyle={{ padding: 0 }}
        title={
          <PageHeader
            onBack={() => props.history.goBack()}
            title={caseInfo.name}
            subTitle={caseInfo.remark}
          >
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="优先级">
                {priorityEnum[caseInfo.priority]}
              </Descriptions.Item>
              <Descriptions.Item label="所属模块">
                {renderModules()}
              </Descriptions.Item>
              <Descriptions.Item label="创建人">
                {caseInfo.creator}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
        }
        bordered={false}
      >
        <Row>
          <Col span={24} style={{ minHeight: 100 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                paddingLeft: 20,
                marginBottom: 20,
              }}
            >
              前置步骤:
            </div>
            {caseInfo.precondition ? (
              <span style={{ paddingLeft: 20, paddingRight: 20 }}>
                {caseInfo.precondition}
              </span>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Table
              dataSource={caseInfo.steps}
              columns={columns}
              pagination={false}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CaseDetail;
