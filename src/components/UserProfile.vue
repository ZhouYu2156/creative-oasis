<script setup lang="ts">
import { update_profile } from '@/api'
import { useUserStore } from '@/stores/modules/user'
import type { User } from '@/types'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

const userStore = useUserStore()

// 可编辑字段配置
const editableFields = {
  nickname: '昵称',
  gender: '性别',
  bio: '个性签名',
  location: '所在地',
} as const

// 只读字段配置
const readonlyFields = {
  last_login_time: '最后登录时间',
  last_login_ip: '最后登录IP',
  is_member: '会员状态',
  member_expired_time: '会员到期时间',
} as const

// 从 store 获取用户信息
const userInfo = computed(() => userStore.userInfo)

const isEditing = ref(false)
const editForm = ref<Partial<User>>({})

// 开始编辑
const startEdit = () => {
  // 只复制可编辑的字段
  const { nickname, gender, bio, location } = userInfo.value || {}
  editForm.value = { nickname, gender, bio, location }
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {}
}

// 处理保存
const handleSave = async () => {
  try {
    const result = await update_profile({
      nickname: editForm.value.nickname || '',
      gender: editForm.value.gender || 'unknown',
      bio: editForm.value.bio || '',
      location: editForm.value.location || '',
    })
    if (result.code === 200) {
      userStore.updateUserInfo(result.data)
      isEditing.value = false
      ElMessage.success('保存成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 格式化性别显示
const formatGender = (gender: string) => {
  const genderMap = {
    unknown: '未知',
    male: '男',
    female: '女',
  }
  return genderMap[gender as keyof typeof genderMap] || '未知'
}

// 格式化时间显示
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 组件挂载时获取最新用户信息
onMounted(async () => {
  if (userStore.isLoggedIn) {
    await userStore.fetchUserInfo()
  }
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">个人信息</h2>
      <div v-if="userInfo">
        <el-button v-if="!isEditing" type="primary" @click="startEdit">编辑</el-button>
        <template v-else>
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" class="ml-2" @click="handleSave">保存</el-button>
        </template>
      </div>
    </div>

    <div v-if="userInfo" class="space-y-6">
      <!-- 头像和昵称 -->
      <div class="flex items-center space-x-4">
        <img
          :src="userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'"
          alt="avatar"
          class="w-20 h-20 rounded-full object-cover" />
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ userInfo.nickname || '未设置昵称' }}
          </h3>
          <div class="flex items-center mt-1">
            <el-tag :type="userInfo.is_member ? 'success' : 'danger'" size="small">
              <div class="flex items-center space-x-1">
                <el-icon class="scale-[1.4]"><Postcard /></el-icon>
                <span>{{ userInfo.is_member ? '会员' : '普通用户' }}</span>
              </div>
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 可编辑信息 - 两列布局 -->
      <div class="grid grid-cols-2 gap-6">
        <template v-for="(label, field) in editableFields" :key="field">
          <div :class="[field === 'bio' ? 'col-span-2' : '']" class="space-y-2">
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ label }}</label>
            <template v-if="!isEditing">
              <p class="text-gray-900 dark:text-white">
                <template v-if="field === 'gender'">
                  {{ formatGender(userInfo[field]) }}
                </template>
                <template v-else>
                  {{ userInfo[field] || '未设置' }}
                </template>
              </p>
            </template>
            <template v-else>
              <el-input
                v-if="['nickname', 'location'].includes(field)"
                v-model="editForm[field]"
                :placeholder="`请输入${label}`" />
              <el-select v-else-if="field === 'gender'" v-model="editForm[field]" class="w-full">
                <el-option value="unknown" label="未知" />
                <el-option value="male" label="男" />
                <el-option value="female" label="女" />
              </el-select>
              <el-input
                v-else-if="field === 'bio'"
                v-model="editForm[field]"
                type="textarea"
                :rows="3"
                :placeholder="`请输入${label}`" />
            </template>
          </div>
        </template>
      </div>

      <!-- 只读信息 -->
      <div class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-500">账号信息</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <template v-for="(label, field) in readonlyFields" :key="field">
            <div class="space-y-1">
              <label class="text-xs text-gray-500 dark:text-gray-400">{{ label }}</label>
              <p class="text-sm text-gray-900 dark:text-white">
                <template v-if="field === 'is_member'">
                  {{ userInfo[field] ? '是' : '否' }}
                </template>
                <template v-else-if="field.includes('time')">
                  {{ userInfo[field] ? formatDate(userInfo[field]) : '暂未开通' }}
                </template>
                <template v-else>
                  {{ userInfo[field] || '暂无' }}
                </template>
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
