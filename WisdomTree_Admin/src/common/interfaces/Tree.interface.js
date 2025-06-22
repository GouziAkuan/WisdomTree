import { adminTokenStore } from '@/stores/token'
import { BaseUrl } from '../BaseUrl'

// 树木接口

// 获取树木列表
const getTreeListConfig = (page, pagesize) => {
  const token = adminTokenStore()
  return {
    method: 'get',
    url: `${BaseUrl}/admin/getTreeList`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { page, pagesize }
  }
}

// 获取树木筛选值
const getTreeFilterConfig = () => {
  const token = adminTokenStore()
  return {
    method: 'get',
    url: `${BaseUrl}/admin/getTreeFilter`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

// 删除树木
const deleteTreeConfig = (treeID) => {
  const token = adminTokenStore()
  return {
    method: 'delete',
    url: `${BaseUrl}/admin/deleteTree`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { treeID }
  }
}

// 新建树木
const addTreesConfig = (data) => {
  const token = adminTokenStore()
  return {
    method: 'post',
    url: `${BaseUrl}/admin/addTrees`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    data: data
  }
}

// 搜索获取匹配树种值
const searchTreeTypeConfig = (treeTypeInput) => {
  const token = adminTokenStore()
  return {
    method: 'get',
    url: `${BaseUrl}/admin/searchTreeType`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { treeTypeInput }
  }
}

// 获取树木详情信息
const getTreeDetailConfig = (treeID) => {
  const token = adminTokenStore()
  return {
    method: 'get',
    url: `${BaseUrl}/admin/getTreeDetail`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { treeID }
  }
}

// 修改树木详情
const updateTreeConfig = (treeID, treeInfo) => {
  const token = adminTokenStore()
  return {
    method: 'put',
    url: `${BaseUrl}/admin/updateTree`,
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    data: { treeID, treeType: treeInfo.treeType, detailImage: treeInfo.detailImage }
  }
}

export {
  getTreeListConfig,
  getTreeFilterConfig,
  deleteTreeConfig,
  addTreesConfig,
  searchTreeTypeConfig,
  getTreeDetailConfig,
  updateTreeConfig
}
