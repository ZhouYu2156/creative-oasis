<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, ref } from 'vue'
gsap.registerPlugin(ScrollTrigger)

const sections = [
  {
    title: '',
    subtitle: '探索娱乐与学习的无限可能',
    description: '在这里，你可以轻松学习编程知识，欣赏品质音乐，观看优秀教程。',
    image: 'https://picsum.photos/seed/section1/1920/1080',
  },
  {
    title: '编程学习',
    subtitle: '体系化的学习路线',
    description: '从基础到进阶，精心设计的课程体系，帮助你构建完整的知识体系。',
    image: 'https://picsum.photos/seed/section2/1920/1080',
  },
  {
    title: '探索未来',
    subtitle: '拥抱前沿科技',
    description: '我们将持续探索人工智能等前沿技术，致力于为用户提供更智能、更便捷的学习体验。',
    image: 'https://picsum.photos/seed/section3/1920/1080',
  },
]

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  const contents = document.querySelectorAll('.content')

  contents.forEach((content) => {
    // 设置初始状态
    gsap.set(content, {
      opacity: 0,
      y: 100,
    })

    // 创建滚动触发动画
    gsap.to(content, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: content,
        start: 'top center',
        end: 'bottom center',
        toggleActions: 'play reverse play reverse',
        scroller: container.value,
      },
    })
  })

  // 创建视差滚动效果
  const parallaxElements = document.querySelectorAll('.parallax')
  parallaxElements.forEach((element) => {
    gsap.to(element, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: element.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  })
})
</script>

<template>
  <div
    ref="container"
    class="h-[calc(100vh-64px)] overflow-auto snap-y snap-mandatory hide-scrollbar">
    <section
      v-for="(section, index) in sections"
      :key="index"
      class="relative h-[calc(100vh-64px)] w-screen snap-start">
      <!-- 背景图片 -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-fixed"
        :style="{
          backgroundImage: `url(${section.image})`,
        }">
        <!-- 暗色遮罩 -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      <!-- 文字内容 -->
      <div
        class="content relative h-full flex flex-col items-center justify-center text-white px-4 sm:px-6 lg:px-8">
        <h1
          v-if="index === 0"
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center max-w-6xl mx-auto mb-4 sm:mb-6 md:mb-8 [text-shadow:_2px_2px_10px_rgb(0_0_0_/_50%)] font-FZHanZhenGuangBiao dark:text-gray-200 transition-colors">
          欢迎来到 <span class="block text-primary-400">CreativeOasis</span>
        </h1>
        <h1
          v-else
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center max-w-6xl mx-auto mb-4 sm:mb-6 md:mb-8 [text-shadow:_2px_2px_10px_rgb(0_0_0_/_50%)] font-ZKKuaiLeTi dark:text-gray-200 transition-colors">
          {{ section.title }}
        </h1>

        <!-- 副标题 -->
        <p
          class="text-base sm:text-lg md:text-xl lg:text-2xl text-center max-w-4xl mx-auto text-gray-100 [text-shadow:_1px_1px_5px_rgb(0_0_0_/_50%)] font-ZKKuaiLeTi dark:text-gray-200 transition-colors">
          {{ section.subtitle }}
        </p>

        <!-- 描述文本 -->
        <p
          v-if="section.description"
          class="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-3xl mx-auto text-gray-200 [text-shadow:_1px_1px_5px_rgb(0_0_0_/_50%)] opacity-90">
          {{ section.description }}
        </p>

        <!-- 按钮组 -->
        <div v-if="index === 0" class="mt-8 sm:mt-10 flex flex-wrap justify-center gap-4">
          <router-link
            to="/course"
            class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors font-PingFangSC">
            开始学习
            <el-icon class="ml-2">
              <VideoCamera />
            </el-icon>
          </router-link>
          <router-link
            to="/music"
            class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white hover:bg-gray-200 text-primary-600 transition-colors font-PingFangSC">
            听音乐
            <el-icon class="ml-2">
              <Headset />
            </el-icon>
          </router-link>
        </div>
      </div>

      <!-- 滚动提示 (只在第一页显示) -->
      <div
        v-if="index === 0"
        class="absolute bottom-16 sm:bottom-24 md:bottom-12 left-1/2 transform -translate-x-1/2">
        <div class="text-white text-xs sm:text-sm mb-2 opacity-80">向下滚动</div>
        <div class="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/50 rounded-full mx-auto">
          <div
            class="w-1 sm:w-1.5 h-2 sm:h-3 bg-white/70 rounded-full mx-auto mt-2 animate-scroll"></div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>

<style scoped lang="scss">
.animate-scroll {
  animation: scroll 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

@keyframes scroll {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(20px);
    opacity: 0;
  }
}
/* 隐藏滚动条但保持滚动功能 */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
