import { request } from 'umi';
import urls from '@/utils/urls';

export const getTaskByCondition = (projectId, keyword = null, type = null) => {
  let params = { project_id: projectId };
  if (keyword) {
    params['keyword'] = keyword;
  }
  if (type) {
    params[type] = type;
  }
  return request(urls.getTaskByConditionUrl, { method: 'get', params });
};

export const deleteTaskList = (id, projectId) => {
  let data = { id: id, project_id: projectId };
  return request(urls.deleteTaskListUrl, { method: 'post', data });
};

export const deleteTask = (id, projectId) => {
  let data = { id: id, project_id: projectId };
  return request(urls.deleteTaskUrl, { method: 'post', data });
};

export const updateListSort = (projectId, startId, endId) => {
  let data = { start_id: startId, end_id: endId, project_id: projectId };
  return request(urls.updateListSortUrl, { method: 'post', data });
};
