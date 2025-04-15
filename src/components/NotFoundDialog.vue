<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const backToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
      <!-- 404 图标 -->
      <div class="mb-6">
        <el-icon class="text-8xl text-primary-500">
          <WarningFilled />
        </el-icon>
      </div>

      <!-- 标题和描述 -->
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">页面不存在</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">抱歉，您访问的页面不存在或已被删除。</p>

      <!-- 按钮 -->
      <div class="flex justify-center space-x-4">
        <el-button type="primary" @click="backToHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-icon {
  width: auto;
  height: auto;
}
</style>
