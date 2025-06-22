import { BaseUrl } from '../BaseUrl'
import { adminTokenStore } from '@/stores/token'

// 获取领养列表
const searchUserConfig = (userInput) => {
  const token = adminTokenStore()
  return {
    url: BaseUrl + '/admin/searchUser',
    method: 'get',
    headers: {
      authorization: `Bearer ${token.Accesstoken}`
    },
    params: { userInput }
  }
}

export { searchUserConfig }
