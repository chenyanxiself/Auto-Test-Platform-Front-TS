import { RequestConfig, history } from 'umi';
import storeageUtil, { localStorageKey } from '@/utils/storageUtil';
import { message } from 'antd';

export const request: RequestConfig = {
  prefix: `http://localhost:8900/api/v1`,
  timeout: 15000,
  errorConfig: {},
  middlewares: [],
  errorHandler: (error) => {
    if (error.response){
      if (error.response.status === 401) {
        message.error('登陆失效');
        storeageUtil.remove(localStorageKey.TOKEN);
        history.push('/login');
      }
    }
     else {
      message.error(error.message);
    }
    throw error;
  },
  requestInterceptors: [(url, options) => {
    let token = storeageUtil.get(localStorageKey.TOKEN);
    if (token) {
      //将token放到请求头发送给服务器,将tokenkey放在请求头中
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    return {
      url,
      options,
    };
  }],
  responseInterceptors: [],
};
