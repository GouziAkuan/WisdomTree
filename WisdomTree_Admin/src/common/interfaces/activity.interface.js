import { BaseUrl } from '../BaseUrl'
import { adminTokenStore } from '@/stores/token'

// 管理员发布活动
const publishActivityConfig = (data) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/activity/publish',
    method: 'post',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    data
  }
}

// 管理员获取活动列表（分页）
const getActivityAdminListConfig = (page, pagesize) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/activity/adminlist',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { page, pageSize: pagesize }
  }
}

// 管理员获取活动详情
const getActivityAdminDetailConfig = (activityId) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + `/activity/adminDetail/${activityId}`,
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

// 管理员编辑活动
const editActivityConfig = (activityId, data) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + `/activity/${activityId}`,
    method: 'put',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    data
  }
}

// 管理员删除活动
const deleteActivityConfig = (activityId) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + `/activity/${activityId}`,
    method: 'delete',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

export {
  publishActivityConfig,
  getActivityAdminListConfig,
  getActivityAdminDetailConfig,
  editActivityConfig,
  deleteActivityConfig
}
