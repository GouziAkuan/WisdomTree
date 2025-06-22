import { BaseUrl } from '../BaseUrl'
import { adminTokenStore } from '@/stores/token'

// 获取领养列表
const getAdoptListConfig = (page, pagesize) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/admin/getAdoptList',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { page, pagesize }
  }
}

// 删除领养列表
const deleteAdoptConfig = (AdoptID) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/admin/deleteAdopt',
    method: 'delete',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { AdoptID }
  }
}

// 获取领养表详情
const getAdoptDetailConfig = (AdoptID) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/admin/getAdoptDetail',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { AdoptID }
  }
}

// 修改领养信息
const updateAdoptConfig = (data) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/admin/updateAdopt',
    method: 'put',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    data
  }
}

export { getAdoptListConfig, deleteAdoptConfig, getAdoptDetailConfig, updateAdoptConfig }
