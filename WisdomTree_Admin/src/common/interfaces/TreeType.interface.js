import { adminTokenStore } from '@/stores/token'
import { BaseUrl } from '../BaseUrl'
// 树类接口

// 获取树类列表
const getTreeTypetConfig = (page, pagesize) => {
  const token = adminTokenStore()
  return {
    method: 'get',
    url: `${BaseUrl}/admin/getTreeTypeList`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { page, pagesize }
  }
}

// 添加新的树类
const addTreeTypeConfig = (data) => {
  const token = adminTokenStore()
  return {
    method: 'post',
    url: `${BaseUrl}/admin/addTreeType`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    data
  }
}

// 删除树类
const deleteTreeTypeConfig = (treeTypeID) => {
  const token = adminTokenStore()
  return {
    method: 'delete',
    url: `${BaseUrl}/admin/deleteTreeType`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { treeTypeID }
  }
}

// 获取某树种详情
const getTreeTypeDeailConfig = (treeTypeID) => {
  const token = adminTokenStore()
  return {
    method: 'get',
    url: `${BaseUrl}/admin/getTreeTypeInfo`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { treeTypeID }
  }
}

// 修改树种信息
const updateTreeTypeConfig = (data) => {
  const token = adminTokenStore()
  return {
    method: 'put',
    url: `${BaseUrl}/admin/updateTreeType`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    data
  }
}

export {
  BaseUrl,
  getTreeTypetConfig,
  addTreeTypeConfig,
  deleteTreeTypeConfig,
  getTreeTypeDeailConfig,
  updateTreeTypeConfig
}
