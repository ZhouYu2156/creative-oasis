<script setup lang="ts">
import { register, send_email_code } from '@/api'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'switch-to-login'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const route = useRoute()

const email = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const isAgree = ref(false)
const isLoading = ref(false)
const COUNTDOWN_TIME = 30 // 倒计时时间（秒）
const countdown = ref(0)
const timer = ref<number>()
const isSending = ref(false) // 添加发送状态

// 重置表单
const resetForm = () => {
  email.value = ''
  code.value = ''
  password.value = ''
  confirmPassword.value = ''
  isAgree.value = false
  isLoading.value = false
  countdown.value = 0
  clearInterval(timer.value)
}

// 验证邮箱格式
const validateEmail = (email: string) => {
  // QQ邮箱格式验证：纯数字@qq.com
  const qqEmailRegex = /^[1-9][0-9]{4,}@qq\.com$/
  if (!email.trim()) {
    return { valid: false, message: '请输入邮箱地址' }
  }
  if (!qqEmailRegex.test(email.trim())) {
    return { valid: false, message: '请输入正确的QQ邮箱地址（示例：12345@qq.com）' }
  }
  return { valid: true, message: '' }
}

// 添加密码验证函数
const validatePassword = (password: string) => {
  if (!password.trim()) {
    return { valid: false, message: '请输入密码' }
  }
  // 密码必须包含大小写字母和数字，长度6-20位
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/
  if (!passwordRegex.test(password)) {
    return { valid: false, message: '密码必须包含大小写字母和数字，长度8-20位' }
  }
  return { valid: true, message: '' }
}

// 发送验证码
const sendCode = async () => {
  // 防止重复发送
  if (countdown.value > 0 || isSending.value) return

  // 验证邮箱
  const emailValidation = validateEmail(email.value)
  if (!emailValidation.valid) {
    ElMessage.warning(emailValidation.message)
    return
  }

  // 验证隐私协议
  if (!isAgree.value) {
    ElMessage.warning('请先阅读并同意服务条款和隐私政策')
    return
  }

  isSending.value = true
  try {
    // 模拟发送验证码的 API 调用
    await send_email_code(email.value)

    countdown.value = COUNTDOWN_TIME
    timer.value = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer.value)
      }
    }, 1000)
  } catch (error) {
    ElMessage.error('验证码发送失败，请稍后重试')
  } finally {
    isSending.value = false
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// 注册
const handleRegister = async () => {
  // 验证邮箱
  const emailValidation = validateEmail(email.value)
  if (!emailValidation.valid) {
    ElMessage.warning(emailValidation.message)
    return
  }

  // 验证密码
  const passwordValidation = validatePassword(password.value)
  if (!passwordValidation.valid) {
    ElMessage.warning(passwordValidation.message)
    return
  }

  // 验证确认密码
  if (password.value !== confirmPassword.value) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }

  if (!code.value) {
    ElMessage.warning('请输入验证码')
    return
  }
  if (!isAgree.value) {
    ElMessage.warning('请同意服务条款和隐私政策')
    return
  }

  isLoading.value = true
  try {
    // TODO: 调用注册接口
    const res = await register({
      email: email.value,
      password: password.value,
      confirm_password: confirmPassword.value,
      email_code: code.value,
    })
    // 注册成功，跳转到登录
    if (res.code === 200) {
      emit('switch-to-login')
    }
  } catch (error) {
    ElMessage.error('注册失败')
  } finally {
    isLoading.value = false
  }
}

// 切换到登录
const handleToLogin = () => {
  emit('switch-to-login')
  resetForm()
}
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
      class="register-wrapper fixed inset-0 bg-black/5 dark:bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
      <div class="w-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl" @click.stop>
        <!-- 头部 -->
        <div class="pt-8 px-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">创建账号</h2>
          <p class="mt-2 text-sm text-gray-500">注册以获得完整访问权限</p>
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
              class="register-input" />
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
              class="register-input" />
          </div>

          <!-- 确认密码 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">确认密码</label>
            <el-input
              v-model="confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              :prefix-icon="'Lock'"
              show-password
              class="register-input" />
          </div>

          <!-- 验证码输入 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">验证码</label>
            <div class="flex space-x-4">
              <el-input
                v-model="code"
                placeholder="请输入验证码"
                :prefix-icon="'Key'"
                class="register-input" />
              <el-button
                :loading="isSending"
                :disabled="countdown > 0 || isSending"
                class="!w-32 !h-11"
                @click="sendCode">
                {{ isSending ? '发送中...' : countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
              </el-button>
            </div>
          </div>

          <!-- 隐私协议 -->
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

          <!-- 注册按钮 -->
          <el-button
            type="primary"
            :loading="isLoading"
            :disabled="!email || !code || !isAgree"
            class="w-full !h-11 !text-base"
            @click="handleRegister">
            {{ isLoading ? '注册中...' : '注册' }}
          </el-button>

          <!-- 登录入口 -->
          <div class="text-center">
            <span class="text-sm text-gray-500">已有账号？</span>
            <button
              class="text-sm text-primary-500 hover:text-primary-600 ml-1"
              @click="handleToLogin">
              立即登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.register-input {
  :deep(.el-input__wrapper) {
    @apply bg-gray-50 dark:bg-gray-800 border-0 shadow-none rounded-lg;

    &.is-focus {
      @apply ring-2 ring-primary-500 ring-opacity-50;
    }
  }

  :deep(.el-input__inner) {
    @apply h-11;
  }

  :deep(.el-input__prefix-inner) {
    @apply text-gray-400;
  }
}

:deep(.el-checkbox__label) {
  @apply hidden;
}
</style>
