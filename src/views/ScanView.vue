<script setup lang="ts">
import { get_order_status } from '@/api/order'
import QrCodeScanner from '@/components/QrCodeScanner.vue'
import { ResponseStatus, type ScanStatus } from '@/types'
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderNo = ref('')
const qrCode = ref('')
const signature = ref('')
const scanStatus = ref<ScanStatus>('pending')
const countdown = ref(3)
const showCountdown = ref(false)

// 轮询定时器
let timer: number | null = null
// 倒计时定时器
let countdownTimer: number | null = null

// 检查订单状态
const checkOrderStatus = async () => {
  try {
    const result = await get_order_status({ order_no: orderNo.value })

    if (result.code === ResponseStatus.SUCCESS) {
      if (result.data.status === 'scanned') {
        // 清除轮询定时器
        if (timer) {
          clearInterval(timer)
          timer = null
        }

        // 更新扫描状态
        scanStatus.value = 'scanned'

        // 等待1秒后开始倒计时
        setTimeout(() => {
          showCountdown.value = true
          // 开始倒计时
          countdownTimer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
              // 清除倒计时定时器
              if (countdownTimer) {
                clearInterval(countdownTimer)
                countdownTimer = null
              }
              // 不再跳转到手机支付页面，而是通过编程方式修改路由
              router.push({
                name: 'payment',
                query: { order_no: orderNo.value, signature: signature.value },
              })
            }
          }, 1000)
        }, 1000)
      }
    }
  } catch (error) {
    console.error('检查订单状态失败:', error)
  }
}

onMounted(() => {
  // 获取订单号、二维码和签名
  const { order_no, qr_code, signature: sign } = route.query
  if (!order_no || !qr_code || !sign) {
    ElMessage.error('参数不完整')
    router.push({ name: 'home' })
    return
  }

  orderNo.value = order_no as string
  qrCode.value = qr_code as string
  signature.value = sign as string // 保存签名

  // 开始轮询检查订单状态
  timer = setInterval(checkOrderStatus, 2000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<template>
  <div class="h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
    <div class="max-w-md mx-auto px-4 sm:px-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <!-- 标题 -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ scanStatus === 'pending' ? '请使用手机扫描二维码' : '扫码成功' }}
          </h2>
          <!-- 倒计时提示 -->
          <transition name="fade">
            <p v-if="showCountdown" class="mt-2 text-sm text-primary-500">
              {{ countdown }}秒后跳转至支付界面...
            </p>
          </transition>
          <p class="mt-2 text-gray-500 dark:text-gray-400">订单号：{{ orderNo }}</p>
        </div>

        <!-- 二维码区域 -->
        <div v-if="qrCode" class="flex flex-col items-center mb-8">
          <QrCodeScanner :qr-code="qrCode" :status="scanStatus" />
        </div>

        <!-- 提示信息 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            这是一个模拟支付页面，用于测试支付流程
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
