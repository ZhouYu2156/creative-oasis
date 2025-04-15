<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
      <!-- 403 图标 -->
      <div class="mb-6">
        <el-icon class="text-8xl text-warning-500">
          <Warning />
        </el-icon>
      </div>

      <!-- 标题和描述 -->
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">禁止访问</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        抱歉，您暂时没有权限访问该资源，请联系管理员
      </p>

      <!-- 按钮 -->
      <div class="flex justify-center">
        <el-button type="primary" size="large" @click="goToHome">
          <template #icon>
            <el-icon class="mr-1">
              <HomeFilled />
            </el-icon>
          </template>
          返回首页
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
