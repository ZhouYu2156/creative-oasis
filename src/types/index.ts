// 音乐对象数据结构
export interface Music {
  id: string
  singer: string
  songName: string
  cover: string
  play_url: string
  lyrics: string
}

// 响应状态码
// 200: 成功
type SUCCESS = 200
// 201: 订单创建完成
type CREATED = 201
// 400: 错误的请求参数
type BAD_REQUEST = 400
// 401: 未授权
type UNAUTHORIZED = 401
// 403: 禁止访问
type FORBIDDEN = 403
// 404: 资源未找到
type NOT_FOUND = 404
// 409: 资源冲突
type CONFLICT = 409
// 500: 服务器错误
type ERROR = 500

// 响应类型
export type ResponseStatusType = SUCCESS | CREATED | BAD_REQUEST | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | ERROR

export enum ResponseStatus {
  SUCCESS = 200,      // 请求成功
  CREATED = 201,      // 对象创建完成
  BAD_REQUEST = 400,  // 请求参数错误
  UNAUTHORIZED = 401, // 未登录或token失效
  FORBIDDEN = 403,    // 无权限访问
  NOT_FOUND = 404,    // 资源不存在
  CONFLICT = 409,     // 资源冲突
  ERROR = 500,        // 服务器内部错误
}

// 数据响应格式
export interface BaseResponseType<T> {
  code: ResponseStatusType
  message: string
  data: T
}

export interface Musics {
  list: Music[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// 用户对象
export interface User {
  id: number // 用户ID
  nickname: string // 昵称
  avatar: string // 头像
  gender: 'male' | 'female' | 'unknown' // 性别
  email: string // 邮箱
  is_member: boolean // 是否会员
  member_expired_time: string // 会员到期时间
  bio: string // 个性签名
  location: string // 所在地
  token: string // 令牌
  refresh: string // 刷新令牌
  last_login_ip: string // 最后登录IP
  last_login_time: string // 最后登录时间
}

export interface VideoCategory {
  id: number
  title: string
  description: string
  cover: string
  difficulty: string
  difficulty_text: string
  tech_stack: Techtag[]
  lesson_count: number
  student_count: number
  is_member_only: boolean
  order: number
}

interface Techtag {
  id: number
  name: string
}

// 视频教程分类信息
export interface CourseType {
  id: number
  name: string
  description: string
  categories: VideoCategory[]
  order: number
}

// 视频对象
export interface Video {
  id: number
  title: string
  cover_url: string
  description: string
  duration: number
  is_free: boolean
  price: string
  category_title: string
  tech_stack: Techtag[]
  order: number
}

// 视频详情
export interface VideoDetail {
  id: number
  title: string
  cover_url: string
  video_url: string
  description: string
  duration: number
  is_free: boolean
  price: string
  tech_stack: Techstack[]
  category: VideoCategory
  created_at: string
}

interface Techstack {
  id: number
  name: string
}

// 评论类型定义
export interface Comment {
  id: number
  user: {
    id: number
    name: string
    avatar: string
  }
  content: string
  created_at: string
  likes: number
  is_liked?: boolean
  replies?: {
    id: number
    user: {
      id: number
      name: string
      avatar: string
    }
    reply_to?: {
      id: number
      name: string
    }
    content: string
    created_at: string
    likes: number
    is_liked?: boolean
  }[]
}

// 订单状态: 待支付、已扫描、已支付、已取消、支付失败
export type OrderStatus = 'pending' | 'scanned' | 'paid' | 'cancelled' | 'failed'

// 扫码状态: 只包含前三个状态（分别表示未扫描、已扫描、已支付）
export type ScanStatus = Extract<OrderStatus, 'pending' | 'scanned' | 'paid'>

// 订单类型: 月度会员、年度会员
export type OrderType = 'monthly' | 'yearly'

// 添加订单相关类型
export interface Order {
  order_no: string            // 订单号
  amount: number             // 订单金额
  status: OrderStatus        // 订单状态
  order_type: OrderType      // 订单类型
  qr_code: string           // 二维码（base64）
  created_at: string        // 创建时间
  updated_at: string        // 更新时间
  paid_time: string | null  // 支付时间
  expire_time: string       // 过期时间
  signature: string         // 签名（用于验证扫码请求的合法性）
}

// 酷狗音乐数据接口
export interface KugouMusic {
  id: string
  singer: string
  songName: string
  fileName: string
  albumId: string
  albumName: string
  extName: string
  emixSongId: string
}







