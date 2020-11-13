import { request } from 'umi';
import urls from '@/utils/urls'
export async function userLogin(value:{username:string,password:string}) {
  const data={
    user_name:value.username,
    password:value.password
  }
  return request(urls.loginUrl,{method:'post',data});
}
