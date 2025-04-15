import request from '@/api'
import type { Order } from '@/types'
import { defineStore } from 'pinia'


export const useOrderStore = defineStore('order', () => {

  // 创建订单
  const createOrder = async (order: Order) => {
    const response = await request.post('/orders', order)
    return response.data
  }

  // 获取订单
  const getOrder = async (orderNo: string) => {
    const response = await request.get(`/orders/${orderNo}`)
    return response.data
  }



})
