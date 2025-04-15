<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { ElCard, ElTag, ElTimeline, ElTimelineItem } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'

// 时间线数据
const timelineData = [
  {
    timestamp: '2024.09 - 2024.12',
    title: '浙江省疾病预防控制中心智慧实验室系统',
    role: '前端开发实习生',
    type: 'primary' as const,
    tagType: 'primary' as const,
    icon: 'ph:hospital-bold',
    technologies: ['React', 'Ant Design', 'Umi Max', 'Dva', 'TypeScript', 'MySQL'],
    highlights: [
      '负责4个核心功能模块开发',
      '优化首屏加载时间至1.5秒',
      '重构代码降低维护成本40%',
      '提升用户操作效率50%',
    ],
    color: '#409EFF',
  },
  {
    timestamp: '2025.01 - 2024.03',
    title: '小兔鲜儿电商微信小程序',
    role: '前端开发工程师',
    type: 'success' as const,
    tagType: 'success' as const,
    icon: 'ph:shopping-cart-bold',
    technologies: ['Vue3', 'TypeScript', 'Pinia', 'uni-app', 'WeChat Mini Program'],
    highlights: [
      '独立完成小程序架构设计',
      '首屏加载优化至1.5秒内',
      '封装20+业务组件',
      '下单转化率提升40%',
    ],
    color: '#67C23A',
  },
  {
    timestamp: '2025.03 - 2025.04',
    title: '个人知识付费博客平台',
    role: '全栈开发者',
    type: 'warning' as const,
    tagType: 'warning' as const,
    icon: 'ph:book-bookmark-bold',
    technologies: ['Vue3', 'TypeScript', 'Element Plus', 'Pinia', 'Django', 'MySQL', 'Nginx'],
    highlights: ['独立完成全栈开发', '月访问量3000+', '付费会员200+', '自然流量提升200%'],
    color: '#E6A23C',
  },
]

// 技能成长数据
const skillGrowthData = {
  frontend: [
    { name: 'Vue3', growth: [60, 75, 85, 92] },
    { name: 'React', growth: [50, 65, 78, 85] },
    { name: 'TypeScript', growth: [40, 60, 75, 85] },
    { name: 'UI框架', growth: [55, 70, 82, 88] },
  ],
  periods: ['2024Q1', '2024Q2', '2024Q3', '2024Q4'],
}

// 项目影响力数据
const projectImpactData = [
  { name: '智慧实验室', value: 85, max: 100 },
  { name: '代码质量', value: 88, max: 100 },
  { name: '性能优化', value: 92, max: 100 },
  { name: '用户体验', value: 90, max: 100 },
  { name: '团队协作', value: 86, max: 100 },
]

// 技术栈分布数据
const techStackData = [
  { value: 40, name: '前端开发' },
  { value: 25, name: '后端开发' },
  { value: 15, name: '数据库' },
  { value: 12, name: '运维部署' },
  { value: 8, name: '项目管理' },
]

// 图表实例引用
const skillChartRef = ref<HTMLElement>()
const impactChartRef = ref<HTMLElement>()
const techStackChartRef = ref<HTMLElement>()
let skillChart: echarts.ECharts | null = null
let impactChart: echarts.ECharts | null = null
let techStackChart: echarts.ECharts | null = null

// 初始化技能成长图表
const initSkillChart = () => {
  if (!skillChartRef.value) return

  skillChart = echarts.init(skillChartRef.value)
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#e5e7eb' : '#666'

  const option: EChartsOption = {
    title: {
      text: '技能成长曲线',
      left: 'center',
      top: 0,
      textStyle: {
        color: textColor,
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? '#374151' : '#eee',
      textStyle: {
        color: textColor,
      },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((item: any) => {
          result += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`
        })
        return result
      },
    },
    legend: {
      data: skillGrowthData.frontend.map((item) => item.name),
      bottom: 0,
      padding: [15, 0],
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      textStyle: {
        fontSize: 12,
        padding: [0, 4],
        color: textColor,
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: skillGrowthData.periods,
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        margin: 12,
        fontSize: 12,
        color: textColor,
      },
    },
    yAxis: {
      type: 'value',
      max: 100,
      min: 0,
      interval: 20,
      name: '熟练度',
      nameTextStyle: {
        padding: [0, 0, 0, 40],
        fontSize: 12,
        color: textColor,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : '#eee',
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        margin: 12,
        fontSize: 12,
        color: textColor,
        formatter: '{value}%',
      },
    },
    series: skillGrowthData.frontend.map((item, index) => ({
      name: item.name,
      type: 'line',
      data: item.growth,
      smooth: true,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: colors[index],
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: colors[index],
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 0)',
            },
          ],
        },
        opacity: 0.3,
      },
    })),
  }
  skillChart.setOption(option)
}

// 初始化项目影响力图表
const initImpactChart = () => {
  if (!impactChartRef.value) return

  impactChart = echarts.init(impactChartRef.value)
  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#e5e7eb' : '#666'

  const option: EChartsOption = {
    title: {
      text: '项目影响力分析',
      left: 'center',
      top: 0,
      textStyle: {
        color: textColor,
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? '#374151' : '#eee',
      textStyle: {
        color: textColor,
      },
    },
    radar: {
      center: ['50%', '55%'],
      radius: '65%',
      indicator: projectImpactData.map((item) => ({
        name: item.name,
        max: item.max,
      })),
      splitNumber: 4,
      axisName: {
        color: textColor,
        fontSize: 12,
        padding: [0, 15],
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#374151' : '#ddd',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255, 255, 255, 0.5)', 'rgba(245, 245, 245, 0.5)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#374151' : '#ddd',
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: projectImpactData.map((item) => item.value),
            name: '项目表现',
            symbol: 'circle',
            symbolSize: 6,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(59, 130, 246, 0.6)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(147, 197, 253, 0.6)',
                  },
                ],
              },
            },
            lineStyle: {
              width: 2,
              color: '#3b82f6',
            },
            itemStyle: {
              color: '#3b82f6',
            },
          },
        ],
      },
    ],
  }
  impactChart.setOption(option)
}

// 初始化技术栈分布图表
const initTechStackChart = () => {
  if (!techStackChartRef.value) return

  techStackChart = echarts.init(techStackChartRef.value)
  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#e5e7eb' : '#666'

  const colors = [
    ['#409EFF', '#69b1ff'],
    ['#67C23A', '#85ce61'],
    ['#E6A23C', '#ebb563'],
    ['#F56C6C', '#f78989'],
    ['#909399', '#a6a9ad'],
  ]
  const option: EChartsOption = {
    title: {
      text: '技术栈分布',
      left: 'center',
      top: 0,
      textStyle: {
        color: textColor,
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? '#374151' : '#eee',
      textStyle: {
        color: textColor,
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      padding: [15, 0],
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      textStyle: {
        fontSize: 12,
        padding: [0, 4],
        color: textColor,
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}%',
          fontSize: 12,
          color: textColor,
          alignTo: 'edge',
          edgeDistance: '10%',
          distanceToLabelLine: 5,
        },
        labelLine: {
          length: 15,
          length2: 10,
          maxSurfaceAngle: 80,
        },
        labelLayout: {
          hideOverlap: true,
          moveOverlap: 'shiftY',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        data: techStackData.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: colors[index][0],
                },
                {
                  offset: 1,
                  color: colors[index][1],
                },
              ],
            },
          },
        })),
      },
    ],
  }
  techStackChart.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  skillChart?.resize()
  impactChart?.resize()
  techStackChart?.resize()
}

// 添加回到顶部功能
const scrollToTop = () => {
  appRef.value?.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 控制火箭显示
const showRocket = ref(false)
const appRef = ref<HTMLDivElement>()

// 监听滚动事件
const handleScroll = () => {
  showRocket.value = appRef.value!.scrollTop > 0
}

// 组件挂载时添加滚动监听和初始化图表
onMounted(() => {
  appRef.value = document.querySelector('#app') as HTMLDivElement

  // 使用 passive 选项添加滚动监听
  const scrollOptions: AddEventListenerOptions = { passive: true }
  appRef.value.addEventListener('scroll', handleScroll, scrollOptions)

  // 初始化图表
  initSkillChart()
  initImpactChart()
  initTechStackChart()

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize, scrollOptions)
})

// 组件卸载时移除监听器和销毁图表
onUnmounted(() => {
  const scrollOptions: AddEventListenerOptions = { passive: true }
  appRef.value?.removeEventListener('scroll', handleScroll, scrollOptions)
  window.removeEventListener('resize', handleResize)

  // 销毁图表实例
  skillChart?.dispose()
  impactChart?.dispose()
  techStackChart?.dispose()
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- 标题区域 -->
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">我的开发历程</h1>
      <p class="text-gray-600 dark:text-gray-200">记录我的技术成长与项目经验</p>
    </div>

    <!-- 数据可视化区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <!-- 技能成长曲线 -->
      <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
        <div ref="skillChartRef" class="w-full h-80"></div>
      </div>

      <!-- 项目影响力分析 -->
      <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
        <div ref="impactChartRef" class="w-full h-80"></div>
      </div>

      <!-- 技术栈分布 -->
      <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 md:col-span-2">
        <div ref="techStackChartRef" class="w-full h-80"></div>
      </div>
    </div>

    <!-- 时间线 -->
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in timelineData"
        :key="index"
        :timestamp="item.timestamp"
        :type="item.type"
        placement="top"
        :color="item.color"
        size="large">
        <el-card class="timeline-card dark:bg-dark-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon :icon="item.icon" class="text-2xl" :style="{ color: item.color }" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ item.title }}
                </h3>
              </div>
              <span class="text-sm text-primary-600 dark:text-primary-400">{{ item.role }}</span>
            </div>
          </template>

          <div class="space-y-4">
            <!-- 技术栈 -->
            <div class="flex flex-wrap gap-2">
              <el-tag
                v-for="tech in item.technologies"
                :key="tech"
                :type="item.tagType"
                effect="light"
                size="small"
                class="transition-all duration-300 hover:-translate-y-1">
                {{ tech }}
              </el-tag>
            </div>

            <!-- 项目亮点 -->
            <ul class="space-y-2">
              <li
                v-for="(highlight, hIndex) in item.highlights"
                :key="hIndex"
                class="flex items-start gap-2 text-gray-600 dark:text-gray-200">
                <Icon
                  icon="ph:check-circle-bold"
                  class="mt-1 flex-shrink-0"
                  :style="{ color: item.color }" />
                <span>{{ highlight }}</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <!-- 底部装饰 -->
    <div class="text-center mt-12">
      <button
        v-show="showRocket"
        class="inline-flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 transition-all duration-300"
        @click="scrollToTop">
        <Icon
          icon="ph:rocket-bold"
          class="text-4xl text-primary-500 dark:text-primary-400 animate-bounce" />
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">回到顶部</span>
      </button>
      <p class="mt-4 text-gray-600 dark:text-gray-200 font-ZKKuaiLeTi md:text-xl lg:text-2xl">
        继续探索，永不止步...
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timeline-card {
  @apply transition-all duration-300;

  &:hover {
    @apply transform -translate-y-1 shadow-lg;
  }
}

:deep(.el-timeline-item__node--large) {
  @apply w-4 h-4;
}

:deep(.el-timeline-item__tail) {
  @apply border-l-2;
}

:deep(.el-card) {
  @apply border border-gray-200 dark:border-gray-700;

  .el-card__header {
    @apply border-b border-gray-200 dark:border-gray-700;
  }
}

:deep(.dark) {
  .el-timeline-item__content {
    @apply text-gray-200;
  }

  .el-timeline-item__timestamp {
    @apply text-gray-300;
  }

  .el-card__header {
    @apply text-gray-100;
  }

  .echarts {
    background-color: transparent;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

// 修改按钮样式
button {
  outline: none;
  border: none;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;

  &:hover {
    .text-primary-500 {
      filter: brightness(1.2);
    }

    transform: translateY(-5px);
  }
}

// 添加图表响应式样式
@media (max-width: 640px) {
  .h-80 {
    height: 300px;
  }
}
</style>
