import { get_user_info, login as loginApi } from '@/api'
import type { User } from '@/types'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 初始化状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const userInfo = ref<User | null>(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null
  )
  const isLoggedIn = ref(!!localStorage.getItem('token'))

  // 登录
  const login = async (data: {
    email: string
    password: string
    captcha: string
  }) => {
    try {
      const result = await loginApi(data)
      if (result.code === 200) {
        // 更新状态
        token.value = result.data.token
        refreshToken.value = result.data.refresh
        userInfo.value = result.data
        isLoggedIn.value = true

        // 持久化存储
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('refreshToken', result.data.refresh)
        localStorage.setItem('userInfo', JSON.stringify(result.data))

        return result
      }
      ElMessage.error(result.message)
      return Promise.reject(new Error(result.message))
    } catch (error) {
      ElMessage.error('登录失败，请稍后重试')
      return Promise.reject(error)
    }
  }

  // 退出登录
  const logout = () => {
    // 清除状态
    token.value = null
    refreshToken.value = null
    userInfo.value = null
    isLoggedIn.value = false

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
  }

  // 添加更新用户信息的方法
  const updateUserInfo = (data: User) => {
    userInfo.value = data
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  // 获取最新的用户信息
  const fetchUserInfo = async () => {
    try {
      const result = await get_user_info()
      if (result.code === 200) {
        userInfo.value = result.data
        localStorage.setItem('userInfo', JSON.stringify(result.data))
      }
    } catch (error) {
      // 如果获取失败，可能是 token 过期，清除登录状态
      logout()
    }
  }

  return {
    token,
    refreshToken,
    userInfo,
    isLoggedIn,
    login,
    logout,
    updateUserInfo,
    fetchUserInfo
  }
})
