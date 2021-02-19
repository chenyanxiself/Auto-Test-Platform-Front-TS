import React from 'react';
import { Button, Card, Form, Input, Modal, PageHeader } from 'antd';
import styles from '@/pages/user/index.less';

interface CaseDetailProps {
  [name: string]: any;
}

const CaseDetail: React.FC<CaseDetailProps> = props => {
  const projectId = props.match.params.id;
  const caseId = props.match.params.caseId;
  return (
    <div>
      <Card
        title={
          <PageHeader
            onBack={() => props.history.goBack()}
            title="个人信息"
            subTitle="修改个人信息"
          />
        }
        bordered={false}
      >
        <div>123</div>
      </Card>
    </div>
  );
};

export default CaseDetail;
