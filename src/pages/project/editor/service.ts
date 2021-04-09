import { request } from 'umi';
import urls from '@/utils/urls';

export const getAllEditor = projectId => {
  return request(urls.getAllEditorUrl, {
    method: 'get',
    params: { project_id: projectId },
  });
};

export const getEditorById = id => {
  return request(urls.getEditorByIdUrl, { method: 'get', params: { id } });
};

export const updateEditor = (id, projectId, title, data, isDelete) => {
  let postData = {
    id: id,
    project_id: projectId,
  };
  if (title) {
    postData['title'] = title;
  }
  if (data) {
    postData['data'] = data;
  }
  if (isDelete) {
    postData['is_delete'] = isDelete;
  }
  return request(urls.updateEditorUrl, { method: 'post', data: postData });
};

export const createEditor = (projectId, title, type) => {
  let postData = {
    project_id: projectId,
    title,
    type,
  };
  return request(urls.createEditorUrl, { method: 'post', data: postData });
};
