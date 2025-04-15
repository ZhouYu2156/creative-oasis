import request from '@/api'
import type { BaseResponseType, User } from '@/types'

// 请求发送验证码
export const send_email_code = async (email: string): Promise<BaseResponseType<null>> => {
  return request({
    url: '/users/send_email_code/',
    method: 'post',
    data: { email }
  })
}

// 图片验证码
export const get_captcha = async (): Promise<BaseResponseType<{
  captcha_image: string  // base64 编码的图片
}>> => {
  return request({
    url: '/users/get_captcha/',
  })
}

// 请求注册
export const register = async (data: {
  email: string
  password: string
  confirm_password: string
  email_code: string
}): Promise<BaseResponseType<any>> => {
  return request({
    url: '/users/register/',
    method: 'post',
    data
  })
}


// 请求登录
export const login = async (data: {
  email: string
  password: string
  captcha: string
}): Promise<BaseResponseType<User>> => {
  return request({
    url: '/users/login/',
    method: 'post',
    data
  })
}

// 修改个人信息
export const update_profile = async (data: {
  nickname: string
  gender: string
  location: string
  bio: string
}): Promise<BaseResponseType<any>> => {
  return request({
    url: '/users/update_profile/',
    method: 'patch',
    data
  })
}

// 获取用户信息
export const get_user_info = async (): Promise<BaseResponseType<User>> => {
  return request({
    url: '/users/get_user_info/',
    method: 'get',
  })
}




