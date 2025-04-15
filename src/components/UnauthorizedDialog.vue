<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到登录页
const goToLogin = () => {
  router.push({
    name: 'login',
    query: { redirect: router.currentRoute.value.fullPath },
  })
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
      <!-- 401 图标 -->
      <div class="mb-6">
        <el-icon class="text-8xl text-primary-500">
          <Lock />
        </el-icon>
      </div>

      <!-- 标题和描述 -->
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">未登录</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        您当前未登录或登录已过期，请先登录后再访问该页面
      </p>

      <!-- 按钮 -->
      <div class="flex justify-center">
        <el-button type="primary" size="large" @click="goToLogin">
          <template #icon>
            <el-icon class="mr-1">
              <User />
            </el-icon>
          </template>
          去登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-icon {
  width: auto;
  height: auto;
}

:deep(.el-button) {
  @apply h-12 text-base font-medium;
}
</style>
