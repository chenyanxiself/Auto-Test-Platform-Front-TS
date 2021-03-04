import { request } from 'umi';
import urls from '@/utils/urls';

export const getCurrentUser = () => {
  return request(urls.getCurrentUserUrl, {
    method: 'post',
  });
};

export const getMenuAuth = () => {
  return request(urls.getMenuAuthUrl, {
    method: 'get',
  });
};
