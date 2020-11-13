import { request } from 'umi';
import urls from '@/utils/urls';

export const getSuiteByProjectId = (projectId) => {
  return request(urls.getSuiteByProjectIdUrl, {method:'get',params: {project_id: projectId}})
}


export const getSuiteInfoById = (id, projectId) => {
  return request(urls.getSuiteInfoByIdUrl, {method:'get',params: {id, project_id: projectId}})
}

export const createSuite = (projectId, suiteName) => {
  return request(urls.createSuiteUrl, {method:'post',data:{project_id: projectId, suite_name: suiteName}})
}

export const deleteSuite = (suiteId,projectId) => {
  return request(urls.deleteSuiteUrl,{method:'post',data: {suite_id: suiteId,project_id:projectId}})
}

export const updateSuiteCaseRelation = (suiteId, projectId, caseIdList) => {
  const postData = {
    suite_id: suiteId,
    project_id: projectId,
    case_id_list: caseIdList
  }
  return request(urls.updateSuiteCaseRelationUrl, {method:'post',data:postData})
}

export const updateSuiteCaseSort = (projectId, suiteId, beforeId, afterId,type) => {
  const postData = {
    project_id: projectId,
    suite_id: suiteId,
    before_id: beforeId,
    after_id: afterId,
    type
  }
  return request(urls.updateSuiteCaseSortUrl, {method:'post',data:postData})
}

export const executeSuite = (projectId, suiteId, value) => {
  const postData = {
    project_id: projectId,
    suite_id: suiteId,
    is_use_env: value.globalHost.isUseEnv,
    request_host: value.globalHost.requestHost,
    env_host: value.globalHost.envHost,
    is_save_cookie: value.isSaveCookie,
    global_headers: value.globalHeaders
  }
  return request(urls.executeSuiteUrl, {method:'post',data:postData})
}