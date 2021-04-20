import React from 'react';
import {
  ProjectOutlined,
  BlockOutlined,
  BookOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  CalculatorOutlined,
  EditOutlined,
} from '@ant-design/icons';

export default [
  {
    name: '概览',
    path: '/project/:id/overview',
    regExp: /^\/project\/\d+\/overview\/?$/,
    icon: <ProjectOutlined />,
  },
  {
    name: '测试用例',
    path: '/project/:id/case',
    regExp: /^\/project\/\d+\/case\/?/,
    icon: <CalculatorOutlined />,
  },
  {
    name: '接口用例',
    path: '/project/:id/apicase',
    regExp: /^\/project\/\d+\/apicase\/?$/,
    icon: <BlockOutlined />,
  },
  {
    name: '测试集',
    path: '/project/:id/testsuite',
    regExp: /^\/project\/\d+\/testsuite\/?$/,
    icon: <BookOutlined />,
  },
  {
    name: '测试报告',
    path: '/project/:id/testReport',
    regExp: /^\/project\/\d+\/testReport\/?/,
    icon: <EnvironmentOutlined />,
  },
  {
    name: '编辑器',
    path: '/project/:id/editor',
    regExp: /^\/project\/\d+\/editor\/?/,
    icon: <EditOutlined />,
  },
  {
    name: '项目设置',
    path: '/project/:id/projectSetting',
    regExp: /^\/project\/\d+\/projectSetting\/?$/,
    icon: <SettingOutlined />,
  },
];
