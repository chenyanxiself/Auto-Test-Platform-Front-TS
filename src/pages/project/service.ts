import { request } from 'umi';
import urls from '@/utils/urls';

export async function getAllProject(type: number) {
  return request(urls.getAllProjectUrl, { method: 'get', params: { type } });
}

export const getAllUser = () => {
  return request(urls.getAllUserUrl, { method: 'post' });
};

export const createProject = (data) => {
  const postData = {
    project_name: data.projectName,
    project_desc: data.projectDesc,
    project_img: data.projectImg,
    project_member: data.projectMember,
  };
  return request(urls.createProjectUrl, { method: 'post', data: postData });
};

export const deleteProject = (id) => {
  return request(urls.deleteProjectUrl, { method: 'post', data: { id } });
};

export const uploadProjectImgApi = (data, projectId = null) => {
  let form = new FormData();
  form.append(data.filename, data.file);
  if (projectId) {
    form.append('project_id', projectId);
  }
  return request(urls.uploadProjectImgUrl, {
    method: 'post',
    data: form,
  });
};

export const delProjectImgApi = (fileId, taskId = null) => {
  const postData = {
    file_id: fileId,
  };
  if (taskId) {
    postData['task_id'] = taskId;
  }
  return request(urls.delProjectImgUrl, { method: 'post', data: postData });
};

export const getProjectById = (id) => {
  return request(urls.getProjectByIdUrl, { method: 'get', params: { id } });
};

export const updateProjectType = (id, projectType) => {
  return request(urls.updateProjectTypeUrl, { method: 'post', data: { id, project_type: projectType } });
};

export const updateProjectById = data => {
  const postData = {
    id: data.id,
    project_name: data.projectName,
    project_desc: data.projectDesc,
    project_img: data.projectImg,
    project_member: data.projectMember,
  };
  return request(urls.updateProjectByIdUrl, { method: 'post', data: postData });
};

export const getEnvByProjectId = (projectId) => {
  return request(urls.getEnvByProjectIdUrl, { method: 'get', params: { project_id: parseInt(projectId) } });
};

export const createProjectEnv = (projectId, envName, envHost) => {
  const postData = {
    project_id: projectId,
    env_host: envHost,
    env_name: envName,
  };
  return request(urls.createProjectEnvUrl, { method: 'post', data: postData });
};

export const updateProjectEnv = (projectId, envId, envName, envHost) => {
  const postData = {
    project_id: projectId,
    env_host: envHost,
    env_name: envName,
    id: envId,
  };
  return request(urls.updateProjectEnvUrl, { method: 'post', data: postData });
};

export const deleteProjectEnv = (projectId, envId) => {
  const postData = {
    project_id: projectId,
    id: envId,
  };
  return request(urls.deleteProjectEnvUrl, { method: 'post', data: postData });
};


