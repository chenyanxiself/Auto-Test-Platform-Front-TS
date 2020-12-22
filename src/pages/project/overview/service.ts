import { request } from 'umi';
import urls from '@/utils/urls';

export const getTaskByCondition = (projectId, keyword = null, relationType, filterType) => {
  let params = { project_id: projectId, relation_type: relationType, filter_type: filterType };
  if (keyword) {
    params['keyword'] = keyword;
  }
  return request(urls.getTaskByConditionUrl, { method: 'get', params });
};

export const getProjectProgress = (projectId) => {
  let params = { project_id: projectId };
  return request(urls.getProjectProgressUrl, { method: 'get', params });
};


export const deleteTaskList = (id, projectId) => {
  let data = { id: id, project_id: projectId };
  return request(urls.deleteTaskListUrl, { method: 'post', data });
};

export const deleteTask = (id, projectId) => {
  let data = { id: id, project_id: projectId };
  return request(urls.deleteTaskUrl, { method: 'post', data });
};

export const updateList = (projectId, listId, title) => {
  let data = { list_id: listId, project_id: projectId, title };
  return request(urls.updateListUrl, { method: 'post', data });
};

export const updateTask = (projectId, taskId, status, priority, follower, description) => {
  let data = { task_id: taskId, project_id: projectId, status, priority, follower, description };
  return request(urls.updateTaskUrl, { method: 'post', data });
};

export const updateListSort = (projectId, startIndex, endIndex) => {
  let data = { start_index: startIndex, end_index: endIndex, project_id: projectId };
  return request(urls.updateListSortUrl, { method: 'post', data });
};

export const updateTaskSort = (projectId, startListId, endListId, startIndex, endIndex) => {
  let data = {
    start_index: startIndex,
    end_index: endIndex,
    project_id: projectId,
    start_list_id: startListId,
    end_list_id: endListId,
  };
  return request(urls.updateTaskSortUrl, { method: 'post', data });
};

export const createList = (projectId, title) => {
  let data = {
    project_id: projectId,
    title,
  };
  return request(urls.createListUrl, { method: 'post', data });
};

export const createTask = (projectId, listId, title, description) => {
  let data = {
    project_id: projectId,
    list_id: listId,
    title,
    description,
  };
  return request(urls.createTaskUrl, { method: 'post', data });
};

