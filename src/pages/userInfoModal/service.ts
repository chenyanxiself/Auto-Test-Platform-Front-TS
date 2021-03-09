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
  }
  return request(urls.createUserUrl, { method: 'post', data });
}

export async function updateUser(value: UserInfo) {
  const data = {
    user_name: value.name,
    password: value.password,
    user_cname: value.cname,
    email: value.email,
    phone: value.phone,
    role_ids: value.roleList,
  };
  return request(urls.createUserUrl, { method: 'post', data });
}
