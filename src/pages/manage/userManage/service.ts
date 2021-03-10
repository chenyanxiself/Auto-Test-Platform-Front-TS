import { request } from 'umi';
import urls from '@/utils/urls';

export async function createUser(value: UserInfo) {
  const data = {
    user_name: value.name,
    password: value.password,
    user_cname: value.cname,
  };
  if (value.email) {
    data['email'] = value.email;
  }
  if (value.phone) {
    data['phone'] = value.phone;
  }
  if (value.roleList) {
    data['role_ids'] = value.roleList;
  } else {
    data['role_ids'] = [];
  }
  return request(urls.createUserUrl, { method: 'post', data });
}

export async function deleteUser(value: UserInfo) {
  const data = {
    user_id: value.id,
    // user_cname: value.cname,
    // email: value.email,
    // phone: value.phone,
    // role_ids: value.roleList ? value.roleList : [],
  };
  return request(urls.deleteUserUrl, { method: 'post', data });
}

export async function updateUser(value: UserInfo) {
  const data = {
    user_id: value.id,
    user_cname: value.cname,
    email: value.email,
    phone: value.phone,
    role_ids: value.roleList ? value.roleList : [],
  };
  return request(urls.updateUserInfoUrl, { method: 'post', data });
}

export async function getAllRoleList() {
  return request(urls.getAllRoleListUrl, { method: 'get' });
}

export async function getAllUserRole() {
  return request(urls.getAllUserRoleUrl, { method: 'get' });
}
