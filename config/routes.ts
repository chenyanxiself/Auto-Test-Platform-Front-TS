export default [
  { path: '/login', component: '@/pages/login', exact: true },
  { path: '/404', component: '@/pages/error/404', exact: true },
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { path: '/', redirect: '/workspace', exact: true },
      { path: '/project', component: '@/pages/project', exact: true },
      { path: '/workspace', component: '@/pages/workspace', exact: true },
      {
        path: '/tool',
        component: '@/pages/tool',
        exact: true,
      },
      {
        path: '/manage/user',
        component: '@/pages/manage/userManage',
        exact: true,
      },
      {
        path: '/manage/role',
        component: '@/pages/manage/roleManage',
        exact: true,
      },
      { path: '/user/info', component: '@/pages/user', exact: true },
      {
        path: '/project/:id/overview',
        component: '@/pages/project/overview',
        exact: true,
      },
      {
        path: '/project/:id/apicase',
        component: '@/pages/project/apicase',
        exact: true,
      },
      {
        path: '/project/:id/case',
        component: '@/pages/project/case',
        exact: true,
      },
      {
        path: '/project/:id/case/:caseId/detail',
        component: '@/pages/project/case/detail',
        exact: true,
      },
      {
        path: '/project/:id/testsuite',
        component: '@/pages/project/testsuite',
        exact: true,
      },
      {
        path: '/project/:id/testReport',
        component: '@/pages/project/testReport',
        exact: true,
      },
      {
        path: '/project/:id/projectSetting',
        component: '@/pages/project/setting',
        exact: true,
      },
      {
        path: '/project/:id/testReport/:reportId/detail',
        component: '@/pages/project/testReport/detail',
        exact: true,
      },
      {
        path: '/project/:id/editor',
        component: '@/pages/project/editor',
        exact: true,
      },
      {
        path: '/project/:id/editor/:eid/detail',
        component: '@/pages/project/editor/detail',
        exact: true,
      },
      { path: '*', redirect: '/404', exact: true },
    ],
  },
];
