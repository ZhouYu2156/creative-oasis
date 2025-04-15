import { ResponseStatus } from '@/types'
import axios from 'axios'
import { ElMessage } from 'element-plus'

import router from '@/router'

const request = axios.create({
  //baseURL: 'http://192.168.21.4:8080/api/v1', // 设置后端服务地址为本机的局域网地址，当局域网其他终端设备访问时，他们的终端设备请求的后端地址才是正确的
  // baseURL: 'http://192.168.106.129:8080/api/v1',
  baseURL: 'https://www.zhouyu2156.cn:8080/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use((config) => {
  // 在发送请求前，带上 token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 使用泛型来标注响应数据的格式
request.interceptors.response.use(
  (response) => {
    // response.data 的类型是 BaseResponseType<T>
    // response.data.data 的类型是 T
    // 开发环境打印请求地址和返回数据
    if (import.meta.env.DEV) console.log(response.config.url, '->', response.data)

    if (response.data.code >= 200 && response.data.code < 300) {
      // 只在有消息时才显示成功提示
      if (response.data.message && response.data.message !== 'success') {
        ElMessage.success(response.data.message)
      }
      return Promise.resolve(response.data)
    }
    // 401 未授权
    else if (response.data.code === ResponseStatus.UNAUTHORIZED) {
      ElMessage.error(response.data.message)
      router.push('/401')
    }
    // 403 禁止访问
    else if (response.data.code === ResponseStatus.FORBIDDEN) {
      ElMessage.error(response.data.message)
      router.push('/403')
    }
    // 404 未找到
    else if (response.data.code === ResponseStatus.NOT_FOUND) {
      ElMessage.error(response.data.message)
      router.push('/404')
    }
    // 其他错误
    else {
      ElMessage.error(response.data.message)
    }
    return Promise.reject(response.data)
  },
  (error) => {
    console.log('error', error)
    // 判断是否是网络错误或者请求超时
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      ElMessage.error('网络错误，请稍后再试')
    } else {
      ElMessage.error('请求超时，请稍后再试')
    }
    return Promise.reject(error)
  },
)

export * from './course'
export * from './music'
export * from './user'

export default request
