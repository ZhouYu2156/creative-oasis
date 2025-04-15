import request from '@/api'
import type { Musics } from '@/types'


// 获取本地推荐音乐列表
export const getRecommendMusics = async () => request<Musics>({
  url: '/music/',
  method: 'GET',
})

// 搜索音乐
export const searchMusics = async ({
  keyword
}: {
  keyword: string
}) => request<Musics>({
  url: '/music/',
  method: 'GET',
  params: { keyword }
})

// 酷狗搜索
export const searchKugouMusics = async ({ keyword, page = 1, pageSize = 10 }: { keyword: string, page?: number, pageSize?: number }) => request<{
  list: {
    id: string
    singer: string
    songName: string
    fileName: string
    albumId: string
    albumName: string
    extName: string
    emixSongId: string
  }[],
  total: number
}>({
  url: '/music/kugou/search/',
  method: 'POST',
  data: { keyword, page, pageSize }
})
// 酷狗详情音乐
export const getKugouMusicDetail = async ({ emixSongId }: { emixSongId: string }) => request<{
  id: number
  singer: string
  songName: string
  cover: string
  play_url: string
  lyrics: string
}>({
  url: '/music/kugou_music_detail/',
  method: 'GET',
  params: { emixSongId }
})


