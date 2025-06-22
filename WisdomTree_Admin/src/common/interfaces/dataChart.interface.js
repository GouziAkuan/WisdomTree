import { BaseUrl } from '../BaseUrl'
import { adminTokenStore } from '@/stores/token'

// 总数统计
const getTotalStatisticsConfig = () => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/datachart/admin/total',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

// 区域分布数据
const getAreaDistributionConfig = () => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/datachart/admin/area-distribution',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

// 近7天领养趋势
const getAdoptionTrendConfig = () => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/datachart/admin/adoption-trend',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

// 树种领养排行
const getTreeTypeAdoptionsConfig = () => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/datachart/admin/tree-type-adoptions',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

// 树种分布
const getTreeTypeDistributionConfig = () => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/datachart/admin/tree-type-distribution',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

// 领养类型排行
const getAdoptionTypeRankingConfig = () => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/datachart/admin/adoption-type-ranking',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    }
  }
}

export {
  getTotalStatisticsConfig,
  getAreaDistributionConfig,
  getAdoptionTrendConfig,
  getTreeTypeAdoptionsConfig,
  getTreeTypeDistributionConfig,
  getAdoptionTypeRankingConfig
}
