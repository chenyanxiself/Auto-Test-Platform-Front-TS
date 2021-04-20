import React from 'react';
import {
  AppstoreOutlined,
  BarsOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';

export const priorityEnum = {
  1: (
    <span>
      <ExclamationCircleOutlined style={{ marginRight: 10, color: 'green' }} />
      低
    </span>
  ),
  2: (
    <span>
      <ExclamationCircleOutlined
        style={{ marginRight: 10, color: '#FF9933' }}
      />
      中
    </span>
  ),
  3: (
    <span>
      <ExclamationCircleOutlined
        style={{ marginRight: 10, color: '#FF0000' }}
      />
      高
    </span>
  ),
  4: (
    <span>
      <ExclamationCircleOutlined
        style={{ marginRight: 10, color: '#CC0000' }}
      />
      最高
    </span>
  ),
};

export const bugPriorityEnum = {
  1: '最高',
  2: '较高',
  3: '普通',
  4: '较低',
  5: '最低',
};

export const bugPriorityBgColor = {
  1: 'rgb(232, 56, 79)',
  2: 'rgb(238, 195, 0)',
  3: 'rgb(98, 210, 111)',
  4: 'rgb(65, 134, 224)',
  5: 'rgb(221, 226, 228)',
};

export const navigationIcon = {
  workspace: <HomeOutlined />,
  project: <AppstoreOutlined />,
  manage: <BarsOutlined />,
  tool: <ToolOutlined />,
};

export const editorType = {
  1: <Tag color="blue">流程图</Tag>,
  2: <Tag color="#5BD8A6">思维导图</Tag>,
};
