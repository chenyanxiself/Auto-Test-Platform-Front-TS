import { defineConfig,history  } from 'umi';
import routes from './routes'
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,

});
