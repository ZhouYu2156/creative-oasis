import request from '@/api'
import type { BaseResponseType, Order, OrderStatus, OrderType } from '@/types'


// 创建订单: 传递给后端订单类型，后端根据订单类型创建订单，并返回订单信息，包括订单号、二维码(二维码信息是一个携带着订单号的支付链接)，code 为 201 表示订单创建完成
/**
 * 创建订单
 * @param data 订单类型
 * @returns 订单信息
 * {
 *  code: 201,
 *  data: {
 *    "order_no": "202502131809582a0f8f59",
    "amount": 29,
    "status": "pending",
    "order_type": "monthly",
    "qr_code": "base64编码的二维码",
    "created_at": "2025-02-13T18:09:58.296459Z",
    "expire_time": "2025-02-13T18:19:58.296459Z",
    "paid_time": null
 *  }
 * }
 */
export const create_order = async (data: {
  order_type: OrderType
}): Promise<BaseResponseType<Order>> =>
  request.post('/orders/orders/', data)


// 扫码更新状态: 传递order_no（交易单号）、status（状态），后端更新订单状态
/**
 * 扫码更新状态
 * @param data 订单号、状态
 * 前端传参：
 *    "order_no": "202402140001abcd",
 *    "status": "scanned",  # scanned/paid/cancelled
 *    "signature": "md5_signature_here"
 */
export const update_order_status = async (data: {
  order_no: string
  status: Extract<OrderStatus, 'scanned' | 'paid' | 'cancelled'>
  signature: string
}): Promise<BaseResponseType<Order>> =>
  request.post('/orders/orders/update_status/', data)


// 获取订单数据: 传递order_no（订单号），后端返回订单数据
/**
 * 获取订单数据
 * @param params 订单号
 * @returns 订单数据
 * @example
 * 获取订单信息
 * 前端传参：order_no (查询参数)
 * 响应：
 * {
 *  code: 200,
 *  message: "success",
 *  data: {
 *    "order_no": "202402140001abcd",
 *    "amount": "29.00",
 *    "status": "pending",
 *    "order_type": "monthly",
 *    "qr_code": "data:image/png;base64,...",
 *    "paid_time": null,
 *    "created_at": "2024-02-14T12:00:00Z",
 *    "updated_at": "2024-02-14T12:00:00Z",
 *    "expire_time": "2024-02-14T12:10:00Z",
 *    "user": {
 *      "id": 1,
 *      "username": "test_user",
 *      "nickname": "测试用户",
 *      "email": "test@example.com",
 *      "is_member": false,
 *      "member_expired_time": null
 *    }
 *  }
 * }
 */
export const get_order_status = async (params: {
  order_no: string
}): Promise<BaseResponseType<Order>> =>
  request.get('/orders/orders/get_order/', { params })


// 获取用户订单列表
export const get_user_orders = async (params?: {
  page?: number
  page_size?: number
  status?: string
  order_type?: OrderType
}): Promise<BaseResponseType<{
  total: number
  page: number
  page_size: number
  results: Order[]
}>> => request.get('/orders/orders/', { params })


// 删除订单
export const delete_order = async (order_no: string): Promise<BaseResponseType<null>> =>
  request.delete(`/orders/orders/${order_no}/`)


