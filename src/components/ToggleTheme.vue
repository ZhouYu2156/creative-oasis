<script setup lang="ts">
import { useToggleTheme } from '@/hooks'

const { isDark, toggleTheme } = useToggleTheme()
</script>

<template>
  <button
    @click="toggleTheme"
    class="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 px-0.5 dark:bg-gray-700 transition-colors duration-300">
    <div
      class="flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform duration-300"
      :class="!isDark ? 'translate-x-0' : 'translate-x-7 bg-gray-800'">
      <!-- 太阳图标 -->
      <svg
        v-show="!isDark"
        class="h-4 w-4 text-yellow-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <!-- 月亮图标 -->
      <svg
        v-show="isDark"
        class="h-4 w-4 text-blue-200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </div>
  </button>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
