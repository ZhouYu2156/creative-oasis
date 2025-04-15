<script setup lang="ts">
import ForbiddenDialog from '@/components/ForbiddenDialog.vue'
import NotFoundDialog from '@/components/NotFoundDialog.vue'
import ServerErrorDialog from '@/components/ServerErrorDialog.vue'
import UnauthorizedDialog from '@/components/UnauthorizedDialog.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 根据路由 meta.status 计算要显示的组件
const currentDialog = computed(() => {
  const status = route.meta.status as number
  switch (status) {
    case 401:
      return UnauthorizedDialog
    case 403:
      return ForbiddenDialog
    case 404:
      return NotFoundDialog
    case 500:
      return ServerErrorDialog
    default:
      return NotFoundDialog // 默认显示 404
  }
})
</script>

<template>
  <component :is="currentDialog" />
</template>
