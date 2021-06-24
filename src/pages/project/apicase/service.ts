import { request } from 'umi';
import urls from '@/utils/urls';

export const createProjectApiCase = data => {
  const postData = {
    name: data.caseName,
    suite_id: data.suiteId,
    request_url: data.requestUrl,
    request_host: {
      env_host: data.requestHost ? data.requestHost.envHost : null,
      is_user_env: data.requestHost ? data.requestHost.isUseEnv : false,
    },
    request_method: data.requestMehod,
    request_headers: data.requestHeaders,
    request_query: data.requestQuery,
    request_body: data.requestBody,
    project_id: data.projectId,
  };
  return request(urls.createProjectApiCaseUrl, {
    method: 'post',
    data: postData,
  });
};

export const updateProjectApiCase = data => {
  const postData = {
    id: data.id,
    name: data.caseName,
    suite_id: data.suiteId,
    request_url: data.requestUrl,
    request_host: {
      env_host: data.requestHost ? data.requestHost.envHost : null,
      is_user_env: data.requestHost ? data.requestHost.isUseEnv : false,
    },
    request_method: data.requestMehod,
    request_headers: data.requestHeaders,
    request_query: data.requestQuery,
    request_body: data.requestBody,
    project_id: data.projectId,
  };
  return request(urls.updateProjectApiCaseUrl, {
    method: 'post',
    data: postData,
  });
};

//根据条件筛选接口用例
export const getApiCaseByCondition = (
  projectId,
  suiteId,
  pageNum,
  pageSize,
  type,
  keyword,
) => {
  const getData = {
    project_id: projectId,
    suite_id: suiteId,
    page_num: pageNum,
    page_size: pageSize,
    type,
    keyword,
  };
  return request(urls.getApiCaseByConditionUrl, {
    method: 'get',
    params: getData,
  });
};

export const getApiCaseSuite = projectId => {
  const getData = {
    project_id: projectId,
  };
  return request(urls.getApiCaseSuiteUrl, { method: 'get', params: getData });
};

export const createApiCaseSuite = (projectId, name) => {
  return request(urls.createApiCaseSuiteUrl, {
    method: 'post',
    data: { project_id: projectId, suite_name: name },
  });
};

export const updateApiCaseSuite = (suiteId, projectId, suiteName, isDelete) => {
  const Data = {
    project_id: projectId,
    suite_id: suiteId,
  };
  if (suiteName) {
    Data['suite_name'] = suiteName;
  }
  if (isDelete) {
    Data['is_delete'] = isDelete;
  }
  return request(urls.updateApiCaseSuiteUrl, { method: 'post', data: Data });
};

export const deleteApiCaseById = (id, projectId) => {
  return request(urls.deleteApiCaseByIdUrl, {
    method: 'post',
    data: { id, project_id: projectId },
  });
};

export const singleCaseDebug = data => {
  const postData = {
    request_path: data.requestPath,
    request_host: {
      env_host: data.requestHost.envHost,
      is_user_env: data.requestHost.isUseEnv,
      request_host: data.requestHost.requestHost,
    },
    request_method: data.requestMehod,
    request_headers: data.requestHeaders,
    request_query: data.requestQuery,
    request_body: data.requestBody,
  };
  return request(urls.singleCaseDebugUrl, { method: 'post', data: postData });
};
