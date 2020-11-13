import { request } from 'umi';
import urls from '@/utils/urls';

export const getCaseByModuleId=(projectId,moduleId,keyword)=>{
  let postData={
    project_id:projectId,
    module_id:moduleId,
    keyword
  }
  return request(urls.getCaseByModuleIdUrl, {method:'post',data:postData})
}

export const createProjectCase=(data)=>{
  return request(urls.createProjectCaseUrl, {method:'post',data})
}

export const updateProjectCase=(data)=>{
  return request(urls.updateProjectCaseUrl, {method:'post',data})
}

export const deleteProjectCase=(ids,projectId)=>{
  const postData={
    case_id_list:ids,
    project_id:projectId
  }
  return request(urls.deleteProjectCaseUrl,{method:'post',data:postData})
}

export const createModule = (name,parentId,projectId)=>{
  const postData={
    name,
    parent_id:parentId,
    project_id:projectId
  }
  return request(urls.createModuleUrl, {method:'post',data:postData})
}

export const updateModule = (name,id,projectId,parentId)=>{
  const postData={
    name,
    id:id,
    project_id:projectId,
    parent_id:parentId
  }
  return request(urls.updateModuleUrl, {method:'post',data:postData})
}

export const getAllModule = (projectId)=>{
  return request(urls.getAllModuleUrl, {method:'get',params:{project_id:projectId}})
}

export const deleteModule = (idList,projectId)=>{
  const postData={
    id_list:idList,
    project_id:projectId,
  }
  return request(urls.deleteModuleUrl, {method:'post',data:postData})
}