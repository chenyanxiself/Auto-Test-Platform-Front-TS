import { request } from 'umi';
import urls from '@/utils/urls';

export const getTaskByCondition = (
  projectId,
  keyword = null,
  relationType,
  filterType,
) => {
  let params = {
    project_id: projectId,
    relation_type: relationType,
    filter_type: filterType,
  };
  if (keyword) {
    params['keyword'] = keyword;
  }
  return request(urls.getTaskByConditionUrl, { method: 'get', params });
};

export const getProjectProgress = projectId => {
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

export const updateTask = (projectId, taskId, value, key) => {
  let data = { task_id: taskId, project_id: projectId, value, key };
  return request(urls.updateTaskUrl, { method: 'post', data });
};

export const updateListSort = (projectId, startIndex, endIndex) => {
  let data = {
    start_index: startIndex,
    end_index: endIndex,
    project_id: projectId,
  };
  return request(urls.updateListSortUrl, { method: 'post', data });
};

export const updateTaskSort = (
  projectId,
  startListId,
  endListId,
  id,
  beforeId,
  afterId,
) => {
  let data = {
    id,
    project_id: projectId,
    start_list_id: startListId,
    end_list_id: endListId,
  };
  if (afterId) {
    data['after_id'] = afterId;
  }
  if (beforeId) {
    data['before_id'] = beforeId;
  }
  return request(urls.updateTaskSortUrl, { method: 'post', data });
};

export const createList = (projectId, title) => {
  let data = {
    project_id: projectId,
    title,
  };
  return request(urls.createListUrl, { method: 'post', data });
};

export const createTask = (
  projectId,
  listId,
  title,
  priority,
  follower,
  description,
  attachment,
  relevanceCase,
) => {
  let data = {
    project_id: projectId,
    list_id: listId,
    title,
    priority,
    follower,
    description,
    attachment,
    relevance_case: relevanceCase,
  };
  return request(urls.createTaskUrl, { method: 'post', data });
};

export const uploadTaskImgApi = (data, projectId, taskId = null) => {
  let form = new FormData();
  form.append(data.filename, data.file);
  form.append('project_id', projectId);
  if (taskId) {
    form.append('task_id', taskId);
  }
  return request(urls.uploadTaskImgUrl, {
    method: 'post',
    data: form,
  });
};

export const getTaskDetail = (projectId, taskId) => {
  const params = {
    project_id: projectId,
    task_id: taskId,
  };
  return request(urls.getTaskDetailUrl, { method: 'get', params });
};
