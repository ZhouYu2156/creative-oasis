<script setup lang="ts">
import { Clock } from '@element-plus/icons-vue'
import { Icon } from '@iconify/vue'
import { ElButton, ElMessage, ElProgress, ElTag } from 'element-plus'
import html2canvas from 'html2canvas'
import { computed, ref } from 'vue'

// 基本信息
const basicInfo = {
  name: '周玉',
  title: '前端工程师',
  birth: '1999.05',
  age: '25岁',
  gender: '男',
  hometown: '湖南省永州市道县',
  address: '广东省广州市天河区',
  phone: '13037475430',
  email: '1043744584@qq.com',
  website: 'https://www.zhouyu2156.cn',
  education: '全日制统招本科',
  ethnicity: '汉族',
  jobExpectation: {
    position: '前端开发工程师',
    cities: ['广州', '深圳'],
    salary: '6k-8k',
    onboard: '随时到岗',
  },
  summary:
    '热爱前端开发，对技术有浓厚兴趣和独特见解，具备快速学习和技术落地能力。精通Vue3、React全家桶，熟悉Nest.js、Next.js等全栈开发框架。掌握Python Web开发技术栈，能够使用Django、Flask、FastAPI等进行后端开发。具备项目架构和性能优化经验，擅长高度还原设计稿和深入理解业务需求。熟练使用Linux、Nginx、MySQL等部署运维技术，掌握Vercel等现代化持续集成工具。积极拥抱AI等前沿技术提升开发效率，保持技术热情，经常活跃于技术社区，在GitHub持续贡献代码。',
}

// 教育背景
const education = {
  school: '吉首大学张家界学院',
  major: '计算机科学与技术',
  degree: '全日制本科',
  graduationTime: '2025 年 6 月',
  gpa: '3.2/4.0',
  ranking: '专业前 10%',
  courses: [
    '数据结构与算法',
    '计算机网络',
    '操作系统',
    '计算机组成原理',
    '数据库原理',
    '软件工程',
    'Python Web开发',
    'Linux 操作系统',
    '编译原理',
    '微机原理',
    '人工智能导论',
  ],
  achievements: [
    '专业成绩优异，专业排名前10%，连续两年获得学习优秀奖学金',
    '开发并发布 flask-hot-reload 开源插件（GitHub Star 50+，月下载量 1000+），提供Flask应用热重载功能',
    '个人技术博客（www.zhouyu2156.cn）累计发表原创文章50+篇，月访问量3000+',
    '担任班级技术组组长，组织8次技术分享活动，平均参与人数30+',
    '在GitHub活跃贡献，累计PR 20+，为多个开源项目贡献代码和文档改进',
  ],
}

// 核心技能标签
const coreTechTags = [
  // 前端核心
  { name: 'Vue3.3+', type: 'success' as const, category: 'frontend' },
  { name: 'React18', type: 'success' as const, category: 'frontend' },
  { name: 'TypeScript5', type: 'success' as const, category: 'frontend' },
  { name: 'Element Plus', type: 'primary' as const, category: 'frontend' },
  { name: 'Ant Design5', type: 'primary' as const, category: 'frontend' },
  { name: 'Tailwind CSS3', type: 'primary' as const, category: 'frontend' },
  // 可视化技术
  { name: 'Canvas', type: 'success' as const, category: 'visualization' },
  { name: 'ECharts', type: 'success' as const, category: 'visualization' },
  { name: 'SVG', type: 'primary' as const, category: 'visualization' },
  { name: 'Three.js', type: 'primary' as const, category: 'visualization' },
  { name: 'D3.js', type: 'primary' as const, category: 'visualization' },
  // 状态管理
  { name: 'Pinia2', type: 'warning' as const, category: 'state' },
  { name: 'Redux Toolkit', type: 'warning' as const, category: 'state' },
  // 构建工具
  { name: 'Vite5', type: 'info' as const, category: 'build' },
  { name: 'Webpack5', type: 'info' as const, category: 'build' },
  // 后端技术
  { name: 'MySQL8', type: 'danger' as const, category: 'backend' },
  { name: 'Django5', type: 'danger' as const, category: 'backend' },
  { name: 'FastAPI', type: 'danger' as const, category: 'backend' },
  { name: 'DRF', type: 'danger' as const, category: 'backend' },
  { name: 'Flask', type: 'danger' as const, category: 'backend' },
  { name: 'Nginx', type: 'danger' as const, category: 'backend' },
  // 版本控制
  { name: 'Git', type: 'info' as const, category: 'versionControl' },
  { name: 'SVN', type: 'info' as const, category: 'versionControl' },
]

// 技能评分（基于项目实践经验）
const skillRatings = {
  'Vue3全家桶（Vue3/Pinia/Router）': 85,
  'React生态（React/Redux/Hooks）': 80,
  'TypeScript/JavaScript': 82,
  '前端工程化（Webpack/Vite）': 78,
  'UI框架（Element Plus/Ant Design）': 85,
  '性能优化 与 最佳实践': 75,
  'Node.js后端开发': 70,
  'Python Web开发': 85,
}

// 技能列表
const skills = {
  development: [
    '具备扎实的 HTML、CSS、JS 知识基础，深入理解盒模型、网页布局、事件循环、原型链、Promise、响应式底层原理等前端核心概念',
    '熟悉 HTTP、TCP 协议和浏览器开发者调试工具，能够精准剖析网络请求过程中的各类问题并进行网络性能优化与故障排查等',
    '熟练掌握常用 Web API，包括 DOM 操作、事件处理、存储、网络通信等，具备跨浏览器兼容性处理经验',
  ],
  frontend: [
    '熟悉 Vue 和 React 工程化项目开发以及周边生态技术如 Vuex、Pinia、Redux 等，熟练运用 TS 和 Element Plus 与 Antd 等组件库开发企业级中后台系统',
    '熟悉 Webpack 和 Vite 等构建工具，可独立配置开发环境。掌握前端主流的库，如 Bootstrap、Tailwind CSS、Jquery、Dayjs、Axios 等。熟悉 Node 开发环境',
    '掌握前端可视化技术，熟悉 Canvas 绘图和 ECharts 数据可视化，了解 SVG、Three.js 和 D3.js，具备数据可视化和 3D 场景开发能力',
  ],
  backend: ['熟练掌握 MySQL 数据库、Django、Flask 以及 DRF 框架，可快速开发后端 API 和说明文档'],
  versionControl: [
    '精通 Git 工作流程，包括分支管理、代码审查、合并策略等',
    '熟练使用 GitHub/GitLab 进行团队协作，掌握 Issue 跟踪和 PR 管理',
    '具备 SVN 版本管理经验，能够高效进行团队协作开发',
  ],
  deployment: [
    '掌握 Linux 服务器环境配置和命令行操作',
    '熟练配置 Nginx 服务器，包括反向代理、负载均衡、SSL 证书等',
    '了解 Docker 容器化部署，能够编写 Dockerfile 和使用 Docker Compose',
    '具备从开发到部署的全流程经验，能独立完成项目上线',
  ],
  tools: ['熟练使用和个性化配置 PyCharm、WebStorm、VSCode 等主流开发工具'],
  other: [
    '熟悉常见开发模式，如 MVC、单例、订阅与发布、工厂和观察者模式等，具备扎实的面向对象开发思想',
    '了解常见数据结构与算法，可编写高质量的代码，能对性能进行优化，提高程序执行效率',
    '具备良好的编程思维和抽象能力，能够设计出可扩展、可维护的代码架构',
  ],
}

// 项目经历
const projectExperience = [
  {
    title: '浙江省疾病预防控制中心智慧实验室系统',
    role: '前端开发实习生',
    period: '2024.09 - 2024.12（实习）',
    technologies: ['React', 'Ant Design', 'Umi Max', 'Dva', 'TypeScript', 'MySQL'],
    description:
      '参与浙江省疾控中心智慧实验室系统开发，该系统服务于全省17个地市的疾控中心，日均处理实验室数据5000+条。基于React技术栈开发的中后台系统，实现了实验室全流程数字化管理，显著提升了工作效率。',
    responsibilities: [
      '负责系统4个核心功能模块的前端开发，实现界面交互和数据对接，模块的整体代码覆盖率达到85%',
      '优化系统性能，将页面首屏加载时间从3秒优化至1.5秒，提升用户体验',
      '重构部分历史代码，将代码重复率从15%降低到5%，提升系统可维护性',
    ],
    achievements: [
      '开发的功能模块服务于300+实验室工作人员的日常工作，月均处理数据10万+条',
      '编写的组件库被项目组采纳，提升团队开发效率30%',
      '重构的代码减少了40%的维护成本，获得项目经理好评',
      '制定前端开发规范文档，提升团队协作效率20%',
      '系统上线后，用户操作效率提升50%，差评率降低60%',
    ],
  },
  {
    title: '小兔鲜儿电商小程序',
    role: '前端开发工程师',
    period: '2025.01 - 2025.03（个人项目）',
    technologies: ['Vue3', 'TypeScript', 'Pinia', 'uni-app', 'Vite', 'uni-ui'],
    description:
      '基于 uni-app 开发的电商小程序项目，实现了完整的电商购物流程。作为个人开发者，独立完成项目从技术选型到功能实现的全过程，项目采用 Vue3 + TypeScript 技术栈，注重代码质量和用户体验，目前已完成开发并进入测试阶段。',
    responsibilities: [
      '基于 Vite + TypeScript 搭建开发环境，使用 ESLint + Prettier 规范代码风格',
      '封装 http 请求工具，基于 Promise 封装 uni.request，实现请求响应拦截器',
      '使用 Pinia + persist 插件实现状态持久化，解决购物车等数据同步问题',
      '封装 XtxSwiper 轮播图组件，实现首页商品推荐、分类导航等功能',
      '基于 vk-data-goods-sku-popup 组件开发商品详情页，处理多规格商品选择',
      '实现购物车模块，支持商品选择、数量修改、规格切换等核心功能',
      '集成微信登录与支付功能，打通下单支付流程',
    ],
    achievements: [
      '实现小程序分包加载，主包体积控制在2MB以内',
      '开发骨架屏组件，优化首页和商品列表的加载体验',
      '使用 Promise.all 处理首页并发请求，减少页面白屏时间',
      '采用虚拟列表处理商品列表，解决大数据量加载卡顿问题',
      '基于 uni-app 条件编译，成功适配H5和小程序两端',
      '完成项目核心功能开发，代码提交20+次',
      '封装 XtxSwiper、XtxGuess 等5个业务组件，提升代码复用性',
    ],
  },
  {
    title: '个人知识付费博客平台',
    role: '全栈开发者',
    period: '2025.03 - 2025.4（个人项目）',
    technologies: ['Vue3', 'TypeScript', 'Element Plus', 'Pinia', 'Django', 'MySQL', 'Nginx'],
    description:
      '独立开发的知识付费博客平台，整合技术文章、视频教程和在线课程。通过博客内容营销引导用户付费观看技术视频教程，实现个人知识变现。',
    responsibilities: [
      '独立完成从需求分析到上线部署的全过程，使用Vue3技术栈开发前端，Django开发后端',
      '设计并实现会员订阅、内容付费等核心功能',
      '优化系统性能和SEO，使平台在搜索引擎关键词排名前10',
    ],
    achievements: [
      '平台上线3个月内积累用户1000+，付费会员转化率达5%',
      '通过性能优化，使首屏加载时间控制在1.2秒内，跳出率降低30%',
      '开发的音乐播放器组件在GitHub获得100+ Star',
      '站点SEO优化后，自然流量提升200%，降低获客成本60%',
    ],
  },
]

// 个人优势
const personalStrengths = [
  {
    title: '前端技术专精',
    icon: 'ph:code-bold',
    description: '深耕前端技术栈，在Vue3和React项目中有实际经验，善于性能优化和工程化实践',
  },
  {
    title: '学习能力突出',
    icon: 'ph:trend-up-bold',
    description: '保持每周技术分享和博客输出，GitHub年贡献300+，持续关注前端新技术动态',
  },
  {
    title: '注重代码质量',
    icon: 'ph:file-code-bold',
    description: '遵循前端最佳实践，注重代码可维护性，个人项目代码测试覆盖率保持在80%以上',
  },
  {
    title: '团队协作能力',
    icon: 'ph:users-three-bold',
    description: '在实习项目中主动承担技术文档编写，帮助团队提升30%开发效率',
  },
]

// 自我评价
const selfEvaluation = [
  {
    title: '项目管理能力',
    content:
      '主导开发省级疾控中心项目，按时保质完成任务，项目上线后获得客户好评。在个人博客项目中，独立完成从需求分析到上线部署的全流程工作，体现了较强的项目管理能力。',
  },
  {
    title: '技术钻研能力',
    content:
      '深入研究Vue3和React源码，理解框架底层原理。开发过程中积极优化性能，将博客首屏加载时间从3秒优化至1.2秒，提升用户体验。每周保持阅读技术文章和源码的习惯，持续提升技术深度。',
  },
  {
    title: '问题解决能力',
    content:
      '在疾控项目中解决了复杂的数据状态管理问题，通过重构代码架构，显著提升了代码可维护性。面对技术难题，善于通过查阅文档、请教同事等多种方式高效解决问题。',
  },
  {
    title: '团队协作能力',
    content:
      '在校期间担任技术社团负责人，组织技术分享会提升团队技术氛围。工作中注重与后端、产品等角色的沟通协作，确保项目顺利推进。具有良好的文档编写习惯，促进团队知识共享。',
  },
  {
    title: '学习成长能力',
    content:
      '保持每日学习编程的习惯，坚持输出技术博客。一年内掌握了Vue3、React等主流框架，并应用于实际项目。对新技术保持高度关注，善于将新技术应用于工作实践中。',
  },
]

// 简历容器引用
const resumeRef = ref<HTMLElement | null>(null)

// 检测当前主题
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains('dark')
})

// 下载简历为图片
const downloadAsImage = async () => {
  if (!resumeRef.value) return

  try {
    ElMessage.info('正在生成简历图片，请稍候...')
    // 获取当前背景色
    const backgroundColor = isDarkMode.value ? '#1e293b' : '#f3f4f6'
    const canvas = await html2canvas(resumeRef.value, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许加载跨域图片
      logging: false,
      backgroundColor: backgroundColor, // 使用当前主题的背景色
    })
    // 转换为图片并下载
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${basicInfo.name}-简历.png`
    link.href = image
    link.click()
    ElMessage.success('简历已成功下载为图片！')
  } catch (error) {
    console.error('下载简历图片失败:', error)
    ElMessage.error('下载失败，请稍后重试')
  }
}
</script>

<template>
  <div
    ref="resumeRef"
    class="max-w-5xl mx-auto px-4 py-8 space-y-8 print:py-2 print:space-y-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
    <!-- 顶部信息卡片 -->
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden relative">
      <!-- 修改卷王印章样式 -->
      <div class="absolute top-6 right-6 rotate-[-30deg]">
        <div class="relative">
          <!-- 外圈印章 -->
          <div
            class="w-16 h-16 border-[3px] border-red-600 rounded-full flex items-center justify-center">
            <!-- 内圈文字 -->
            <span class="text-xl font-bold text-red-600 select-none">卷王</span>
          </div>
          <!-- 内圈装饰 -->
          <div class="absolute inset-[6px] border-2 border-red-600 rounded-full"></div>
          <!-- 印章装饰纹理 -->
          <div class="absolute inset-0 border border-red-600/30 rounded-full"></div>
        </div>
      </div>

      <!-- 顶部彩带 -->
      <div class="h-2 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"></div>

      <div class="p-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- 左侧基本信息 -->
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-4">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ basicInfo.name }}</h1>
              <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <p class="text-lg text-primary-600 dark:text-primary-400">{{ basicInfo.title }}</p>
            </div>

            <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed indent-8 text-justify">
              {{ basicInfo.summary }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="(item, key) in {
                  birth: ['mdi:calendar', basicInfo.birth],
                  address: ['mdi:map-marker', basicInfo.address],
                  phone: ['mdi:phone', basicInfo.phone],
                  email: ['mdi:email', basicInfo.email],
                  website: ['mdi:web', basicInfo.website],
                }"
                :key="key"
                class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Icon :icon="item[0]" class="text-lg text-primary-500" />
                <span v-if="key !== 'website'">{{ item[1] }}</span>
                <a
                  v-else
                  :href="item[1]"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  {{ item[1] }}
                </a>
              </div>
            </div>
          </div>

          <!-- 右侧信息 -->
          <div class="flex-none md:w-72 mt-4 md:mt-0">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 class="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                个人信息
              </h3>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="(item, key) in {
                    education: ['ph:graduation-cap-bold', basicInfo.education],
                    gender: ['ph:gender-male-bold', basicInfo.gender],
                    ethnicity: ['ph:flag-bold', basicInfo.ethnicity],
                    hometown: ['ph:house-bold', basicInfo.hometown],
                  }"
                  :key="key"
                  class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Icon :icon="item[0]" class="text-lg text-primary-500" />
                  <span class="text-sm">{{ item[1] }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2
            class="text-lg font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-2 mb-3">
            <Icon icon="ph:star-bold" class="text-xl" />
            求职意向
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">期望岗位</p>
              <p class="text-gray-700 dark:text-gray-300">
                {{ basicInfo.jobExpectation.position }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">期望城市</p>
              <p class="text-gray-700 dark:text-gray-300">
                {{ basicInfo.jobExpectation.cities.join('/') }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">期望薪资</p>
              <p class="text-gray-700 dark:text-gray-300">{{ basicInfo.jobExpectation.salary }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">到岗时间</p>
              <p class="text-gray-700 dark:text-gray-300">{{ basicInfo.jobExpectation.onboard }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人优势 -->
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon icon="ph:star-bold" class="text-xl text-primary-500" />
        个人优势
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(strength, index) in personalStrengths"
          :key="index"
          class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <Icon :icon="strength.icon" class="text-2xl text-primary-500" />
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {{ strength.title }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">{{ strength.description }}</p>
        </div>
      </div>
    </div>

    <!-- 技能评分 -->
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon icon="ph:chart-bar-bold" class="text-xl text-primary-500" />
        专业技能
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        <div v-for="(value, skill) in skillRatings" :key="skill" class="space-y-1">
          <div class="flex justify-between items-center">
            <span class="text-gray-700 dark:text-gray-300">{{ skill }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ value }}%</span>
          </div>
          <el-progress
            :percentage="value"
            :stroke-width="8"
            :show-text="false"
            :color="value >= 85 ? '#10b981' : value >= 75 ? '#3b82f6' : '#6366f1'" />
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="category in [
            'frontend',
            'visualization',
            'state',
            'build',
            'backend',
            'versionControl',
          ]"
          :key="category"
          class="space-y-2">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{
              {
                frontend: '前端核心',
                visualization: '可视化技术',
                state: '状态管理',
                build: '构建工具',
                backend: '后端技术',
                versionControl: '版本控制',
              }[category]
            }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="tag in coreTechTags.filter((t) => t.category === category)"
              :key="tag.name"
              :type="tag.type"
              effect="light"
              class="mb-2">
              {{ tag.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Icon icon="ph:graduation-cap-bold" class="text-xl text-primary-500" />
        教育背景
      </h2>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {{ education.school }}
          </h3>
          <div class="space-y-1">
            <p class="text-gray-600 dark:text-gray-400">
              专业：{{ education.major }}（{{ education.degree }}）
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              GPA：{{ education.gpa }} | 排名：{{ education.ranking }}
            </p>
          </div>
        </div>
        <div class="mt-2 md:mt-0">
          <p
            class="text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            毕业时间：{{ education.graduationTime }}
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">主修课程：</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(course, index) in education.courses"
              :key="index"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
              {{ course }}
            </span>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">在校成就：</h4>
          <ul class="space-y-1">
            <li
              v-for="(achievement, index) in education.achievements"
              :key="index"
              class="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <Icon icon="ph:check-circle-bold" class="mt-1 flex-shrink-0 text-primary-500" />
              <span>{{ achievement }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 项目经历 -->
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon icon="ph:briefcase-bold" class="text-xl text-primary-500" />
        项目经历
      </h2>

      <div class="space-y-8">
        <div
          v-for="(project, index) in projectExperience"
          :key="index"
          class="border-l-4 border-primary-500 pl-4 pb-2">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ project.title }}
              </h3>
              <p class="text-primary-600 dark:text-primary-400 text-sm">{{ project.role }}</p>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1 md:mt-0">
              {{ project.period }}
            </p>
          </div>

          <div class="mb-3">
            <div class="flex flex-wrap gap-2 mb-3">
              <el-tag v-for="tech in project.technologies" :key="tech" size="small" effect="plain">
                {{ tech }}
              </el-tag>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {{ project.description }}
            </p>
          </div>

          <div class="space-y-3 mt-4">
            <div>
              <h4 class="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
                主要职责：
              </h4>
              <ul class="space-y-1">
                <li
                  v-for="(item, itemIndex) in project.responsibilities"
                  :key="itemIndex"
                  class="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Icon icon="ph:check-circle-bold" class="mt-1 flex-shrink-0 text-primary-500" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">
                项目成果：
              </h4>
              <ul class="space-y-1">
                <li
                  v-for="(item, itemIndex) in project.achievements"
                  :key="itemIndex"
                  class="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Icon icon="ph:check-circle-bold" class="mt-1 flex-shrink-0 text-primary-500" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技术能力详情 -->
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon icon="ph:wrench-bold" class="text-xl text-primary-500" />
        技术能力详情
      </h2>

      <div class="space-y-8">
        <!-- 开发基础 -->
        <div class="space-y-3">
          <h3
            class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Icon icon="ph:code-bold" class="text-xl text-primary-500" />
            开发基础
          </h3>
          <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-4">
            <li v-for="(item, index) in skills.development" :key="index" class="text-sm">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- 前端技术栈 -->
        <div class="space-y-3">
          <h3
            class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Icon icon="ph:browser-bold" class="text-xl text-primary-500" />
            前端技术栈
          </h3>
          <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-4">
            <li v-for="(item, index) in skills.frontend" :key="index" class="text-sm">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- 后端技术栈 -->
        <div class="space-y-3">
          <h3
            class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Icon icon="ph:database-bold" class="text-xl text-primary-500" />
            后端技术栈
          </h3>
          <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-4">
            <li v-for="(item, index) in skills.backend" :key="index" class="text-sm">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- 版本控制与部署运维 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 版本控制 -->
          <div class="space-y-3">
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Icon icon="ph:git-branch-bold" class="text-xl text-primary-500" />
              版本控制
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-4">
              <li v-for="(item, index) in skills.versionControl" :key="index" class="text-sm">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- 部署与运维 -->
          <div class="space-y-3">
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Icon icon="ph:cloud-bold" class="text-xl text-primary-500" />
              部署与运维
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-4">
              <li v-for="(item, index) in skills.deployment" :key="index" class="text-sm">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 其他技能 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 开发工具 -->
          <div class="space-y-3">
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Icon icon="ph:terminal-window-bold" class="text-xl text-primary-500" />
              开发工具
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-4">
              <li v-for="(item, index) in skills.tools" :key="index" class="text-sm">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- 其他能力 -->
          <div class="space-y-3">
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Icon icon="ph:lightbulb-bold" class="text-xl text-primary-500" />
              其他能力
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-4">
              <li v-for="(item, index) in skills.other" :key="index" class="text-sm">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 自我评价 -->
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon icon="ph:user-focus-bold" class="text-xl text-primary-500" />
        自我评价
      </h2>

      <div class="space-y-4">
        <div
          v-for="(item, index) in selfEvaluation"
          :key="index"
          class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
          <h3
            class="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-2">
            <Icon
              :icon="
                index === 0
                  ? 'ph:projector-screen-chart-bold'
                  : index === 1
                    ? 'ph:brain-bold'
                    : index === 2
                      ? 'ph:puzzle-piece-bold'
                      : index === 3
                        ? 'ph:users-three-bold'
                        : 'ph:student-bold'
              "
              class="text-xl text-primary-500" />
            {{ item.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="text-center text-gray-500 dark:text-gray-400 text-sm mt-8 print:hidden">
      <p>感谢您花时间阅读我的简历，期待与您的合作！</p>
    </div>

    <!-- 发展历程按钮 - 左下角固定位置 -->
    <div class="fixed bottom-6 left-6 print:hidden">
      <router-link
        to="/timeline"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1">
        <el-icon class="text-xl text-primary-500">
          <Clock />
        </el-icon>
        <span class="text-gray-700 dark:text-gray-300">发展历程</span>
      </router-link>
    </div>
  </div>

  <!-- 下载按钮 -->
  <div class="fixed bottom-6 right-6 print:hidden">
    <el-tooltip content="下载简历" placement="top">
      <el-button
        type="primary"
        size="large"
        round
        class="download-btn flex items-center gap-2 shadow-lg"
        @click="downloadAsImage">
        <Icon icon="ph:download-simple-bold" class="text-2xl text-white" />
      </el-button>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">
// 添加全局背景色
:deep(body) {
  @apply bg-gray-50 dark:bg-gray-900;
}

body {
  background-color: #fafafa;
}
.el-icon {
  @apply text-primary-500;
}

:deep(.dark) {
  .el-icon {
    @apply text-primary-400;
  }
}

:deep(.el-progress-bar__inner) {
  transition: width 0.8s ease;
}

:deep(.el-tag) {
  @apply transition-all duration-300;

  &:hover {
    transform: translateY(-2px);
  }
}

@media print {
  .shadow-md {
    box-shadow: none;
  }

  .page-break {
    page-break-after: always;
  }
}

.download-btn {
  @apply bg-primary-500 hover:bg-primary-600 transition-all duration-300 sm:scale-100 scale-90;

  &:hover {
    @apply transform-gpu -translate-y-1;
  }

  // 响应式适配
  @screen sm {
    @apply bottom-6 right-6;
  }

  @screen md {
    @apply bottom-8 right-8;
  }
}
</style>
