import router from '@/router'
import axios from 'axios'
import { adminTokenStore } from '@/stores/token'
import { ElMessage } from 'element-plus'
import { BaseUrl } from '../BaseUrl'

// 创建一个函数来验证RefreshToken并刷新 AccessToken
const NewAccesstoken = async () => {
  try {
    const token = adminTokenStore()
    const res = await axios({
      url: `${BaseUrl}/auth/refreshAccess`, // 使用 .env 中的变量
      method: 'get',
      headers: {
        authorization: `Bearer ${token.RefreshToken}` // 自定义请求头信息
      }
    })
    token.saveToken(res.data.data.accessToken)
    console.log('accessToken 刷新/自动登录成功')
    return true
  } catch (error) {
    console.log(error)
    console.log('accessToken 刷新/自动登录失败')
    // 提示用户登录过期 需要重新登录
    ElMessage.error('登录过期，请重新登录')
    // 跳转到登录路由
    router.push('/login')
    return false
  }
}

// 创建一个函数来处理真正的双token逻辑 （普通请求也适用）
const requestWithRetry = async (requestConfig) => {
  try {
    // 直接发送请求
    const response = await axios(requestConfig)
    return response
  } catch (error) {
    console.log(error)
    // 如果accessToken令牌过期
    if (error.response.data.message === 'AccessToken过期/错误') {
      // 尝试刷新 AccessToken
      const refreshResult = await NewAccesstoken()
      // 刷新成功
      if (refreshResult) {
        // 重新配置请求头，使用新的 AccessToken
        const token = adminTokenStore()
        const newRequestConfig = {
          ...requestConfig,
          headers: {
            Authorization: `Bearer ${token.Accesstoken}`
          }
        }
        // 返回重试请求 外部代码接受
        return await axios(newRequestConfig)
      } else {
        console
        // 刷新失败 返回false 以便外部代码处理
        throw new Error('刷新失败')
      }
    }
    // 抛出错误，外部代码能够捕获
    throw error
  }
}

export { requestWithRetry }
