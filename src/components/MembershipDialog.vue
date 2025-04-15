<script setup lang="ts">
import { create_order } from '@/api/order'
import { useUserStore } from '@/stores'
import { ResponseStatus, type OrderType } from '@/types'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()

interface Props {
  visible: boolean
  onClose?: () => void
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible'])

// 使用计算属性处理 dialog 的显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// 选中的会员套餐
const selectedPlan = ref<OrderType>('yearly')

interface MembershipPlan {
  id: OrderType
  name: string
  price: number
  originalPrice: number
  period: '月' | '年'
  features: string[]
  effective?: boolean
  popular?: boolean
}

// 会员套餐数据
const membershipPlans: MembershipPlan[] = [
  {
    id: 'monthly',
    name: '月度会员',
    price: 29,
    originalPrice: 49,
    period: '月',
    features: ['所有付费课程无限观看', '配套资料领取', '专属会员社群'],
    // 适合短期提升
    effective: true,
  },
  {
    id: 'yearly',
    name: '年度会员',
    price: 179,
    originalPrice: 259,
    period: '年',
    features: [
      '所有付费课程无限观看',
      '配套资料领取',
      '专属会员社群',
      '技术问答服务',
      '年度大会员专属礼包',
    ],
    popular: true,
  },
]

const router = useRouter()
const isLoading = ref(false)

// 处理关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  props.onClose?.()
}

// 处理立即开通
const handleSubscribe = async () => {
  // 如果用户未登录，则跳转到登录页
  if (!userStore.isLoggedIn) {
    router.push({ name: 'login' })
    return
  }

  try {
    isLoading.value = true
    const result = await create_order({
      order_type: selectedPlan.value,
    })

    if (result.code === ResponseStatus.CREATED) {
      // 关闭会员购买弹窗
      dialogVisible.value = false

      // 跳转到扫码页面，带上订单号、二维码和签名
      router.push({
        name: 'payment-scan',
        query: {
          order_no: result.data.order_no,
          qr_code: result.data.qr_code,
          signature: result.data.signature, // 后端返回的签名
          amount: result.data.amount,
        },
      })
    }
  } catch (error) {
    ElMessage.error('创建订单失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 根据屏幕宽度计算弹窗宽度
const dialogWidth = computed(() => {
  const width = window.innerWidth
  if (width < 640) {
    return '95%' // 超小屏幕
  } else if (width < 768) {
    return '90%' // 小屏幕
  } else if (width < 1024) {
    return '640px' // 中等屏幕固定宽度
  } else {
    return '800px' // 大屏幕
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="true"
    custom-class="membership-dialog"
    :width="dialogWidth"
    style="--el-dialog-margin-top: 80px"
    @close="handleClose">
    <div class="text-center">
      <!-- 标题 -->
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
        开通会员，畅享所有课程
      </h2>
      <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8">
        为知识付费，解锁全部高质量课程
      </p>

      <!-- 会员套餐选择 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div
          v-for="plan in membershipPlans"
          :key="plan.id"
          class="relative p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl border-2 transition-all cursor-pointer xl:w-full"
          :class="[
            selectedPlan === plan.id
              ? 'border-primary-500 shadow-lg scale-[1.02]'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-200',
          ]"
          @click="selectedPlan = plan.id">
          <!-- 热门标签 -->
          <div
            v-if="plan.popular"
            class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs rounded-full">
            热门
          </div>

          <div
            v-if="plan.effective"
            class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs rounded-full">
            限时特惠
          </div>

          <!-- 套餐名称和价格 -->
          <div class="text-center mb-4">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ plan.name }}
            </h3>
            <div class="flex items-center justify-center gap-2">
              <span class="text-2xl sm:text-3xl font-bold text-primary-500">¥{{ plan.price }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">/{{ plan.period }}</span>
            </div>
            <div class="text-xs text-gray-400 line-through mt-1">
              原价 ¥{{ plan.originalPrice }}
            </div>
          </div>

          <!-- 套餐特权列表 -->
          <ul class="space-y-2 text-sm sm:text-base mb-4">
            <li
              v-for="(feature, index) in plan.features"
              :key="index"
              class="flex items-center text-gray-600 dark:text-gray-300">
              <el-icon class="mr-2 text-primary-500">
                <Check />
              </el-icon>
              {{ feature }}
            </li>
          </ul>

          <!-- 选中指示器 -->
          <div
            class="absolute bottom-4 left-4 right-4 h-2 bg-primary-100 dark:bg-primary-900 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 transition-all duration-300"
              :class="[selectedPlan === plan.id ? 'w-full' : 'w-0']" />
          </div>
        </div>
      </div>

      <!-- 开通按钮 -->
      <el-button
        type="primary"
        size="large"
        :loading="isLoading"
        class="w-full sm:w-64 h-12 text-base font-medium"
        @click="handleSubscribe">
        {{ isLoading ? '订单创建中...' : '立即开通' }}
      </el-button>

      <!-- 服务协议 -->
      <p class="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        开通即表示同意
        <a href="#" class="text-primary-500 hover:text-primary-600">《会员服务协议》</a>
      </p>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
// 弹窗样式优化
:deep(.membership-dialog) {
  @apply bg-gray-50 dark:bg-gray-900 rounded-xl;

  .el-dialog__body {
    @apply p-4 sm:p-6 md:p-8;
  }

  // 小屏幕下减少内边距，让套餐卡片有更多空间
  @media (max-width: 640px) {
    margin: 1rem auto;

    .el-dialog__body {
      @apply p-3;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    margin: 2rem auto;
  }
}

// 按钮动效
.el-button {
  @apply relative overflow-hidden;

  &:before {
    content: '';
    @apply absolute w-32 h-8 -bottom-4 -left-24 bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45;
    animation: button-shine 3s ease-in-out infinite;
  }
}

@keyframes button-shine {
  0% {
    transform: translateX(-100%) rotate(-45deg);
  }
  50%,
  100% {
    transform: translateX(400%) rotate(-45deg);
  }
}
</style>
