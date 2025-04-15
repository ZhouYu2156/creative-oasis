<script setup lang="ts">
import { get_captcha } from '@/api'
import { useUserStore } from '@/stores/modules/user'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'switch-to-register'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const captchaValues = ref(['', '', '', ''])
const captchaRefs = ref<HTMLInputElement[]>([])
const captchaImage = ref('')
const isAgree = ref(false)
const isLoading = ref(false)

// 重置表单
const resetForm = () => {
  email.value = ''
  password.value = ''
  captchaValues.value = ['', '', '', '']
  isAgree.value = false
  isLoading.value = false
  refreshCaptcha()
}

// 登录
const handleLogin = async () => {
  if (!email.value) {
    ElMessage.warning('请输入账号')
    return
  }
  if (!password.value) {
    ElMessage.warning('请输入密码')
    return
  }
  if (!captchaValues.value.every((v) => v)) {
    ElMessage.warning('请输入验证码')
    return
  }
  if (!isAgree.value) {
    ElMessage.warning('请同意服务条款和隐私政策')
    return
  }

  isLoading.value = true
  try {
    const res = await userStore.login({
      email: email.value,
      password: password.value,
      captcha: captchaValues.value.join(''),
    })

    if (res.code === 200) {
      emit('update:visible', false)
      const redirectPath = (route.query.redirect as string) || '/dashboard'
      router.push(redirectPath)
    }
  } catch (error) {
    clearCaptcha()
    refreshCaptcha()
  } finally {
    isLoading.value = false
  }
}

// 切换到注册
const handleToRegister = () => {
  emit('switch-to-register')
  resetForm()
}

// 获取验证码
const refreshCaptcha = async () => {
  try {
    const res = await get_captcha()
    if (res.code === 200) {
      captchaImage.value = res.data.captcha_image
    }
  } catch (error) {
    ElMessage.error('获取验证码失败')
  }
}

// 处理验证码输入
const handleCaptchaInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // 允许输入数字和字母(不区分大小写)
  if (!/^[a-zA-Z0-9]*$/.test(value)) {
    captchaValues.value[index] = ''
    return
  }

  // 如果输入多个字符,只取第一个,并转换为大写
  if (value.length > 1) {
    captchaValues.value[index] = value[0].toUpperCase()
    input.value = value[0].toUpperCase()
  } else if (value.length === 1) {
    // 单个字符也转换为大写
    captchaValues.value[index] = value.toUpperCase()
    input.value = value.toUpperCase()
  }

  // 自动跳转到下一个输入框
  if (value && index < 3) {
    captchaRefs.value[index + 1]?.focus()
  }

  // 当所有验证码都输入完成时,自动尝试登录
  if (captchaValues.value.every((v) => v) && email.value && password.value) {
    handleLogin()
  }
}

// 处理验证码删除
const handleCaptchaBackspace = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (!captchaValues.value[index]) {
      // 当前格为空时,跳转到上一格并清空
      if (index > 0) {
        captchaValues.value[index - 1] = ''
        captchaRefs.value[index - 1]?.focus()
      }
    } else {
      // 清空当前格
      captchaValues.value[index] = ''
    }
  }
}

// 处理验证码粘贴
const handleCaptchaPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text')
  if (!pastedText) return

  // 提取数字和字母
  const chars = pastedText.match(/[a-zA-Z0-9]/g)
  if (!chars) return

  // 填充验证码,转换为大写
  chars.slice(0, 4).forEach((char, index) => {
    captchaValues.value[index] = char.toUpperCase()
  })

  // 自动尝试登录
  if (captchaValues.value.every((v) => v) && email.value && password.value) {
    handleLogin()
  }
}

// 登录失败时清空验证码
const clearCaptcha = () => {
  captchaValues.value = ['', '', '', '']
  captchaRefs.value[0]?.focus()
}

// 组件挂载时获取验证码
onMounted(() => {
  refreshCaptcha()
})
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div
      v-if="props.visible"
      class="login-wrapper fixed inset-0 bg-black/5 dark:bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
      <div class="w-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl" @click.stop>
        <!-- 头部 -->
        <div class="px-8 text-center pt-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">欢迎回来</h2>
          <p class="mt-2 text-sm text-gray-500">登录以继续访问</p>
        </div>

        <!-- 内容区域 -->
        <div class="p-8 flex flex-col space-y-6">
          <!-- 邮箱输入 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">邮箱地址</label>
            <el-input
              v-model="email"
              placeholder="请输入邮箱"
              :prefix-icon="'Message'"
              class="login-input" />
          </div>

          <!-- 密码输入 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">密码</label>
            <el-input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="'Lock'"
              show-password
              class="login-input" />
          </div>

          <!-- 验证码输入 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">验证码</label>
            <div class="flex space-x-4">
              <div class="flex-1 flex gap-2">
                <template v-for="(_, index) in 4" :key="index">
                  <input
                    v-model="captchaValues[index]"
                    type="text"
                    maxlength="1"
                    class="w-12 h-12 text-center text-xl font-bold bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-200"
                    :ref="
                      (el) => {
                        if (el) captchaRefs[index] = el as HTMLInputElement
                      }
                    "
                    @input="handleCaptchaInput(index, $event)"
                    @keydown="handleCaptchaBackspace(index, $event)"
                    @paste="handleCaptchaPaste"
                    @focus="($event.target as HTMLInputElement).select()" />
                </template>
              </div>
              <el-tooltip content="点击刷新验证码，可忽略大小写" placement="top" :show-after="500">
                <div
                  class="w-[120px] h-[48px] rounded overflow-hidden cursor-pointer"
                  @click="refreshCaptcha">
                  <img
                    v-if="captchaImage"
                    :src="captchaImage"
                    alt="验证码"
                    class="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                  <div
                    v-else
                    class="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <el-icon class="text-gray-400 animate-spin"><Loading /></el-icon>
                  </div>
                </div>
              </el-tooltip>
            </div>
          </div>

          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <el-checkbox v-model="isAgree" />
              <span class="text-sm text-gray-500">
                同意
                <el-popover
                  placement="top-start"
                  :width="'auto'"
                  trigger="hover"
                  content="服务条款文件未上传！">
                  <template #reference>
                    <a href="#" class="text-primary-500 hover:text-primary-600">服务条款</a>
                  </template>
                  <template #default>
                    <div class="flex items-center space-x-2">
                      <el-icon class="text-warning-500">
                        <WarningFilled />
                      </el-icon>
                      <span>服务条款文件未上传！</span>
                    </div>
                  </template>
                </el-popover>
                和
                <el-popover
                  placement="top-start"
                  :width="'auto'"
                  trigger="hover"
                  content="隐私政策文件未上传！">
                  <template #reference>
                    <a href="#" class="text-primary-500 hover:text-primary-600">隐私政策</a>
                  </template>
                  <template #default>
                    <div class="flex items-center space-x-2">
                      <el-icon class="text-warning-500">
                        <WarningFilled />
                      </el-icon>
                      <span>隐私政策文件未上传！</span>
                    </div>
                  </template>
                </el-popover>
              </span>
            </div>
            <a href="#" class="text-sm text-primary-500 hover:text-primary-600">忘记密码？</a>
          </div>

          <!-- 登录按钮 -->
          <el-button
            type="primary"
            :loading="isLoading"
            :disabled="!email || !password || !captchaValues.every((v) => v) || !isAgree"
            class="w-full !h-11 !text-base"
            @click="handleLogin">
            {{ isLoading ? '登录中...' : '登录' }}
          </el-button>

          <!-- 注册入口 -->
          <div class="text-center">
            <span class="text-sm text-gray-500">还没有账号？</span>
            <button
              class="text-sm text-primary-500 hover:text-primary-600 ml-1"
              @click="handleToRegister">
              立即注册
            </button>
          </div>

          <!-- 分割线 -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 text-gray-400 bg-white dark:bg-gray-900">其他登录方式</span>
            </div>
          </div>

          <!-- 第三方登录 -->
          <div class="flex justify-center space-x-6">
            <button
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-100 dark:opacity-80 cursor-not-allowed"
              disabled>
              <WeChat />
            </button>
            <button
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-60 dark:opacity-90 cursor-not-allowed"
              disabled>
              <Github />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.login-input {
  :deep(.el-input__wrapper) {
    @apply bg-gray-50 dark:bg-gray-800 border-0 shadow-none rounded-lg;

    &.is-focus {
      @apply ring-2 ring-primary-500 ring-opacity-50;
    }
  }

  :deep(.el-input__inner) {
    @apply h-10;
  }

  :deep(.el-input__prefix-inner) {
    @apply text-gray-400;
  }
}

:deep(.el-checkbox__label) {
  @apply hidden;
}

.captcha-input {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
}
</style>
