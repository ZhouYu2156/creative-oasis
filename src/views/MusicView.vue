<script setup lang="ts">
import { getKugouMusicDetail, getRecommendMusics, searchKugouMusics, searchMusics } from '@/api' // 导入 API 函数
import KugouMusicTable from '@/components/KugouMusicTable.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import MusicTable from '@/components/MusicTable.vue'
import type { KugouMusic, Music } from '@/types'
import { ElDialog, ElLoading, ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

// ------------------- 搜索音乐 -------------------
// 搜索关键词
const searchQuery = ref('')

// 搜索结果
const allSearchResults = ref<Music[]>([]) // 存储所有搜索结果
const searchResults = ref<Music[]>([]) // 当前页显示的结果
const isSearching = ref(false)

// 搜索分页
const searchCurrentPage = ref(1)
const searchPageSize = ref(10)
const searchTotal = ref(0)

// 计算当前页的搜索结果
const updateCurrentPageResults = () => {
  const start = (searchCurrentPage.value - 1) * searchPageSize.value
  const end = start + searchPageSize.value
  searchResults.value = allSearchResults.value.slice(start, end)
}

// 处理搜索
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入关键字搜索！')
    return
  }

  isSearching.value = true
  try {
    const result = await searchMusics({ keyword: searchQuery.value })

    allSearchResults.value = result.data.list
    searchTotal.value = result.data.list.length
    searchCurrentPage.value = 1
    updateCurrentPageResults()
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    isSearching.value = false
  }
}

// 处理搜索分页变化
const handleSearchPageChange = (page: number) => {
  searchCurrentPage.value = page
  updateCurrentPageResults()
  // 页面滚动到搜索结果顶部
  window.scrollTo({
    top: (document.querySelector('.search-results') as HTMLElement)?.offsetTop,
    behavior: 'smooth',
  })
}

// 处理关键词搜索
const handleKeywordSearch = (keyword: string) => {
  searchQuery.value = keyword
  handleSearch()
}

// ------------------- 推荐音乐列表 -------------------
// 推荐音乐列表
const recommendMusics = ref<Music[]>([])

// 加载状态
const loading = ref(false)

// 获取推荐音乐数据
const fetchRecommendMusic = async () => {
  loading.value = true
  try {
    const response = await getRecommendMusics()
    recommendMusics.value = response.data.list // 推荐音乐列表
  } catch (error) {
    console.error('获取推荐音乐失败, 请稍后重试', error)
  } finally {
    loading.value = false
  }
}

// 赞赏码弹窗控制
const showDonationDialog = ref(false)

// 组件挂载时获取数据和显示赞赏码
onMounted(() => {
  fetchRecommendMusic()
  // 延迟 1 秒显示赞赏码，避免与页面加载冲突
  setTimeout(() => {
    showDonationDialog.value = true
  }, 1000)
})

// ------------------- 音乐播放器 -------------------
const musicPlayer = ref<InstanceType<typeof MusicPlayer> | null>(null)

// 用来存储播放器当前状态
const playerState = ref({
  currentMusic: null as Music | null,
  isPlaying: false,
})

// 创建一个更新状态的函数
const updatePlayerState = (music: Music | null, playing: boolean) => {
  playerState.value.currentMusic = music
  playerState.value.isPlaying = playing
}

// 修改播放音乐的处理函数
const playMusic = (music: Music) => {
  // 如果是同一首歌，且当前有歌曲但已暂停，则继续播放
  if (playerState.value.currentMusic?.id === music.id && !playerState.value.isPlaying) {
    musicPlayer.value?.resume()
    return
  }
  // 否则作为新歌曲播放
  musicPlayer.value?.playMusic(music)
}

// 修改暂停播放的处理函数
const handlePause = () => {
  musicPlayer.value?.pause()
}

// 处理下载
const handleDownload = async (song: Music) => {
  try {
    // 创建进度提示
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在下载: 0%',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    // 获取音乐文件
    const response = await fetch(song.play_url)
    const contentLength = Number(response.headers.get('content-length'))
    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error('无法读取文件流')
    }

    // 读取数据流
    const chunks: Uint8Array[] = []
    let receivedLength = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      receivedLength += value.length

      // 更新进度
      const progress = ((receivedLength / contentLength) * 100).toFixed(1)
      loadingInstance.setText(`正在下载: ${progress}%`)
    }

    // 合并数据块
    const blob = new Blob(chunks, { type: 'audio/mpeg' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl

    // 设置下载文件名: 歌手-歌名.mp3，处理特殊字符
    const fileName = `${song.singer}-${song.songName}.mp3`.replace(/[<>:"/\\|?*]+/g, '_')
    link.download = fileName

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
    loadingInstance.close()

    ElMessage.success({
      message: '下载成功！',
      duration: 2000,
    })
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error({
      message: '下载失败，请稍后重试',
      duration: 2000,
    })
  }
}

// ------------------- 酷狗音乐搜索 -------------------
const kugouSearchQuery = ref('')
const kugouSearchResults = ref<KugouMusic[]>([])
const isKugouSearching = ref(false)

// 酷狗搜索分页
const kugouCurrentPage = ref(1)
const kugouPageSize = ref(10)
const kugouTotal = ref(0)

// 每页数量选项
const pageSizeOptions = [10, 20, 30, 50, 100]

// 处理酷狗音乐搜索
const handleKugouSearch = async () => {
  if (!kugouSearchQuery.value.trim()) {
    ElMessage.warning('请输入关键字搜索！')
    return
  }

  isKugouSearching.value = true
  try {
    const result = await searchKugouMusics({
      keyword: kugouSearchQuery.value,
      page: kugouCurrentPage.value,
      pageSize: kugouPageSize.value,
    })
    kugouSearchResults.value = result.data.list
    kugouTotal.value = result.data.total
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
  } finally {
    isKugouSearching.value = false
  }
}

// 处理每页数量变化
const handleKugouSizeChange = (size: number) => {
  kugouPageSize.value = size
  kugouCurrentPage.value = 1 // 重置到第一页
  handleKugouSearch()
}

// 处理酷狗搜索分页变化
const handleKugouPageChange = (page: number) => {
  kugouCurrentPage.value = page
  handleKugouSearch()
  // 页面滚动到搜索结果顶部
  window.scrollTo({
    top: (document.querySelector('.kugou-search-results') as HTMLElement)?.offsetTop,
    behavior: 'smooth',
  })
}

// 处理酷狗关键词搜索
const handleKugouKeywordSearch = (keyword: string) => {
  kugouSearchQuery.value = keyword
  kugouCurrentPage.value = 1 // 重置页码
  handleKugouSearch()
}

// 输入框回车搜索或者点击搜索按钮搜索，前置处理
const handleKugouSearchPreprocess = () => {
  kugouCurrentPage.value = 1 // 重置页码
  handleKugouSearch()
}

// 处理酷狗音乐播放
const playKugouMusic = async (music: KugouMusic) => {
  try {
    // 如果是同一首歌，且当前有歌曲但已暂停，则继续播放
    if (playerState.value.currentMusic?.id === music.id && !playerState.value.isPlaying) {
      musicPlayer.value?.resume()
      return
    }

    // 获取音乐详情
    const detail = await getKugouMusicDetail({ emixSongId: music.emixSongId })
    // 转换为播放器需要的格式
    const playableMusic = {
      id: music.id,
      singer: music.singer,
      songName: music.songName,
      cover: detail.data.cover,
      play_url: detail.data.play_url,
      lyrics: detail.data.lyrics,
    }
    // 播放音乐
    musicPlayer.value?.playMusic(playableMusic)
  } catch (error) {
    console.error('获取音乐详情失败:', error)
    ElMessage.error('获取音乐详情失败，请稍后重试')
  }
}

// 处理酷狗下载
const handleKugouDownload = async (music: KugouMusic) => {
  try {
    // 获取音乐详情
    const detail = await getKugouMusicDetail({ emixSongId: music.emixSongId })

    // 创建进度提示
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在下载: 0%',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    // 获取音乐文件
    const response = await fetch(detail.data.play_url)
    const contentLength = Number(response.headers.get('content-length'))
    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error('无法读取文件流')
    }

    // 读取数据流
    const chunks: Uint8Array[] = []
    let receivedLength = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      receivedLength += value.length

      // 更新进度
      const progress = ((receivedLength / contentLength) * 100).toFixed(1)
      loadingInstance.setText(`正在下载: ${progress}%`)
    }

    // 合并数据块
    const blob = new Blob(chunks, { type: 'audio/mpeg' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl

    // 设置下载文件名: 歌手-歌名.mp3，处理特殊字符
    const fileName = `${music.singer}-${music.songName}.mp3`.replace(/[<>:"/\\|?*]+/g, '_')
    link.download = fileName

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
    loadingInstance.close()

    ElMessage.success({
      message: '下载成功！',
      duration: 2000,
    })
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error({
      message: '下载失败，请稍后重试',
      duration: 2000,
    })
  }
}

// ----------------------- 赞赏码弹窗 -----------------------
const isDark = ref(false)
watch(
  () => document.documentElement.classList.contains('dark'),
  (value) => {
    isDark.value = value
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8 pb-16">
    <!-- 赞赏码弹窗 -->
    <el-dialog
      v-model="showDonationDialog"
      title="支持与鼓励"
      :width="400"
      class="donation-dialog"
      :fullscreen="false"
      align-center>
      <div class="text-center space-y-4">
        <div class="donation-content space-y-3 mb-4">
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            亲爱的音乐爱好者：
          </p>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            感谢您使用我们的音乐服务！<br />为了给大家提供更好的体验，我们投入了大量时间和资源：
          </p>
          <ul class="text-left text-gray-600 dark:text-gray-300 space-y-2 mx-2 sm:mx-4">
            <li class="text-xs sm:text-sm ps-8">每日更新token，确保服务稳定</li>
            <li class="text-xs sm:text-sm ps-8">维护服务器，保障访问速度</li>
            <li class="text-xs sm:text-sm ps-8">持续优化功能，提升使用体验</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed mt-3 text-sm sm:text-base">
            如果您觉得这些努力为您带来了价值，请考虑赞赏支持。<br />您的每一份鼓励，都是我们坚持的动力！
          </p>
        </div>
        <div class="donation-qr-wrapper mx-auto">
          <img
            :src="isDark ? 'AppreciationCode-dark.jpg' : 'AppreciationCode-light.jpg'"
            alt="赞赏码"
            class="w-48 h-48 sm:w-64 sm:h-64 object-cover mx-auto rounded-lg shadow-md" />
        </div>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3">
          扫描上方二维码，支持一下开发者
        </p>
      </div>
    </el-dialog>

    <!-- 搜索区域 -->
    <div class="mb-12">
      <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
        本站音乐搜索
      </h2>
      <p class="text-center text-gray-500 dark:text-gray-400 mb-6 font-ZKKuaiLeTi">
        享受品质音乐，尽在搜索
      </p>
      <div class="flex justify-center">
        <div class="w-[600px] relative flex">
          <!-- 搜索输入框容器 -->
          <div class="flex-1">
            <div
              class="flex items-center bg-white dark:bg-gray-800 rounded-l-lg border-2 border-r-0 border-gray-300 dark:border-gray-600 focus-within:border-primary-500 dark:focus-within:border-primary-500 transition-colors duration-300 h-11">
              <!-- 搜索图标 -->
              <div class="pl-4 text-gray-400">
                <el-icon><Search /></el-icon>
              </div>
              <!-- 输入框 -->
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索歌名、歌手..."
                class="flex-1 px-3 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                @keyup.enter="handleSearch" />
            </div>
          </div>
          <!-- 搜索按钮 -->
          <button
            class="h-11 px-8 bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed rounded-r-lg flex items-center justify-center min-w-[100px]"
            :disabled="isSearching"
            @click="handleSearch">
            <template v-if="isSearching">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </template>
            <span v-else>搜索</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索结果表格或占位内容 -->
    <div class="mb-12 search-results">
      <template v-if="searchResults.length > 0">
        <MusicTable
          :songs="searchResults"
          :loading="isSearching"
          :current-music="playerState.currentMusic"
          :is-playing="playerState.isPlaying"
          @play="playMusic"
          @pause="handlePause"
          @download="handleDownload" />

        <!-- 搜索结果分页 -->
        <div v-if="allSearchResults.length > searchPageSize" class="flex justify-center mt-8">
          <el-pagination
            v-model:current-page="searchCurrentPage"
            :page-size="searchPageSize"
            :total="searchTotal"
            :background="true"
            layout="prev, pager, next"
            @current-change="handleSearchPageChange" />
        </div>
      </template>

      <!-- 搜索占位内容 -->
      <div v-else class="bg-white dark:bg-dark-card rounded-lg p-8">
        <div class="text-center space-y-6">
          <!-- 搜索建议图标 -->
          <div class="flex justify-center">
            <el-icon class="text-primary-500 text-6xl"><Search /></el-icon>
          </div>
          <!-- 搜索建议标题 -->
          <h3 class="text-xl font-medium text-gray-900 dark:text-white">搜索建议</h3>
          <!-- 搜索建议列表 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div
              v-for="keyword in ['周杰伦', '林俊杰', '邓紫棋', '薛之谦']"
              :key="keyword"
              class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              @click="handleKeywordSearch(keyword)">
              <p class="text-gray-600 dark:text-gray-300">{{ keyword }}</p>
            </div>
          </div>
          <!-- 使用提示 -->
          <div class="text-gray-500 dark:text-gray-400 space-y-2 mt-8">
            <p>您可以：</p>
            <ul class="space-y-1 text-sm">
              <li>• 输入歌手姓名搜索</li>
              <li>• 输入歌曲名称搜索</li>
              <li>• 点击上方推荐关键词快速搜索</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 酷狗音乐搜索区域 -->
    <div class="mb-12">
      <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
        酷狗音乐搜索
      </h2>
      <p class="text-center text-gray-500 dark:text-gray-400 mb-6 font-ZKKuaiLeTi">
        海量音乐，一键搜索
      </p>
      <div class="flex justify-center mb-12">
        <div class="w-[600px] relative flex">
          <!-- 搜索输入框容器 -->
          <div class="flex-1">
            <div
              class="flex items-center bg-white dark:bg-gray-800 rounded-l-lg border-2 border-r-0 border-gray-300 dark:border-gray-600 focus-within:border-primary-500 dark:focus-within:border-primary-500 transition-colors duration-300 h-11">
              <!-- 搜索图标 -->
              <div class="pl-4 text-gray-400">
                <el-icon><Search /></el-icon>
              </div>
              <!-- 输入框 -->
              <input
                v-model="kugouSearchQuery"
                type="text"
                placeholder="搜索歌名、歌手、歌词..."
                class="flex-1 px-3 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                @keyup.enter="handleKugouSearchPreprocess" />
            </div>
          </div>
          <!-- 搜索按钮 -->
          <button
            class="h-11 px-8 bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed rounded-r-lg flex items-center justify-center min-w-[100px]"
            :disabled="isKugouSearching"
            @click="handleKugouSearchPreprocess">
            <template v-if="isKugouSearching">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </template>
            <span v-else>搜索</span>
          </button>
        </div>
      </div>

      <!-- 搜索结果表格或占位内容 -->
      <div class="kugou-search-results">
        <template v-if="kugouSearchResults.length > 0">
          <KugouMusicTable
            :songs="kugouSearchResults"
            :loading="isKugouSearching"
            :current-music="playerState.currentMusic"
            :is-playing="playerState.isPlaying"
            @play="playKugouMusic"
            @pause="handlePause"
            @download="handleKugouDownload" />

          <!-- 搜索结果分页 -->
          <div v-if="kugouTotal > 0" class="flex justify-end mt-8 items-center gap-2">
            <el-select
              v-model="kugouPageSize"
              class="!w-[90px]"
              :size="'default'"
              @change="handleKugouSizeChange">
              <el-option
                v-for="size in pageSizeOptions"
                :key="size"
                :label="`${size}条/页`"
                :value="size" />
            </el-select>
            <el-pagination
              v-model:current-page="kugouCurrentPage"
              :page-size="kugouPageSize"
              :total="kugouTotal"
              :pager-count="5"
              :background="true"
              layout="prev, pager, next"
              @current-change="handleKugouPageChange" />
          </div>
        </template>

        <!-- 搜索占位内容 -->
        <div v-else class="bg-white dark:bg-dark-card rounded-lg p-8">
          <div class="text-center space-y-6">
            <!-- 搜索建议图标 -->
            <div class="flex justify-center">
              <el-icon class="text-primary-500 text-6xl"><Search /></el-icon>
            </div>
            <!-- 搜索建议标题 -->
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">酷狗音乐搜索</h3>
            <!-- 搜索特点介绍 -->
            <div class="max-w-2xl mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 class="text-lg font-medium text-primary-500 mb-3">智能搜索</h4>
                  <ul
                    class="space-y-2 text-sm text-gray-600 dark:text-gray-300 flex flex-col items-center">
                    <li class="flex items-center gap-2">
                      <el-icon><Check /></el-icon>
                      <span>支持歌名、歌手精确搜索</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <el-icon><Check /></el-icon>
                      <span>支持歌词内容或关键字模糊匹配</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <el-icon><Check /></el-icon>
                      <span>支持拼音、首字母搜索</span>
                    </li>
                  </ul>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 class="text-lg font-medium text-primary-500 mb-3">海量资源</h4>
                  <ul
                    class="space-y-2 text-sm text-gray-600 dark:text-gray-300 flex flex-col items-center">
                    <li class="flex items-center gap-2">
                      <el-icon><Check /></el-icon>
                      <span>覆盖全网热门音乐</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <el-icon><Check /></el-icon>
                      <span>收录最新发行歌曲</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <el-icon><Check /></el-icon>
                      <span>包含经典老歌曲目</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- 搜索建议列表 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div
                v-for="keyword in [
                  '周杰伦 - 晴天',
                  '林俊杰 - 江南',
                  '邓紫棋 - 泡沫',
                  '薛之谦 - 演员',
                ]"
                :key="keyword"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                @click="handleKugouKeywordSearch(keyword)">
                <p class="text-gray-600 dark:text-gray-300">{{ keyword }}</p>
              </div>
            </div>
            <!-- 使用提示 -->
            <div class="text-gray-500 dark:text-gray-400 space-y-2 mt-8">
              <p>搜索示例：</p>
              <ul class="space-y-2 text-sm">
                <li>• 歌手名：周杰伦、林俊杰</li>
                <li>• 歌曲名：晴天、江南</li>
                <li>• 歌词片段：我落泪情绪零碎、小酒窝长睫毛</li>
                <li>• 拼音搜索：zhoujielun、qingtian</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐音乐列表 -->
    <div class="mb-12">
      <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">推荐音乐</h2>
      <p class="text-center text-gray-500 dark:text-gray-400 mb-6 font-ZKKuaiLeTi">
        不知道听些什么？试试推荐音乐吧~
      </p>

      <!-- 加载状态 -->
      <div
        v-if="loading"
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <div
          v-for="index in 20"
          :key="index"
          class="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden animate-pulse">
          <!-- 骨架屏内容保持不变 -->
          <div class="aspect-square bg-gray-200 dark:bg-gray-900">
            <el-skeleton animated :loading="true">
              <template #template>
                <el-skeleton-item variant="image" class="w-full h-full" />
              </template>
            </el-skeleton>
          </div>
          <div class="p-4 space-y-3">
            <el-skeleton animated :loading="true">
              <template #template>
                <el-skeleton-item variant="h3" class="h-4" />
              </template>
            </el-skeleton>
            <el-skeleton animated :loading="true">
              <template #template>
                <el-skeleton-item variant="text" class="w-2/3 h-3" />
              </template>
            </el-skeleton>
          </div>
        </div>
      </div>

      <!-- 音乐列表 -->
      <div v-else class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <div
          v-for="music in recommendMusics"
          :key="music.id"
          class="bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <!-- 音乐卡片内容保持不变 -->
          <div class="relative aspect-square overflow-hidden rounded-t-lg group">
            <img
              :src="music.cover"
              :alt="music.songName"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              loading="lazy" />
            <div
              class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <el-button
                type="primary"
                :icon="
                  playerState.currentMusic?.id === music.id && playerState.isPlaying
                    ? 'VideoPause'
                    : 'VideoPlay'
                "
                circle
                @click="
                  playerState.currentMusic?.id === music.id && playerState.isPlaying
                    ? handlePause()
                    : playMusic(music)
                " />
            </div>
          </div>
          <div class="p-4">
            <h3
              class="text-base font-medium text-gray-900 dark:text-white truncate"
              :title="music.songName">
              {{ music.songName }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 truncate mt-1" :title="music.singer">
              {{ music.singer }}
            </p>
          </div>
        </div>
      </div>

      <!-- 刷新推荐音乐：旋转动画 -->
      <div class="flex justify-center mt-8">
        <el-button
          type="primary"
          @click="fetchRecommendMusic"
          icon="Refresh"
          circle
          class="animate-spin" />
      </div>
    </div>

    <!-- 音乐播放器 -->
    <MusicPlayer ref="musicPlayer">
      <template #current-music="{ currentMusic, isPlaying }">
        <!-- 使用表达式直接更新状态 -->
        {{ updatePlayerState(currentMusic, isPlaying) }}
      </template>
    </MusicPlayer>
  </div>
</template>

<style scoped lang="scss">
.el-button.is-circle {
  @apply w-10 h-10 text-lg;
}

:deep(.el-pagination) {
  @apply flex justify-center;

  .el-pager li {
    @apply bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400;

    &.is-active {
      @apply bg-primary-500 text-white;
    }
  }

  .btn-prev,
  .btn-next {
    @apply bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400;
  }
}

:deep(.el-select) {
  .el-input__wrapper {
    @apply bg-white dark:bg-dark-card border-gray-300 dark:border-gray-600;
  }

  .el-input__inner {
    @apply text-gray-900 dark:text-gray-100;
  }
}

:deep(.el-select-dropdown) {
  @apply bg-white dark:bg-dark-card border-gray-200 dark:border-gray-700;

  .el-select-dropdown__item {
    @apply text-gray-700 dark:text-gray-300;

    &.selected {
      @apply text-primary-500 bg-primary-50 dark:bg-primary-900/20;
    }

    &:hover:not(.selected) {
      @apply bg-gray-100 dark:bg-gray-800;
    }
  }
}

.music-player-dialog {
  :deep(.el-dialog) {
    @apply bg-transparent border-none shadow-none;
  }

  :deep(.el-dialog__header) {
    @apply hidden;
  }

  :deep(.el-dialog__body) {
    @apply p-0;
  }
}

// 表格相关样式
table {
  @apply w-full table-fixed;

  th {
    @apply font-semibold;
  }

  td {
    @apply align-middle;
  }
}

// 设置列宽
th,
td {
  &:nth-child(1) {
    width: 30%;
  }
  &:nth-child(2) {
    width: 20%;
  }
  &:nth-child(3) {
    width: 25%;
  }
  &:nth-child(4) {
    width: 15%;
  }
  &:nth-child(5) {
    width: 10%;
  }
}

/* 添加加载动画样式 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 3s linear infinite;
}

// 骨架屏样式
:deep(.el-skeleton) {
  --el-skeleton-color: theme('colors.gray.200');
  --el-skeleton-to-color: theme('colors.gray.300');

  .dark & {
    --el-skeleton-color: theme('colors.gray.900');
    --el-skeleton-to-color: theme('colors.gray.900');
  }
}

// 添加脉冲动画
@keyframes pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

// 赞赏码弹窗样式
.donation-dialog {
  :deep(.el-dialog) {
    @apply bg-white dark:bg-dark-card rounded-lg max-w-[90vw] sm:max-w-[400px];

    .el-dialog__header {
      @apply pb-2;

      .el-dialog__title {
        @apply text-base sm:text-xl font-medium text-gray-900 dark:text-white;
      }
    }

    .el-dialog__body {
      @apply px-4 sm:px-6 py-3 sm:py-4;
    }

    .el-dialog__headerbtn {
      @apply top-3 right-3;

      .el-dialog__close {
        @apply text-base sm:text-lg;
      }
    }
  }
}

.donation-content {
  p {
    @apply text-xs sm:text-sm;
  }

  ul li {
    @apply text-xs sm:text-sm flex items-start gap-2;

    &::before {
      content: '•';
      @apply text-primary-500;
    }
  }
}

.donation-qr-wrapper {
  img {
    @apply transition-transform duration-300;

    &:hover {
      @apply transform scale-105;
    }
  }
}
</style>
