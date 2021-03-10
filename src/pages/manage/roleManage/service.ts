import { request } from 'umi';
import urls from '@/utils/urls';

export async function getAllRoleList() {
  return request(urls.getAllRoleListUrl, { method: 'get' });
}

export async function getAllMenu() {
  return request(urls.getAllMenuUrl, { method: 'get' });
}

export async function createRole(value: RoleInfo) {
  const data = {
    name: value.name,
    menu_list: value.menuList ? value.menuList : [],
  };
  return request(urls.createRoleUrl, { method: 'post', data });
}

export async function updateRole(value: RoleInfo) {
  const data = {
    id: value.id,
    name: value.name,
    menu_list: value.menuList ? value.menuList : [],
  };
  return request(urls.updateRoleUrl, { method: 'post', data });
}

export async function deleteRole(value: RoleInfo) {
  const data = {
    id: value.id,
  };
  return request(urls.deleteRoleUrl, { method: 'post', data });
}
