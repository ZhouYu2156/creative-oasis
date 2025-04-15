// 首页不需要懒加载
import { useUserStore } from '@/stores'
import HomeView from '@/views/HomeView.vue'
import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('@/views/DevelopmentTimeline.vue'),
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('@/views/MusicView.vue'),
      meta: { keepAlive: true }
    },
    {
      path: '/course',
      name: 'course',
      component: () => import('@/views/CategoryListView.vue'),
      meta: { keepAlive: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true } // 需要一个元数据来判断是否需要登录才能访问
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/course/:id',
      name: 'course-list',
      component: () => import('@/views/CourseListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/401',
      name: 'unauthorized',
      component: () => import('@/views/UnauthorizedView.vue')
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/views/ForbiddenView.vue')
    },
    {
      path: '/500',
      name: 'server-error',
      component: () => import('@/views/ServerErrorView.vue')
    },
    {
      path: '/payment/scan',
      name: 'payment-scan',
      component: () => import('@/views/ScanView.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('@/views/PaymentView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/payment/result',
      name: 'payment-result',
      component: () => import('@/views/PaymentResultView.vue'),
      meta: { requiresAuth: true, }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/FeedbackView.vue')
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 如果用户已经登录，不允许再访问登录和注册页
  if (userStore.isLoggedIn && to.name === 'login') {
    next({ name: 'dashboard' })
    return
  }

  // 如果需要登录但未登录，重定向到登录页
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    ElMessage.error('请先登录')
    // 需要登录但未登录，重定向到登录页，并携带原始路径
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

// 添加全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  router.push({ name: 'not-found' })
})

export default router
