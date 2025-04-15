<script setup lang="ts">
import { useToggleTheme } from '@/hooks/useToggleTheme'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// 初始化主题
useToggleTheme()

const isRouteReady = ref(false)
const router = useRouter()

onMounted(() => {
  // 确保路由已经准备好
  router.isReady().then(() => {
    isRouteReady.value = true
  })
})
</script>

<template>
  <template v-if="isRouteReady">
    <!-- 全局配置 element plus ElMessage 的偏移量、最大显示数量 -->
    <el-config-provider :message="{ offset: 65, max: 2, duration: 1500 }">
      <NavBar />
      <router-view />
    </el-config-provider>
  </template>
</template>

<style scoped lang="scss">
/* 可以添加一个淡入效果 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
