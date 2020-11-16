import {request} from 'umi'
import urls from '@/utils/urls'

export const getWorkstationProjects=()=>{
  return request(urls.getWorkstationProjectsUrl,{method:'get'})
}
