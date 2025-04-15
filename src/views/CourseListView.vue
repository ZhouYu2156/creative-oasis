<script setup lang="ts">
import {
  get_video_comments,
  get_video_detail,
  get_videos,
  post_video_comment,
  reply_video_comment,
  toggle_comment_like,
} from '@/api'
import { useUserStore } from '@/stores/modules/user'
import type { Comment, Video, VideoDetail } from '@/types'
import { ArrowLeft, ArrowRight, Lock, Star, StarFilled, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 侧边栏折叠状态，在小屏幕下默认折叠
const isCollapsed = ref(window.innerWidth < 768)
// 视频列表数据
const videoList = ref<Video[]>([])
// 当前播放的视频
const currentVideo = ref<VideoDetail | null>(null)
// 加载状态
const loading = ref(true)
// 会员购买弹窗
const showMembershipDialog = ref(false)

const videoPlayer = ref<HTMLVideoElement | null>(null)

// 新评论内容
const newComment = ref('')

// 回复相关的状态
const replyContent = ref('')
const activeReply = ref<{
  commentId: number
  replyTo?: {
    id: number
    name: string
  }
} | null>(null)

// 控制回复的展开/收起状态
const showAllReplies = ref<Record<number, boolean>>({})

// 添加 isLoading 状态
const isLoading = ref(false)

// 添加排序方式
const sortBy = ref<'hot' | 'new'>('hot')

// 计算排序后的评论
const sortedComments = computed(() => {
  if (sortBy.value === 'hot') {
    return [...comments.value].sort((a, b) => b.likes - a.likes)
  }
  return [...comments.value].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
})

// 评论列表数据
const comments = ref<Comment[]>([])

// 添加视频播放状态
const isPlaying = ref(false)

// 监听视频播放状态
const handleVideoStateChange = () => {
  if (videoPlayer.value) {
    isPlaying.value = !videoPlayer.value.paused
  }
}

// 获取视频列表
const fetchVideoList = async () => {
  try {
    loading.value = true
    const categoryId = Number(route.params.id)
    const result = await get_videos({ category: categoryId })
    console.log(result)
    videoList.value = result.data

    // 如果有视频，默认播放第一个
    if (videoList.value.length > 0 && !currentVideo.value) {
      await fetchVideoDetail(videoList.value[0].id)
    }
  } catch (error) {
    ElMessage.error('获取视频列表失败')
    console.log('error', error)
  } finally {
    loading.value = false
  }
}

// 获取视频详情
const fetchVideoDetail = async (videoId: number) => {
  try {
    const categoryId = Number(route.params.id)
    const res = await get_video_detail({ category: categoryId, id: videoId })
    currentVideo.value = res.data
  } catch (error) {
    console.error('获取视频详情失败:', error)
  }
}

// 切换视频
const handleVideoChange = async (video: Video) => {
  /**
   * 如果视频不是免费的，并且用户未登录或不是会员，则显示会员购买弹窗
   * 如果视频是免费的，则直接播放,，可以获取视频详情
   */
  if (!video.is_free && (!userStore.isLoggedIn || !userStore.userInfo?.is_member)) {
    showMembershipDialog.value = true
    return
  }
  await fetchVideoDetail(video.id)
}

// 格式化时长
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 检查视频是否需要显示锁定图标
const shouldShowLock = (video: Video) => {
  return !video.is_free && (!userStore.isLoggedIn || !userStore.userInfo?.is_member)
}

// 修改视频加载完成的处理函数
const handleVideoLoaded = () => {
  if (videoPlayer.value) {
    // 确保视频可以拖动进度条
    videoPlayer.value.currentTime = 0
    // 添加播放状态监听
    videoPlayer.value.addEventListener('play', handleVideoStateChange)
    videoPlayer.value.addEventListener('pause', handleVideoStateChange)
  }
}

// 获取评论列表
const fetchComments = async () => {
  if (!currentVideo.value?.id) return
  try {
    const res = await get_video_comments({ video_id: currentVideo.value.id })
    console.log('获取评论列表', res)
    if (res.code === 200) {
      comments.value = res.data
    }
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

// 发表评论
const submitComment = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再评论')
    return
  }

  if (!newComment.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }

  isLoading.value = true
  try {
    const res = await post_video_comment({
      video_id: currentVideo.value!.id,
      content: newComment.value.trim(),
    })

    if (res.code === 200) {
      ElMessage.success('评论成功')
      // 清空评论输入框
      newComment.value = ''
      // 重新获取评论列表
      await fetchComments()
    }
  } catch (error) {
    ElMessage.error('评论失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 切换回复的展开/收起状态
const toggleReplies = (commentId: number) => {
  showAllReplies.value[commentId] = !showAllReplies.value[commentId]
}

// 显示回复输入框
const showReplyInput = (comment: Comment, replyTo?: { id: number; name: string }) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再回复')
    return
  }

  // 检查是否在回复自己
  if (replyTo && replyTo.id === userStore.userInfo?.id) {
    ElMessage.warning('不能回复自己的评论')
    return
  }

  activeReply.value = {
    commentId: comment.id,
    replyTo,
  }
  replyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  activeReply.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = async (comment: Comment) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再回复')
    return
  }

  if (!replyContent.value.trim()) {
    ElMessage.warning('回复内容不能为空')
    return
  }

  // 检查是否在回复自己的主评论
  if (comment.user.id === userStore.userInfo?.id && !activeReply.value?.replyTo) {
    ElMessage.warning('不能回复自己的评论')
    return
  }

  try {
    await reply_video_comment({
      video_id: currentVideo.value!.id,
      comment_id: comment.id,
      content: replyContent.value.trim(),
      reply_to: activeReply.value?.replyTo,
    })

    await fetchComments() // 重新获取评论列表
    cancelReply()
    ElMessage.success('回复成功')
  } catch (error) {
    ElMessage.error('回复失败，请稍后重试')
  }
}

// 点赞/取消点赞
const handleLike = async (comment: Comment) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再点赞')
    return
  }

  try {
    const result = await toggle_comment_like({
      video_id: currentVideo.value!.id,
      comment_id: comment.id,
    })

    comment.is_liked = result.data.is_liked
    comment.likes = result.data.likes
  } catch (error) {
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 监听窗口大小变化
onMounted(() => {
  fetchVideoList()
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      isCollapsed.value = true
    }
  })
  if (currentVideo.value?.id) {
    fetchComments()
  }
})

// 监听视频变化，重新获取评论
watch(
  () => currentVideo.value?.id,
  (newId) => {
    if (newId) {
      fetchComments()
    }
  },
)

// 组件卸载时清理事件监听
onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.removeEventListener('play', handleVideoStateChange)
    videoPlayer.value.removeEventListener('pause', handleVideoStateChange)
  }
})
</script>

<template>
  <div class="min-h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900">
    <!-- 主容器 -->
    <div class="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
      <div class="flex gap-6 relative">
        <!-- 左侧目录 -->
        <div
          class="w-52 lg:w-60 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden fixed z-10"
          :style="{
            left: isCollapsed ? '-240px' : 'max(calc((100vw - 1400px) / 2 + 24px), 24px)',
            top: '65px',
            bottom: 0,
          }"
          :class="['transition-all duration-300']">
          <div class="h-full flex flex-col">
            <!-- 列表标题，减小内边距 -->
            <div class="p-3 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-base font-semibold text-gray-900 dark:text-white">课程目录</h2>
            </div>

            <!-- 视频列表，调整内边距和间距 -->
            <div class="flex-1 overflow-y-auto">
              <div
                v-for="video in videoList"
                :key="video.id"
                class="group p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                :class="{ 'bg-primary-50 dark:bg-primary-900/50': video.id === currentVideo?.id }"
                @click="handleVideoChange(video)">
                <div class="flex gap-2">
                  <!-- 视频封面，减小尺寸 -->
                  <div class="relative w-20 h-14 rounded overflow-hidden flex-shrink-0">
                    <img
                      :src="video.cover_url"
                      :alt="video.title"
                      class="w-full h-full object-cover" />
                    <!-- 锁定图标或播放按钮 -->
                    <div
                      v-if="shouldShowLock(video)"
                      class="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <el-icon class="text-white text-xl">
                        <Lock />
                      </el-icon>
                    </div>
                    <div
                      v-else
                      class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <el-tooltip
                        :content="video.title"
                        placement="top"
                        :show-after="200"
                        :hide-after="0"
                        effect="dark">
                        <el-button
                          type="primary"
                          circle
                          class="!w-8 !h-8 !text-lg transform hover:scale-110 transition-transform">
                          <el-icon>
                            <component
                              :is="
                                video.id === currentVideo?.id && isPlaying
                                  ? 'VideoPause'
                                  : 'VideoPlay'
                              " />
                          </el-icon>
                        </el-button>
                      </el-tooltip>
                    </div>
                  </div>

                  <!-- 视频信息，调整字体大小和间距 -->
                  <div class="flex-1 min-w-0">
                    <h3
                      class="text-xs font-medium text-gray-900 dark:text-white line-clamp-2"
                      :class="{
                        'text-primary-600 dark:text-primary-400': video.id === currentVideo?.id,
                      }">
                      {{ video.title }}
                    </h3>
                    <div
                      class="flex items-center text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      <span>{{ formatDuration(video.duration) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div
          class="flex-1 flex flex-col gap-6 transition-all duration-300"
          :class="[isCollapsed ? 'ml-0' : 'ml-[224px] lg:ml-[256px]']">
          <!-- 视频播放器卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <!-- 视频播放器 -->
            <div class="relative bg-black">
              <div class="aspect-video">
                <video
                  v-if="currentVideo"
                  ref="videoPlayer"
                  :src="currentVideo.video_url"
                  class="w-full h-full hover:cursor-pointer"
                  controls
                  autoplay
                  preload="metadata"
                  @loadedmetadata="handleVideoLoaded"
                  @play="handleVideoStateChange"
                  @pause="handleVideoStateChange" />
                <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <el-icon class="text-4xl text-gray-600">
                    <VideoPlay />
                  </el-icon>
                </div>
              </div>
            </div>

            <!-- 视频信息 -->
            <div class="p-6">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {{ currentVideo?.title }}
              </h1>
              <div class="flex flex-wrap gap-2 mb-4">
                <el-tag
                  v-for="tech in currentVideo?.tech_stack"
                  :key="tech.id"
                  size="small"
                  class="bg-primary-50 text-primary-600 border-primary-200">
                  {{ tech.name }}
                </el-tag>
              </div>
              <p class="text-gray-600 dark:text-gray-400">
                {{ currentVideo?.description }}
              </p>
            </div>
          </div>

          <!-- 评论区卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6">评论区</h2>

            <!-- 评论区 -->
            <div class="mt-8">
              <!-- 评论区标题 -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-bold">评论</h3>
                  <span class="text-gray-500 text-sm">{{ comments.length }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <button
                    class="text-sm hover:text-primary-500 transition-colors"
                    :class="[sortBy === 'hot' ? 'text-primary-500' : 'text-gray-500']"
                    @click="sortBy = 'hot'">
                    最热
                  </button>
                  <button
                    class="text-sm hover:text-primary-500 transition-colors"
                    :class="[sortBy === 'new' ? 'text-primary-500' : 'text-gray-500']"
                    @click="sortBy = 'new'">
                    最新
                  </button>
                </div>
              </div>

              <!-- 评论输入框 -->
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
                <div class="flex gap-3">
                  <el-avatar :size="36" :src="userStore.userInfo?.avatar" class="flex-shrink-0">
                    {{ userStore.userInfo?.nickname?.charAt(0) }}
                  </el-avatar>
                  <div class="flex-1">
                    <el-input
                      v-model="newComment"
                      type="textarea"
                      :rows="5"
                      :placeholder="userStore.isLoggedIn ? '发一条友善的评论' : '登录后发表评论'"
                      :disabled="!userStore.isLoggedIn"
                      class="comment-input" />
                    <div class="flex justify-between items-center mt-2">
                      <div class="text-xs text-gray-400">
                        {{
                          userStore.isLoggedIn ? '善语结善缘，恶言伤人心' : '请先登录后再发表评论'
                        }}
                      </div>
                      <el-button
                        type="primary"
                        :disabled="!userStore.isLoggedIn || !newComment.trim()"
                        :loading="isLoading"
                        class="!h-9"
                        @click="submitComment">
                        发布
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 评论列表 -->
              <div class="space-y-6">
                <div v-for="comment in sortedComments" :key="comment.id" class="group">
                  <!-- 主评论 -->
                  <div class="flex gap-3">
                    <el-avatar :size="36" :src="comment.user.avatar" class="flex-shrink-0">
                      {{ comment.user.name.charAt(0) }}
                    </el-avatar>
                    <div class="flex-1">
                      <!-- 用户信息 -->
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-primary-500">{{ comment.user.name }}</span>
                        <span class="text-xs text-gray-400">{{ comment.created_at }}</span>
                      </div>

                      <!-- 评论内容 -->
                      <p class="mt-2 text-gray-800 dark:text-gray-200 break-all">
                        {{ comment.content }}
                      </p>

                      <!-- 操作栏 -->
                      <div class="mt-2 flex items-center gap-4 text-sm">
                        <button
                          class="flex items-center gap-1 transition-colors"
                          :class="[
                            comment.is_liked
                              ? 'text-primary-500'
                              : 'text-gray-400 hover:text-primary-500',
                          ]"
                          @click="handleLike(comment)">
                          <el-icon>
                            <component :is="comment.is_liked ? StarFilled : Star" />
                          </el-icon>
                          <span>{{ comment.likes || '点赞' }}</span>
                        </button>
                        <button
                          v-if="comment.user.id !== userStore.userInfo?.id"
                          class="text-gray-400 hover:text-primary-500 transition-colors"
                          @click="showReplyInput(comment)">
                          回复
                        </button>
                      </div>

                      <!-- 回复列表 -->
                      <div
                        v-if="comment.replies?.length"
                        class="mt-3 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                        <div
                          v-for="(reply, index) in showAllReplies[comment.id]
                            ? comment.replies
                            : comment.replies.slice(0, 2)"
                          :key="reply.id"
                          class="mb-3 last:mb-0">
                          <div class="flex gap-3">
                            <el-avatar :size="32" :src="reply.user.avatar" class="flex-shrink-0">
                              {{ reply.user.name.charAt(0) }}
                            </el-avatar>
                            <div class="flex-1">
                              <!-- 回复用户信息 -->
                              <div class="flex items-center gap-2">
                                <span class="font-medium text-primary-500">{{
                                  reply.user.name
                                }}</span>
                                <template v-if="reply.reply_to">
                                  <el-icon class="text-gray-400"><ArrowRight /></el-icon>
                                  <span class="font-medium text-primary-500">{{
                                    reply.reply_to.name
                                  }}</span>
                                </template>
                                <span class="text-xs text-gray-400">{{ reply.created_at }}</span>
                              </div>

                              <!-- 回复内容 -->
                              <p class="mt-1 text-gray-800 dark:text-gray-200 break-all">
                                {{ reply.content }}
                              </p>

                              <!-- 回复操作栏 -->
                              <div class="mt-2 flex items-center gap-4 text-sm">
                                <button
                                  class="flex items-center gap-1 transition-colors"
                                  :class="[
                                    reply.is_liked
                                      ? 'text-primary-500'
                                      : 'text-gray-400 hover:text-primary-500',
                                  ]"
                                  @click="handleLike(reply)">
                                  <el-icon>
                                    <component :is="reply.is_liked ? StarFilled : Star" />
                                  </el-icon>
                                  <span>{{ reply.likes || '点赞' }}</span>
                                </button>
                                <button
                                  v-if="reply.user.id !== userStore.userInfo?.id"
                                  class="text-gray-400 hover:text-primary-500 transition-colors"
                                  @click="showReplyInput(comment, reply.user)">
                                  回复
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- 展开/收起按钮 -->
                        <div v-if="comment.replies.length > 2" class="mt-2 text-sm">
                          <button
                            class="text-primary-500 hover:text-primary-600 transition-colors"
                            @click="toggleReplies(comment.id)">
                            {{
                              showAllReplies[comment.id]
                                ? '收起回复'
                                : `展开 ${comment.replies.length - 2} 条回复`
                            }}
                          </button>
                        </div>
                      </div>

                      <!-- 回复输入框 -->
                      <div v-if="activeReply?.commentId === comment.id" class="mt-3">
                        <div class="flex gap-3">
                          <el-avatar
                            :size="32"
                            :src="userStore.userInfo?.avatar"
                            class="flex-shrink-0">
                            {{ userStore.userInfo?.nickname?.charAt(0) }}
                          </el-avatar>
                          <div class="flex-1">
                            <el-input
                              v-model="replyContent"
                              type="textarea"
                              :rows="2"
                              :placeholder="
                                activeReply.replyTo
                                  ? `回复 @${activeReply.replyTo.name}`
                                  : '善语结善缘，恶言伤人心'
                              "
                              class="reply-input" />
                            <div class="flex justify-end gap-2 mt-2">
                              <el-button @click="cancelReply">取消</el-button>
                              <el-button
                                type="primary"
                                :disabled="!replyContent.trim()"
                                @click="submitReply(comment)">
                                回复
                              </el-button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 折叠按钮 -->
    <button
      class="fixed left-4 top-20 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
      @click="isCollapsed = !isCollapsed">
      <el-icon class="text-xl">
        <component :is="isCollapsed ? ArrowRight : ArrowLeft" />
      </el-icon>
    </button>
  </div>

  <!-- 会员购买弹窗 -->
  <MembershipDialog v-model:visible="showMembershipDialog" @close="showMembershipDialog = false" />
</template>

<style scoped lang="scss">
.el-icon {
  @apply w-auto h-auto;
}

:deep(.el-tag--small) {
  @apply text-xs px-2 py-0.5;
}

// 添加指示器的过渡效果
.group:hover .w-1 {
  @apply scale-y-100 opacity-100;
}

// 添加 Tooltip 的暗色模式支持
:deep(.el-popper.is-dark) {
  @apply bg-gray-800 text-white;
}

// 响应式容器宽度
.container {
  @media (min-width: 640px) {
    max-width: 640px;
  }

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 1024px) {
    max-width: 1024px;
  }

  @media (min-width: 1280px) {
    max-width: 1280px;
  }
}

// 视频播放器响应式高度
.pb-\[56\.25\%\] {
  padding-bottom: 56.25%;

  @media (max-width: 1024px) {
    padding-bottom: 40%; // 在中等屏幕下降低视频高度
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    padding-bottom: 42%; // 在大屏幕下适当调整
  }

  @media (min-width: 1281px) {
    padding-bottom: 45%; // 在超大屏幕下保持合适比例
  }
}

// 版心容器样式
.course-container {
  max-width: 1600px;

  @media (max-width: 1600px) {
    max-width: 100%;
  }
}

// 按钮样式
.el-button {
  @apply bg-white dark:bg-gray-800;

  // 普通按钮悬浮效果
  &:hover {
    @apply bg-gray-50 dark:bg-gray-700;
  }

  // 主要按钮样式
  &.el-button--primary {
    @apply bg-primary-500 text-white border-primary-500;

    &:hover {
      @apply bg-primary-600 border-primary-600 text-white;
    }

    &:focus {
      @apply bg-primary-500 border-primary-500;
    }

    // 暗色模式下的主要按钮
    .dark & {
      @apply bg-primary-600 border-primary-600;

      &:hover {
        @apply bg-primary-700 border-primary-700;
      }

      &:focus {
        @apply bg-primary-600 border-primary-600;
      }
    }
  }
}

// 过渡效果
.opacity-0,
.opacity-100 {
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
}

// 添加锁图标动画
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

// 添加列表内容的过渡效果
.opacity-0 {
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
}

.opacity-100 {
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
}

.comment-input {
  :deep(.el-textarea__inner) {
    @apply bg-white dark:bg-gray-700 border-0 shadow-none rounded-lg resize-none font-ZKKuaiLeTi;

    &:focus {
      @apply ring-2 ring-primary-500 ring-opacity-50;
    }
  }
}

.reply-input {
  :deep(.el-textarea__inner) {
    @apply bg-gray-50 dark:bg-gray-700 border-0 shadow-none rounded-lg text-sm resize-none;

    &:focus {
      @apply ring-2 ring-primary-500 ring-opacity-50;
    }
  }
}

/* 优化按钮样式 */
:deep(.el-button.is-circle) {
  @apply border-none shadow-md;

  &:hover {
    @apply shadow-lg;
  }

  .el-icon {
    @apply text-base;
  }
}

/* 优化 tooltip 样式 */
:deep(.el-tooltip__trigger) {
  @apply outline-none;
}

/* 添加滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') theme('colors.gray.100');
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

/* 暗色模式滚动条 */
.dark .overflow-y-auto {
  scrollbar-color: theme('colors.gray.600') theme('colors.gray.800');
}
</style>
