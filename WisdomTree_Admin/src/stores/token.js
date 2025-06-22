// token的pinia模块
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const adminTokenStore = defineStore(
  'token',
  () => {
    // Accesstoken
    const Accesstoken = ref('')
    // RefreshToken
    const RefreshToken = ref('')
    // 保存Accesstoken
    const saveToken = (token) => {
      Accesstoken.value = token
    }
    // 保存RefreshToken
    const saveRefreshToken = (token) => {
      RefreshToken.value = token
    }
    return {
      Accesstoken,
      RefreshToken,
      saveToken,
      saveRefreshToken
    }
  },
  // 持久化
  { persist: true }
)
