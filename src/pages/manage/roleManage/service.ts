import { request } from 'umi';
import urls from '@/utils/urls';

export async function getAllRoleList() {
  return request(urls.getAllRoleListUrl, { method: 'get' });
}

export async function getAllMenu() {
  return request(urls.getAllMenuUrl, { method: 'get' });
}
