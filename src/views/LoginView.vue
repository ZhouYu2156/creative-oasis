<script setup lang="ts">
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import { ref } from 'vue'

const showLogin = ref(true)
const showRegister = ref(false)

// 切换到登录
const switchToLogin = () => {
  showRegister.value = false
  setTimeout(() => {
    showLogin.value = true
  }, 150) // 等待离开动画完成
}

// 切换到注册
const switchToRegister = () => {
  showLogin.value = false
  setTimeout(() => {
    showRegister.value = true
  }, 150) // 等待离开动画完成
}
</script>

<template>
  <div class="relative login-container">
    <!-- 登录组件 -->
    <Login v-model:visible="showLogin" @switch-to-register="switchToRegister" />

    <!-- 注册组件 -->
    <Register v-model:visible="showRegister" @switch-to-login="switchToLogin" />
  </div>
</template>

<style scoped>
.relative {
  min-height: 100vmin;
}
.dark .login-container {
  background-image: url('@/assets/bg_banner_2.jpg');
  background-size: 100% 100%;
}
</style>
