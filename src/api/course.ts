import request from '@/api'
import type { BaseResponseType, Comment, CourseType, Video } from '@/types'

// 获取课程分类
export const get_categories = async (): Promise<BaseResponseType<CourseType[]>> => request.get('/courses/types/')

// 获取课程视频列表
export const get_videos = async (params: {
  category: number
}): Promise<BaseResponseType<Video[]>> => request.get(`/courses/categories/${params.category}/videos/`)

// 获取课程视频详情
export const get_video_detail = async (params: {
  category: number
  id: number
}): Promise<BaseResponseType<VideoDetail>> => request.get(`/courses/categories/${params.category}/videos/${params.id}/`)

// 获取评论列表
export const get_video_comments = async (params: {
  video_id: number
}): Promise<BaseResponseType<Comment[]>> => request({
  url: `/courses/videos/${params.video_id}/comments/`,
  method: 'GET'
})

// 发表评论
export const post_video_comment = async (params: {
  video_id: number
  content: string
}): Promise<BaseResponseType<Comment>> => request({
  url: `/courses/videos/${params.video_id}/comments/`,
  method: 'POST',
  data: { content: params.content }
})

// 回复评论
export const reply_video_comment = async (params: {
  video_id: number
  comment_id: number
  content: string
  reply_to?: { id: number; name: string }
}): Promise<BaseResponseType<Comment>> => request({
  url: `/courses/videos/${params.video_id}/comments/${params.comment_id}/reply/`,
  method: 'POST',
  data: {
    content: params.content,
    reply_to: params.reply_to
  }
})

// 评论点赞/取消点赞
export const toggle_comment_like = async (params: {
  video_id: number
  comment_id: number
}) => request<{ is_liked: boolean; likes: number }>({
  url: `/courses/videos/${params.video_id}/comments/${params.comment_id}/like/`,
  method: 'POST'
})
