import {
  BarsOutlined,
  AppstoreOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import React from 'react';

export default [
  {
    id: 1,
    name: '我的工作台',
    path: '/workspace',
    regExp: /^\/workspace\/?$/,
    icon: <HomeOutlined />,
    childMenu: [],
  },
  {
    id: 2,
    name: '项目',
    path: '/project',
    regExp: /^\/project\/?/,
    icon: <AppstoreOutlined />,
    childMenu: [],
  },
  {
    id: 3,
    name: '管理',
    path: '/manage',
    regExp: /^\/manage\/?&/,
    icon: <BarsOutlined />,
    childMenu: [
      {
        id: 4,
        name: '用户管理',
        path: '/manage/user',
        regExp: /^\/manage\/user\/?&/,
      },
      //     {
      //         name:'角色管理',
      //         path:'/manage/role',
      //         regExp:/^\/manage\/role\/?&/,
      //     }
    ],
  },
];
