<script setup lang="ts">
import { get_categories } from '@/api/course'
import MembershipDialog from '@/components/MembershipDialog.vue'
import { useUserStore } from '@/stores/modules/user'
import type { CourseType, VideoCategory } from '@/types'
import { Picture, VideoPlay } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const categories = ref<CourseType[]>([])
const userStore = useUserStore()

// 会员弹窗控制
const showMembershipDialog = ref(false)

// 检查是否需要显示会员广告
const checkMembershipAd = () => {
  // 未登录或非会员时显示广告
  if (!userStore.isLoggedIn || !userStore.userInfo?.is_member) {
    showMembershipDialog.value = true
  }
}

onMounted(async () => {
  const result = await get_categories()
  categories.value = result.data
  // 进入页面时检查是否需要显示会员广告
  checkMembershipAd()
})

// 图片加载状态
const imageLoaded = ref<Record<string | number, boolean>>({})

// 处理图片加载完成
const handleImageLoad = (id: string | number) => {
  imageLoaded.value[id] = true
}

// 处理课程点击
const router = useRouter()
const handleBrowseCourseList = (course: VideoCategory) => {
  router.push(`/course/${course.id}`)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 如果该板块没有课程分类，则不展示 -->
    <section
      class="mb-12"
      v-for="block in categories"
      :key="block.id"
      v-show="block.categories.length > 0">
      <div class="mb-6 text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          {{ block.name }}
        </h2>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">{{ block.description }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in block.categories"
          :key="course.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <div class="relative cursor-pointer" @click="handleBrowseCourseList(course)">
            <!-- 骨架屏 -->
            <div
              v-show="!imageLoaded[course.id]"
              class="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse">
              <div class="h-full w-full flex items-center justify-center">
                <el-icon class="text-6xl sm:text-7xl text-gray-400 dark:text-gray-500">
                  <Picture />
                </el-icon>
              </div>
            </div>

            <!-- 图片 -->
            <img
              :src="course.cover"
              :alt="course.title"
              class="w-full h-48 object-cover"
              :class="{ 'opacity-0': !imageLoaded[course.id] }"
              @load="handleImageLoad(course.id)" />

            <!-- 播放按钮遮罩 -->
            <div
              v-show="imageLoaded[course.id]"
              class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:backdrop-blur-sm">
              <el-icon
                class="text-6xl sm:text-7xl text-white transform scale-90 group-hover:scale-100 transition-transform">
                <VideoPlay />
              </el-icon>
            </div>

            <div
              class="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded"
              v-if="course.difficulty">
              {{ course.difficulty_text }}
            </div>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ course.title }}
              </h3>
              <span
                class="text-sm font-medium"
                :class="[course.is_member_only ? 'text-yellow-500' : 'text-green-500']">
                {{ course.is_member_only ? '会员' : '免费' }}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {{ course.description }}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <el-tag
                v-for="tech in course.tech_stack"
                :key="tech.id"
                size="small"
                class="bg-primary-50 text-primary-600 border-primary-200">
                {{ tech.name }}
              </el-tag>
            </div>
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                <el-icon><VideoCamera /></el-icon>
                {{ course.lesson_count }} 节课
              </span>
              <span>
                <el-icon><User /></el-icon>
                {{ course.student_count }} 人学过
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- 会员购买弹窗 -->
  <MembershipDialog v-model:visible="showMembershipDialog" @close="showMembershipDialog = false" />
</template>

<style scoped lang="scss">
.el-icon {
  @apply w-auto h-auto;

  &.text-6xl {
    font-size: 2rem;

    @media (min-width: 640px) {
      font-size: 2.5rem;
    }
  }
}

.el-icon.text-6xl :deep(svg) {
  width: 2rem;
  height: 2rem;

  @media (min-width: 640px) {
    width: 2.5rem;
    height: 2.5rem;
  }
}

:deep(.el-tag--small) {
  @apply text-xs px-2 py-0.5;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.15;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 添加价格标签的悬停效果 */
.group:hover .absolute.top-2.right-2 {
  @apply scale-110;
  transition: transform 0.2s ease;
}
</style>
