import type { CourseType } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  const categories = ref<CourseType[]>([])

  return { categories }
})
