import {request} from 'umi'
import urls from '@/utils/urls'

export const getCurrentUser = () => {
  return request(urls.getCurrentUserUrl,{
    method:'post'
  })
}
