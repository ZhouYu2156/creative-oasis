<script setup lang="ts">
import { delete_order, get_user_orders } from '@/api/order'
import { ResponseStatus, type Order } from '@/types'
import { ElMessageBox } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 订单状态选项
const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待扫码' },
  { value: 'scanned', label: '已扫码' },
  { value: 'paid', label: '已支付' },
  { value: 'cancelled', label: '已取消' },
  { value: 'failed', label: '支付失败' },
]

// 当前选中的状态
const currentStatus = ref('all')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 订单列表
const orders = ref<Order[]>([])
const isLoading = ref(false)

// 获取订单列表
const fetchOrders = async () => {
  try {
    isLoading.value = true
    const result = await get_user_orders({
      page: currentPage.value,
      page_size: pageSize.value,
      status: currentStatus.value === 'all' ? undefined : currentStatus.value,
    })
    if (result.code === ResponseStatus.SUCCESS) {
      orders.value = result.data.results
      total.value = result.data.total
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchOrders()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchOrders()
}

// 监听状态筛选变化
watch(currentStatus, () => {
  currentPage.value = 1 // 重置页码
  fetchOrders()
})

// 根据状态过滤订单
const filteredOrders = computed(() => {
  if (currentStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order) => order.status === currentStatus.value)
})

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'scanned':
      return 'info'
    case 'cancelled':
    case 'failed':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '待扫码'
    case 'scanned':
      return '已扫码'
    case 'paid':
      return '已支付'
    case 'cancelled':
      return '已取消'
    case 'failed':
      return '支付失败'
    default:
      return '未知'
  }
}

// 处理删除订单
const handleDelete = async (orderId: string) => {
  try {
    const order = orders.value.find((o) => o.order_no === orderId)
    if (!order) return

    const statusText = {
      pending: '待扫码的',
      scanned: '已扫码的',
      paid: '已支付的',
      cancelled: '已取消的',
      failed: '支付失败的',
    }[order.status]

    await ElMessageBox.confirm(`确定要删除该${statusText}订单记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 调用删除API
    const result = await delete_order(order.order_no)
    if (result.code === ResponseStatus.SUCCESS) {
      await fetchOrders() // 重新获取订单列表
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('删除订单失败:', error)
    }
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div>
    <!-- 标题和筛选区 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">订单管理</h2>

      <!-- 状态筛选 -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">状态：</span>
        <el-radio-group v-model="currentStatus" size="small">
          <el-radio-button
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="space-y-4">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>

      <!-- 订单列表项 -->
      <template v-else>
        <div
          v-for="order in orders"
          :key="order.order_no"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 group">
          <!-- 订单标题和状态 -->
          <div class="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div class="flex items-center flex-wrap gap-2">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ order.order_type === 'monthly' ? '月度会员' : '年度会员' }}
              </h3>
              <el-tag :type="getStatusType(order.status)" size="small">
                {{ getStatusText(order.status) }}
              </el-tag>
            </div>
            <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
              ¥{{ Number(order.amount).toFixed(2) }}
            </div>
          </div>

          <!-- 订单信息 -->
          <div class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>订单号：{{ order.order_no }}</p>
            <p>创建时间：{{ new Date(order.created_at).toLocaleString() }}</p>
            <p v-if="order.paid_time">支付时间：{{ new Date(order.paid_time).toLocaleString() }}</p>
            <p v-if="order.expire_time">
              过期时间：{{ new Date(order.expire_time).toLocaleString() }}
            </p>
          </div>

          <!-- 操作按钮组 -->
          <div class="flex flex-wrap items-center gap-3 mt-4">
            <!-- 删除按钮 -->
            <el-tooltip content="删除订单" placement="top" :show-after="200">
              <el-button
                type="danger"
                :icon="'Delete'"
                circle
                class="!order-1 sm:!order-none hover:scale-105 transition-transform opacity-0 group-hover:opacity-100"
                @click="handleDelete(order.order_no)" />
            </el-tooltip>
          </div>
        </div>

        <!-- 分页器 -->
        <div v-if="total > 0" class="flex justify-center mt-6">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handlePageChange" />
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">暂无订单记录</div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-button.is-circle {
  @apply w-8 h-8;
}

// 优化 tooltip 样式
:deep(.el-tooltip__trigger) {
  @apply outline-none;
}

// 优化按钮组在小屏幕下的显示
:deep(.el-button--small) {
  @apply text-xs px-3 py-1;
  @apply sm:min-w-[4.5rem];

  &.el-button--danger.is-plain {
    @apply border-red-200 dark:border-red-800 text-red-600 dark:text-red-400;

    &:hover {
      @apply bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700;
    }
  }
}

// 优化圆形按钮在小屏幕下的显示
:deep(.el-button--danger) {
  &.is-circle {
    @apply bg-white dark:bg-transparent text-red-500 dark:text-red-400 border-red-200 dark:border-red-800;
    @apply w-8 h-8;

    &:hover {
      @apply bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-300;
    }
  }
}

// 优化单选按钮组在小屏幕下的显示
:deep(.el-radio-group) {
  @apply flex flex-wrap gap-1;

  .el-radio-button__inner {
    @apply text-xs sm:text-sm px-2 sm:px-3 py-1;
  }

  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    @apply bg-primary-500 border-primary-500;

    &:hover {
      @apply bg-primary-600 border-primary-600;
    }
  }
}

// 添加分页器样式
:deep(.el-pagination) {
  @apply flex flex-wrap justify-center gap-2;

  .el-pagination__total {
    @apply text-gray-500 dark:text-gray-400;
  }

  .el-pagination__sizes {
    @apply text-gray-500 dark:text-gray-400;
  }

  .el-pager li {
    @apply bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700;

    &.is-active {
      @apply bg-primary-500 text-white border-primary-500;
    }
  }
}
</style>
