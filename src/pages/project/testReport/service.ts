import { request } from 'umi';
import urls from '@/utils/urls';

export const getReportByCondition = (projectId) => {
  return request(urls.getReportByConditionUrl, {method:'get',params: {project_id: projectId}})
}

export const deleteReportById = (id,projectId) => {
  return request(urls.deleteReportByIdUrl, {method:'post',data:{id,project_id:projectId}})
}

export const getReportDetail = (id,projectId) => {
  return request(urls.getReportDetailUrl, {
    method:'get',
    params: {
      report_id: id,
      project_id:projectId
    }
  })
}
