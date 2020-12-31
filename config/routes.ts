export default [
  { path: '/login', component: '@/pages/login', exact: true },
  { path: '/404', component: '@/pages/error/404', exact: true },
  {
    path: '/', component: '@/layouts/index', routes: [
      { path: '/', redirect: '/workspace', exact: true },
      { path: '/project', component: '@/pages/project', exact: true },
      { path: '/workspace', component: '@/pages/workspace', exact: true },
      { path: '/user/info', component: '@/pages/user', exact: true },
      { path: '/project/:id/overview', component: '@/pages/project/overview', exact: true },
      { path: '/project/:id/apicase', component: '@/pages/project/apicase', exact: true },
      { path: '/project/:id/case', component: '@/pages/project/case', exact: true },
      { path: '/project/:id/testsuite', component: '@/pages/project/testsuite', exact: true },
      { path: '/project/:id/testReport', component: '@/pages/project/testReport', exact: true },
      { path: '/project/:id/projectSetting', component: '@/pages/project/setting', exact: true },
      { path: '/project/:id/testReport/:reportId/detail', component: '@/pages/project/testReport/detail', exact: true },
      { path: '*', redirect: '/404', exact: true }
    ],
  },
];
