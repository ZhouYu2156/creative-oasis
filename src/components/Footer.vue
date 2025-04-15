<template>
  <footer
    class="relative bottom-0 left-0 right-0 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        <!-- 品牌信息 -->
        <div>
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            CreativeOasis
          </h3>
          <p class="text-sm sm:text-base mb-4">
            探索音乐与编程的无限可能，让学习更有趣，让创作更自由。
          </p>
          <div class="flex space-x-4">
            <a
              href="#"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
              <el-icon class="text-xl sm:text-2xl">
                <Platform />
              </el-icon>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
              <el-icon class="text-xl sm:text-2xl">
                <Share />
              </el-icon>
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div>
          <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            快速链接
          </h4>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/music"
                class="text-sm sm:text-base hover:text-gray-600 dark:hover:text-white transition-colors">
                音乐资源
              </router-link>
            </li>
            <li>
              <router-link
                to="/video"
                class="text-sm sm:text-base hover:text-gray-600 dark:hover:text-white transition-colors">
                视频教程
              </router-link>
            </li>
            <li>
              <a
                href="https://www.zhouyu2156.cn/"
                target="_blank"
                class="text-sm sm:text-base hover:text-gray-600 dark:hover:text-white transition-colors">
                技术文档
              </a>
            </li>
          </ul>
        </div>

        <!-- 联系我们 -->
        <div>
          <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            联系我们
          </h4>
          <ul class="space-y-2">
            <li class="text-sm sm:text-base flex items-center">
              <el-icon class="mr-2">
                <Message />
              </el-icon>
              support@creativeoasis.com
            </li>
            <li class="text-sm sm:text-base flex items-center">
              <el-icon class="mr-2">
                <Location />
              </el-icon>
              中国，浙江省，杭州市
            </li>
          </ul>
        </div>

        <!-- 订阅信息 -->
        <div>
          <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            订阅我们
          </h4>
          <p class="text-sm sm:text-base mb-4">订阅最新资讯，获取学习动态。</p>
          <div class="flex">
            <input
              type="email"
              placeholder="输入您的邮箱"
              class="flex-1 px-3 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500" />
            <button
              class="px-4 py-2 text-sm sm:text-base bg-primary-500 text-white rounded-r hover:bg-primary-600 transition-colors">
              订阅
            </button>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Copyright © {{ new Date().getFullYear() }} · Developed by
          <a
            href="https://github.com/ZhouYu2156/"
            target="_blank"
            class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            ZhouYu
          </a>
          · All Rights Reserved
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.el-icon {
  @apply flex-shrink-0;
}
</style>
