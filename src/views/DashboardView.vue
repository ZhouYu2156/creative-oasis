<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = ref('profile')

// 菜单项配置
const menuItems = [
  {
    key: 'profile',
    label: '个人信息',
    icon: 'User',
  },
  {
    key: 'orders',
    label: '我的订单',
    icon: 'List',
  },
]

// 处理菜单点击
const handleMenuClick = (key: string) => {
  activeMenu.value = key
}
</script>

<template>
  <div class="remain-screen bg-gray-100 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">个人中心</h1>
      </div>

      <!-- 主要内容区 -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 侧边栏 -->
        <div class="w-full lg:w-64 lg:shrink-0">
          <!-- 大屏幕显示垂直菜单 -->
          <div class="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow">
            <ul class="py-2">
              <li
                v-for="item in menuItems"
                :key="item.key"
                class="px-4 py-2 cursor-pointer transition-colors"
                :class="{
                  'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400':
                    activeMenu === item.key,
                  'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300':
                    activeMenu !== item.key,
                }"
                @click="handleMenuClick(item.key)">
                <div class="flex items-center space-x-3">
                  <el-icon class="text-lg">
                    <component :is="item.icon" />
                  </el-icon>
                  <span class="font-medium">{{ item.label }}</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- 小屏幕显示水平菜单 -->
          <div class="lg:hidden">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-2">
              <div class="flex justify-around">
                <button
                  v-for="item in menuItems"
                  :key="item.key"
                  class="flex-1 flex flex-col items-center py-2 px-4 rounded-md transition-colors"
                  :class="{
                    'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400':
                      activeMenu === item.key,
                    'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300':
                      activeMenu !== item.key,
                  }"
                  @click="handleMenuClick(item.key)">
                  <el-icon class="text-xl mb-1">
                    <component :is="item.icon" />
                  </el-icon>
                  <span class="text-sm font-medium">{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 内容区 -->
        <div class="flex-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <!-- 个人中心 -->
            <div v-if="activeMenu === 'profile'">
              <UserProfile />
            </div>

            <!-- 订单管理 -->
            <div v-else-if="activeMenu === 'orders'">
              <OrderList />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.remain-screen {
  min-height: calc(100vh - 65px);
}

.el-icon {
  @apply w-5 h-5;
}
</style>
