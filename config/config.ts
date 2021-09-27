import { defineConfig, history } from 'umi';
import routes from './routes';

export default defineConfig({
  define: {
    'process.env.REQUEST_HOST': 'http://localhost:8900',
    // 'process.env.REQUEST_HOST': 'http://10.212.38.121:8901',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  // history: { type: 'hash' },
  // publicPath: './',
  routes,
  // publicPath:'/public/',
  favicon: '/ic-logo.png',
  title: 'Event',
});
