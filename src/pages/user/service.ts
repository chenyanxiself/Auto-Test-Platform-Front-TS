import {request} from 'umi'
import urls from '@/utils/urls'


export const updateUserInfo = (data) => {
  const postData = {
    user_cname: data.cname,
    email: data.email,
    phone: data.phone
  }
  return request(urls.updateUserInfoUrl, {method:'post',data:postData})
}

//修改密码
export const updatePassword = (oldPwd, newPwd) => {
  const postData = {
    old_password: oldPwd,
    new_password: newPwd
  }
  return request(urls.updatePasswordUrl, {method:'post',data:postData})
}
