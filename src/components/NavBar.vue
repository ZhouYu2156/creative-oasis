<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const isMenuOpen = ref(false)

interface NavItem {
  path: string
  name: string
  icon: string
  isExternal?: boolean
}

// 导航菜单配置
const navItems = [
  {
    path: '/',
    name: '首页',
    icon: 'House',
  },
  {
    path: '/profile',
    name: '作者履历',
    icon: 'Document',
  },
  {
    path: '/music',
    name: '音乐空间',
    icon: 'Headset',
  },
  {
    path: '/course',
    name: '视频教程',
    icon: 'VideoCamera',
  },
  {
    path: 'https://www.zhouyu2156.cn/',
    name: '知识文档',
    icon: 'Reading',
    isExternal: true,
  },
] satisfies NavItem[]

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false
}

// 处理退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

// 判断当前路由是否激活
const isActive = (path: string) => router.currentRoute.value.path === path
</script>

<template>
  <nav
    class="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
    <!-- 桌面端导航 -->
    <div class="hidden lg:block">
      <div class="max-w-7xl mx-auto h-16 px-8 flex items-center">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-3">
            <img
              src="@/assets/logo.png"
              alt="Logo"
              class="h-9 w-9 animate-bounce-gentle rounded-full" />
            <span class="logo-text text-xl font-bold tracking-wide">
              <span class="text-gradient">Creative</span>
              <span class="text-gradient-alt">Oasis</span>
            </span>
          </router-link>
        </div>

        <!-- 导航菜单 -->
        <div class="flex-grow flex items-center justify-center space-x-8">
          <template v-for="item in navItems" :key="item.path">
            <a
              v-if="item.isExternal"
              :href="item.path"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-300 text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-primary-50/15 dark:hover:text-primary-400 group">
              <el-icon class="text-lg">
                <component :is="item.icon" />
              </el-icon>
              <span class="relative">
                {{ item.name }}
                <el-icon
                  class="text-xs absolute -top-0.5 -right-0.5 opacity-80 group-hover:text-primary-500">
                  <Link />
                </el-icon>
              </span>
            </a>
            <router-link
              v-else
              :to="item.path"
              class="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-300"
              :class="[
                isActive(item.path)
                  ? 'text-primary-500 bg-primary-50 dark:bg-gray-700'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-primary-50/15 dark:hover:text-primary-400',
              ]">
              <el-icon class="text-lg">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.name }}</span>
            </router-link>
          </template>

          <!-- 登录/用户菜单 -->
          <template v-if="userStore.isLoggedIn">
            <el-dropdown trigger="click">
              <button
                class="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-300"
                :class="[
                  isActive('/dashboard')
                    ? 'text-primary-500 bg-primary-50 dark:bg-gray-700'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-primary-50/15 dark:hover:text-primary-400',
                ]">
                <el-icon class="text-lg">
                  <User />
                </el-icon>
                <span class="min-w-[3rem]">我的</span>
                <el-icon class="text-lg ml-0.5">
                  <ArrowDown />
                </el-icon>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/dashboard" class="flex items-center space-x-2">
                      <el-icon><User /></el-icon>
                      <span>个人中心</span>
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <div class="flex items-center space-x-2 text-red-500">
                      <el-icon><SwitchButton /></el-icon>
                      <span>注销</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-300"
              :class="[
                isActive('/login')
                  ? 'text-primary-500 bg-primary-50 dark:bg-gray-700'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-primary-50/15 dark:hover:text-primary-400',
              ]">
              <el-icon class="text-lg">
                <User />
              </el-icon>
              <span>登录</span>
            </router-link>
          </template>
        </div>

        <!-- 主题切换 -->
        <div class="flex-shrink-0 ml-4">
          <ToggleTheme />
        </div>
      </div>
    </div>

    <!-- 平板/手机端导航 -->
    <div class="lg:hidden">
      <div class="px-4 sm:px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8" />
          <span
            class="logo-text text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            CreativeOasis
          </span>
        </router-link>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-4">
          <ToggleTheme />
          <button
            class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
            @click="toggleMenu">
            <el-icon v-if="!isMenuOpen" class="block h-6 w-6"><Expand /></el-icon>
            <el-icon v-else class="block h-6 w-6"><Fold /></el-icon>
          </button>
        </div>
      </div>

      <!-- 展开菜单 -->
      <div
        v-show="isMenuOpen"
        class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div class="px-4 sm:px-6 py-2 space-y-1">
          <template v-for="item in navItems" :key="item.path">
            <a
              v-if="item.isExternal"
              :href="item.path"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="closeMenu">
              <el-icon class="text-lg">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.name }}</span>
              <el-icon class="text-xs ml-1">
                <Link />
              </el-icon>
            </a>
            <router-link
              v-else
              :to="item.path"
              class="flex items-center space-x-3 px-3 py-2 rounded-md"
              :class="[
                isActive(item.path)
                  ? 'text-primary-500 bg-primary-50 dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
              ]"
              @click="closeMenu">
              <el-icon class="text-lg">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.name }}</span>
            </router-link>
          </template>

          <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

          <template v-if="userStore.isLoggedIn">
            <router-link
              to="/dashboard"
              class="flex items-center space-x-3 px-3 py-2 rounded-md"
              :class="[
                isActive('/dashboard')
                  ? 'text-primary-500 bg-primary-50 dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
              ]"
              @click="closeMenu">
              <el-icon class="text-lg">
                <User />
              </el-icon>
              <span>个人中心</span>
            </router-link>
            <button
              class="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              @click="handleLogout">
              <el-icon class="text-lg">
                <SwitchButton />
              </el-icon>
              <span>注销</span>
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="flex items-center space-x-3 px-3 py-2 rounded-md"
              :class="[
                isActive('/login')
                  ? 'text-primary-500 bg-primary-50 dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
              ]"
              @click="closeMenu">
              <el-icon class="text-lg">
                <User />
              </el-icon>
              <span>登录</span>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.el-dropdown {
  @apply outline-none;
}

.el-icon {
  @apply flex-shrink-0;
}

// Logo 文字渐变效果
.text-gradient {
  @apply bg-clip-text text-transparent;
  background-image: linear-gradient(
    45deg,
    theme('colors.primary.500'),
    theme('colors.primary.400'),
    theme('colors.blue.400'),
    theme('colors.primary.500')
  );
  background-size: 300% 300%;
  animation: shine 8s ease-in-out infinite;
}

.text-gradient-alt {
  @apply bg-clip-text text-transparent;
  background-image: linear-gradient(
    45deg,
    theme('colors.primary.400'),
    theme('colors.purple.400'),
    theme('colors.pink.400'),
    theme('colors.primary.400')
  );
  background-size: 300% 300%;
  animation: shine 8s ease-in-out infinite reverse;
}

// Logo 动画效果
@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// Logo 图标轻微弹跳动画
@keyframes bounce-gentle {
  0%,
  100% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(2px);
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 3s ease-in-out infinite;
}

// 暗色模式调整
:deep(.dark) {
  .text-gradient {
    background-image: linear-gradient(
      45deg,
      theme('colors.primary.400'),
      theme('colors.primary.300'),
      theme('colors.blue.300'),
      theme('colors.primary.400')
    );
  }

  .text-gradient-alt {
    background-image: linear-gradient(
      45deg,
      theme('colors.primary.300'),
      theme('colors.purple.300'),
      theme('colors.pink.300'),
      theme('colors.primary.300')
    );
  }
}

// 添加字体
@font-face {
  font-family: 'Quicksand';
  src: url('@/assets/fonts/Quicksand-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

.logo-text {
  font-family: 'Quicksand', sans-serif;
  letter-spacing: 0.5px;
}

// 添加悬停效果
.logo-text {
  &:hover {
    .text-gradient,
    .text-gradient-alt {
      animation-duration: 4s;
    }
  }
}
</style>
