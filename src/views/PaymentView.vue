<script setup lang="ts">
import { update_order_status } from '@/api/order'
import { useUserStore } from '@/stores'
import { ResponseStatus } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const order = ref<Order>({
  order_no: '',
  amount: 0,
  status: 'pending',
  signature: '',
  order_type: 'monthly',
  qr_code: '',
  created_at: '',
  updated_at: '',
  paid_time: null,
  expire_time: '',
})

// 判断是否为移动设备
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent,
)

// 判断是否来自扫码
const isFromQRCode = route.query.from === 'qrcode'

// 确认支付
const handleConfirmPayment = async () => {
  try {
    await ElMessageBox.confirm('确认已完成支付？', '支付确认', {
      confirmButtonText: '已完成支付',
      cancelButtonText: '取消',
      type: 'info',
    })

    const result = await update_order_status({
      order_no: route.query.order_no as string,
      status: 'paid',
      signature: route.query.signature as string,
    })

    if (result.code === ResponseStatus.SUCCESS) {
      // 更新个人信息
      userStore.fetchUserInfo()
      // 支付成功后跳转到支付结果页
      router.push({
        name: 'payment-result',
        query: { out_trade_no: order.value.order_no },
      })
    }
  } catch (error) {
    console.error('确认支付失败:', error)
  }
}

onMounted(async () => {
  // 重新获取订单状态
  const orderResult = await get_order_status({ order_no: route.query.order_no as string })
  if (orderResult.code === ResponseStatus.SUCCESS) {
    order.value = orderResult.data
  }

  // 如果是移动设备访问且不是来自扫码，则提示使用PC端访问
  if (isMobile && !isFromQRCode) {
    ElMessage.warning('请在PC端访问支付页面')
    router.push({ name: 'home' })
    return
  }

  // 如果是来自扫码的访问，需要更新订单状态
  if (isFromQRCode) {
    // 1. 检查用户是否登录
    if (!userStore.isLoggedIn) {
      const redirectUrl = encodeURIComponent(window.location.href)
      router.push({
        name: 'login',
        query: { redirect: redirectUrl },
      })
      return
    }

    // 2. 从URL中获取订单号和签名
    const { order_no, signature } = route.query
    if (!order_no || !signature) {
      ElMessage.error('支付参数不完整')
      router.push({ name: 'home' })
      return
    }

    try {
      // 3. 发送请求更新订单状态为已扫描
      const result = await update_order_status({
        order_no: order_no as string,
        status: 'scanned',
        signature: signature as string,
      })

      if (result.code === ResponseStatus.SUCCESS) {
        // ElMessage.success('扫码成功')
      } else {
        ElMessage.error('二维码已失效')
        router.push({ name: 'home' })
      }
    } catch (error) {
      console.error('更新订单状态失败:', error)
      ElMessage.error('操作失败，请稍后重试')
      router.push({ name: 'home' })
    }
  }
})
</script>

<template>
  <div class="h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-md mx-auto px-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <!-- 标题 -->
        <div class="text-center mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">扫码成功</h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">请在PC端确认支付</p>
        </div>

        <!-- 微信赞赏码 -->
        <div class="flex flex-col items-center mb-6">
          <div class="bg-white p-4 rounded-lg shadow-md w-[280px]">
            <div class="relative aspect-[0.74] w-full bg-gray-50 rounded-lg overflow-hidden">
              <img
                src="../assets/wechat-pay.jpg"
                alt="微信付款码"
                class="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
          <div class="mt-4 text-center">
            <p class="text-lg font-medium text-gray-900 dark:text-white">
              ¥{{ order.amount || '9999.00' }}
            </p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              请使用微信扫描上方二维码完成支付
            </p>
          </div>
        </div>

        <!-- 确认支付按钮 -->
        <div class="flex justify-center mt-6">
          <el-button
            type="primary"
            size="large"
            class="w-full sm:w-auto min-w-[200px]"
            @click="handleConfirmPayment">
            确认已完成支付
          </el-button>
        </div>

        <!-- 温馨提示 -->
        <div class="mt-6">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">温馨提示：</h3>
          <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
            <li>1. 支付完成后，系统将在30分钟内完成会员开通</li>
            <li>2. 会员服务属于虚拟商品，支付成功后不支持退款</li>
            <li>3. 微信支付时请确保备注邮箱与登录账号一致，以便及时到账</li>
          </ul>
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
