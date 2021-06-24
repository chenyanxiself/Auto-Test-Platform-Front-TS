import React, { useEffect, useState } from 'react';
import { RequestHost } from '@/pages/project/apicase/data';
import { Input, Select, Switch, message, Space } from 'antd';

const { Option } = Select;

interface HostProps {
  value: RequestHost;
  onChange: (value: Partial<RequestHost>) => void;
  envSections: any[];
}

const Host: React.FC<Partial<HostProps>> = ({
  value = { isUseEnv: false },
  onChange,
  envSections,
}) => {
  const triggerChange = changedValue => {
    if (onChange) {
      onChange({
        ...value,
        ...changedValue,
      });
    }
  };

  const renderBody = () => {
    if (value.isUseEnv) {
      const envkey = envSections.find(item => item.id == value.envHost);
      return (
        <Space>
          <Select
            value={value.envHost}
            style={{
              width: 150,
            }}
            onChange={value => {
              triggerChange({ envHost: value });
            }}
            placeholder="请选择环境"
          >
            {envSections.map(item => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
          <div style={{ marginLeft: 5, color: 'grey' }}>
            {envkey ? envkey.host : null}
          </div>
        </Space>
      );
    } else {
      return null;
    }
  };

  return (
    <span>
      <Switch
        onChange={value => {
          triggerChange({ isUseEnv: value });
        }}
        checked={!!value.isUseEnv}
        checkedChildren="环境"
        unCheckedChildren="环境"
        style={{ marginRight: 5 }}
      />
      {renderBody()}
    </span>
  );
};

export default Host;
