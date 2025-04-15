<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import confetti from 'canvas-confetti'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isLoading = ref(true)
const paymentStatus = ref<'success' | 'failed'>('success')

// 播放彩带效果
const playCelebration = () => {
  const duration = 3000
  const end = Date.now() + duration

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']

  ;(function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    })
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

onMounted(async () => {
  const orderNo = route.query.out_trade_no as string

  if (!orderNo) {
    ElMessage.error('订单号不存在')
    router.push({ name: 'home' })
    return
  }

  try {
    // 获取订单状态
    const res = await get_order_status({ order_no: orderNo })

    if (res.code === 200) {
      // 如果订单已支付，显示成功页面
      if (res.data.status === 'paid') {
        paymentStatus.value = 'success'
        // 获取最新的用户信息（包含会员状态）
        await userStore.fetchUserInfo()
        playCelebration()
      } else {
        paymentStatus.value = 'failed'
      }
    }
  } catch (error) {
    ElMessage.error('获取支付结果失败')
    paymentStatus.value = 'failed'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block">
            <svg
              class="animate-spin h-8 w-8 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4" />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">正在确认支付结果...</p>
        </div>

        <!-- 支付成功 -->
        <div v-else-if="paymentStatus === 'success'" class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
            <svg
              class="h-10 w-10 text-green-500 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            恭喜您成功开通会员！
          </h2>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            现在您可以观看所有付费课程，开启学习之旅吧！
          </p>
          <div class="mt-8">
            <el-button
              type="primary"
              class="w-full !h-11"
              @click="$router.push({ name: 'course' })">
              开始学习
            </el-button>
          </div>
        </div>

        <!-- 支付失败 -->
        <div v-else class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
            <svg
              class="h-10 w-10 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">支付失败</h2>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            抱歉，支付过程中出现了问题，请稍后重试
          </p>
          <div class="mt-8 space-y-4">
            <el-button type="primary" class="w-full !h-11" @click="$router.push({ name: 'home' })">
              返回首页
            </el-button>
            <el-button class="w-full !h-11" style="margin-left: 0" @click="router.go(-1)"
              >重新支付</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-button {
  @apply text-base;
}
</style>
