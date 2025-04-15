<script setup lang="ts">
import { House, Location, Message, Phone, User } from '@element-plus/icons-vue'
import { ElDivider, ElTag } from 'element-plus'
import { ref } from 'vue'
import avatar from '../assets/profile-avatar.jpg'
interface BasicInfo {
  name: string
  gender: string
  education: string
  ethnicity: string
  hometown: string
  phone: string
  email: string
  location: string
  position: string
}

interface JobIntention {
  position: string
  availability: string
  cities: string
  salary: string
}

const basicInfo = ref<BasicInfo>({
  name: '周玉',
  gender: '男',
  education: '统招本科',
  ethnicity: '汉族',
  hometown: '湖南省永州市道县',
  phone: '13037475430',
  email: '1043744584@qq.com',
  location: '广东省广州市天河区',
  position: '全栈开发工程师',
})

const jobIntention = ref<JobIntention>({
  position: '前端开发工程师',
  cities: '广州/深圳',
  salary: '6k-8k',
  availability: '立即到岗',
})

// const avatar = ref('@/assets/avatar.jpg')
</script>

<template>
  <div class="resume-container">
    <!-- 头部信息 -->
    <header class="header">
      <div class="main-info">
        <div class="avatar-section">
          <el-avatar :size="80" :src="avatar" />
          <h1 class="dark:text-white">{{ basicInfo.name }}</h1>
          <div class="tags">
            <el-tag
              size="small"
              effect="plain"
              class="dark:!bg-gray-800 dark:!text-gray-200 dark:!border-gray-700"
              >{{ basicInfo.position }}</el-tag
            >
            <el-tag
              size="small"
              type="success"
              effect="plain"
              class="dark:!bg-emerald-900/50 dark:!text-emerald-200 dark:!border-emerald-800"
              >{{ basicInfo.education }}</el-tag
            >
          </div>
        </div>
        <div class="contact-section">
          <div class="contact-item dark:text-gray-300">
            <el-icon class="dark:text-blue-400"><Phone /></el-icon>
            <span>{{ basicInfo.phone }}</span>
          </div>
          <div class="contact-item dark:text-gray-300">
            <el-icon class="dark:text-blue-400"><Message /></el-icon>
            <span>{{ basicInfo.email }}</span>
          </div>
          <div class="contact-item dark:text-gray-300">
            <el-icon class="dark:text-blue-400"><Location /></el-icon>
            <span>现居住：{{ basicInfo.location }}</span>
          </div>
          <div class="contact-item dark:text-gray-300">
            <el-icon class="dark:text-blue-400"><User /></el-icon>
            <span>{{ basicInfo.gender }} | {{ basicInfo.ethnicity }}</span>
          </div>
          <div class="contact-item dark:text-gray-300">
            <el-icon class="dark:text-blue-400"><House /></el-icon>
            <span>籍贯：{{ basicInfo.hometown }}</span>
          </div>
        </div>
      </div>
    </header>

    <el-divider class="dark:!border-gray-700" />

    <!-- 求职意向 -->
    <section class="section job-intention">
      <h2 class="dark:text-white">求职意向</h2>
      <div class="intention-grid">
        <div class="intention-item dark:bg-gray-800 dark:text-gray-300">
          <p class="dark:text-gray-400">期望职位</p>
          <h3 class="dark:text-white">{{ jobIntention.position }}</h3>
        </div>
        <div class="intention-item dark:bg-gray-800 dark:text-gray-300">
          <p class="dark:text-gray-400">期望城市</p>
          <h3 class="dark:text-white">{{ jobIntention.cities }}</h3>
        </div>
        <div class="intention-item dark:bg-gray-800 dark:text-gray-300">
          <p class="dark:text-gray-400">期望薪资</p>
          <h3 class="dark:text-white">{{ jobIntention.salary }}</h3>
        </div>
        <div class="intention-item dark:bg-gray-800 dark:text-gray-300">
          <p class="dark:text-gray-400">到岗时间</p>
          <h3 class="dark:text-white">{{ jobIntention.availability }}</h3>
        </div>
      </div>
    </section>

    <el-divider class="dark:!border-gray-700" />

    <!-- 教育经历 -->
    <section class="section">
      <h2 class="dark:text-white">教育经历</h2>
      <div class="education dark:bg-gray-800">
        <div class="edu-header">
          <h3 class="dark:text-white">吉首大学张家界学院</h3>
          <span class="dark:text-gray-400">2021-09 ~ 2025-06</span>
        </div>
        <p class="dark:text-gray-300">计算机科学与技术 | 统招本科</p>
        <p class="dark:text-gray-300">GPA：3.4/4.0 | 排名：专业前 10%</p>
      </div>
    </section>

    <el-divider class="dark:!border-gray-700" />

    <!-- 专业技能 -->
    <section class="section skills-section">
      <h2 class="dark:text-white">专业技能</h2>
      <div class="skills">
        <div class="skill-category">
          <h3 class="dark:text-white">开发基础</h3>
          <ul>
            <li class="dark:text-gray-300">
              具备扎实的 HTML、CSS、JS 基础，熟悉 H5 语义化标签、CSS3
              新特性、弹性和网格布局方式，掌握浏览器事件循环、JS 原型链等核心技术概念
            </li>
            <li class="dark:text-gray-300">
              熟悉 HTTP、TCP
              协议和浏览器开发者调试工具，能够快速排查并解决开发过程中的网络、性能、程序运行调试、样式计算等各类问题
            </li>
            <li class="dark:text-gray-300">
              熟悉 Web API 文档的查阅和使用，如常见的 DOM 和 BOM
              操作、事件处理、数据存储、网络通信等
            </li>
            <li class="dark:text-gray-300">
              熟悉常见的设计模式和数据结构与算法，具有良好的编码习惯，能够编写高质量高效率的代码
            </li>
            <li class="dark:text-gray-300">
              熟悉 Python
              编程开发，深刻理解面向对象开发、函数式编程、装饰器、生成器、迭代器、协程等概念
            </li>
            <li class="dark:text-gray-300">
              熟悉 Linux 开发环境，能够在 Linux 系统上进行开发、部署、运维等操作
            </li>
          </ul>
        </div>

        <div class="skill-category">
          <h3 class="dark:text-white">前端技术</h3>
          <ul>
            <li class="dark:text-gray-300">
              熟练使用 TypeScript 编程开发，掌握 TS
              的类型推断、类型断言、类型守卫等，可编写类型安全、可维护性高的代码
            </li>
            <li class="dark:text-gray-300">
              熟悉 React、Vue 及周边生态技术，熟练运用 TS 和 Element Plus 与 Antd
              等组件库开发企业级中后台系统，并对框架底层原理有深入理解
            </li>
            <li class="dark:text-gray-300">
              掌握前端特效与可视化技术，熟悉 Canvas 绘图编程和 ECharts 数据可视化，了解
              SVG、GSAP、Three.js 和 D3.js，具备数据可视化和 3D 场景开发能力
            </li>
            <li class="dark:text-gray-300">
              具备工程化开发思维，熟悉 Webpack、Vite
              等构建工具的原理和使用，对性能优化、代码分割、按需加载等具备丰富经验
            </li>
            <li class="dark:text-gray-300">
              熟悉 Jquery、Bootstrap、LayUI、Axios、ECharts
              等前端主流库，根据业务需求可选择合适的库快速进行开发
            </li>
          </ul>
        </div>

        <div class="skill-category">
          <h3 class="dark:text-white">后端技术</h3>
          <ul>
            <li class="dark:text-gray-300">
              熟悉 Nodejs 后端开发环境，掌握 Express、Nestjs 等框架，熟练使用 TypeScript 进行开发
            </li>
            <li class="dark:text-gray-300">
              熟悉 MySQL 数据库，掌握 SQL
              基础语法、事务、索引、视图、存储过程、触发器等，对数据库的性能优化、主从复制、读写分离等具备良好经验
            </li>
            <li class="dark:text-gray-300">
              熟练使用 Python 开发后端接口，掌握 Flask、Django、FastAPI 等框架，熟练搭配 DRF
              框架开发 Restful API
            </li>
            <li class="dark:text-gray-300">
              熟练运用爬虫技术获取网页数据，对常见反扒手段有深入理解，如 UA 伪装、IP
              代理、验证码识别、JS 逆向等，掌握 Scrapy 框架内部原理和 Selenium 自动化工具的使用
            </li>
          </ul>
        </div>

        <div class="skill-category">
          <h3 class="dark:text-white">运维技术</h3>
          <ul>
            <li class="dark:text-gray-300">
              掌握 Linux 基础命令，熟练使用 Linux 系统进行日常开发、部署、运维等操作
            </li>
            <li class="dark:text-gray-300">
              熟悉 Docker 容器化技术，能够编写 Dockerfile 和 Docker Compose，对项目进行容器化部署
            </li>
            <li class="dark:text-gray-300">
              熟悉 Nginx 反向代理、负载均衡、缓存、动静分离、SSL 证书配置等，对项目进行优化
            </li>
          </ul>
        </div>

        <div class="skill-category">
          <h3 class="dark:text-white">其他</h3>
          <ul>
            <li class="dark:text-gray-300">
              掌握 Git 工作流程，包括分支管理、代码审查、合并策略，熟练使用 Github/Gitlab
              进行团队协作
            </li>
            <li class="dark:text-gray-300">具备 SVN 版本管理经验，能够高效进行团队协作开发</li>
            <li class="dark:text-gray-300">
              熟练使用和个性化配置 PyCharm、WebStorm、VSCode 等主流开发工具，提高开发效率
            </li>
            <li class="dark:text-gray-300">
              熟练使用 Postman、Apifox 等 API 工具，进行 API 测试和调试
            </li>
            <li class="dark:text-gray-300">
              熟练使用 AI 辅助工具，如 Cursor、ChatGPT-4、Copilot 等，提高开发效率
            </li>
            <li class="dark:text-gray-300">
              了解 Pandas、Numpy、Matplotlib 等数据分析库，能够进行简单的数据分析和可视化
            </li>
          </ul>
        </div>
      </div>
    </section>

    <el-divider class="dark:!border-gray-700" />

    <!-- 项目经历 -->
    <section class="section">
      <h2 class="dark:text-white">项目经历</h2>
      <div class="projects">
        <div class="project-item dark:bg-gray-800">
          <div class="project-header">
            <div class="project-title dark:text-white">浙江省疾病预防控制中心智慧实验室系统</div>
            <div class="project-role dark:text-blue-400">前端开发实习生</div>
            <div class="project-time dark:text-gray-400">2024.09 ~ 2024.12</div>
          </div>
          <div class="project-tech">
            <el-tag size="small" class="dark:!bg-gray-800 dark:!text-gray-200 dark:!border-gray-700"
              >React</el-tag
            >
            <el-tag size="small">Ant Design</el-tag>
            <el-tag size="small">Umi Max</el-tag>
            <el-tag size="small">Dva</el-tag>
            <el-tag size="small">TypeScript</el-tag>
          </div>
          <div class="project-content">
            <p class="desc dark:text-gray-300">
              参与浙江省疾控中心智慧实验室系统开发，该系统服务于全省 17
              个地市的疾控中心，主要功能是实验室样本管理、数据分析、报告生成等，实现实验室全流程数字化管理。
            </p>
            <div class="responsibilities">
              <h4 class="dark:text-gray-200">主要职责：</h4>
              <ul>
                <li class="dark:text-gray-300">
                  负责系统 4
                  个核心功能模块的前端开发，实现界面交互和数据对接，模块的整体代码覆盖率达到 85%
                </li>
                <li class="dark:text-gray-300">
                  优化系统性能，将页面首屏加载时间从 3 秒优化至 1.5 秒，提升用户体验
                </li>
                <li class="dark:text-gray-300">
                  重构部分历史代码，将代码重复率从 15%降低到 5%，提升系统可维护性
                </li>
              </ul>
            </div>
            <div class="achievements">
              <h4>项目成果：</h4>
              <ul>
                <li>开发的功能模块服务于 300+实验室工作人员的日常工作，月均处理数据 10 万+条</li>
                <li>编写的组件库被项目组采纳，提升团队开发效率 30%</li>
                <li>重构的代码减少了 40%的维护成本，获得项目经理好评</li>
                <li>制定前端开发规范文档，提升团队协作效率 20%</li>
                <li>系统上线后，用户操作效率提升 50%，差评率降低 60%</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="project-item">
          <div class="project-header">
            <div class="project-title">小兔鲜儿微信小程序</div>
            <div class="project-role">前端开发工程师</div>
            <div class="project-time">2025.01 ~ 2025.03</div>
          </div>
          <div class="project-tech">
            <el-tag size="small">Vue3</el-tag>
            <el-tag size="small">TS</el-tag>
            <el-tag size="small">UniApp</el-tag>
            <el-tag size="small">Pinia</el-tag>
          </div>
          <div class="project-content">
            <p class="desc">
              基于 uni-app
              开发的电商小程序项目，实现了完整的电商购物流程。作为个人开发者，独立完成项目从技术选型到功能实现的全过程，项目采用
              Vue3 + TypeScript 技术栈，注重代码质量和用户体验，目前已完成开发并进入测试阶段。
            </p>
            <div class="responsibilities">
              <h4>主要职责：</h4>
              <ul>
                <li>基于 Vite + TypeScript 搭建开发环境，使用 ESLint + Prettier 规范代码风格</li>
                <li>封装 http 请求工具，基于 Promise 封装 uni.request，实现请求响应拦截器</li>
                <li>使用 Pinia + persist 插件实现状态持久化，解决购物车等数据同步问题</li>
                <li>封装 XtxSwiper 轮播图组件，实现首页商品推荐、分类导航等功能</li>
                <li>基于 vk-data-goods-sku-popup 组件开发商品详情页，处理多规格商品选择</li>
                <li>实现购物车模块，支持商品选择、数量修改、规格切换等核心功能</li>
                <li>集成微信登录与支付功能，打通下单支付流程</li>
              </ul>
            </div>
            <div class="achievements">
              <h4>项目成果：</h4>
              <ul>
                <li>实现小程序分包加载，主包体积控制在 2MB 以内</li>
                <li>开发骨架屏组件，优化首页和商品列表的加载体验</li>
                <li>使用 Promise.all 处理首页并发请求，减少页面白屏时间</li>
                <li>采用虚拟列表处理商品列表，解决大数据量加载卡顿问题</li>
                <li>基于 uni-app 条件编译，成功适配 H5 和小程序两端</li>
                <li>完成项目核心功能开发，代码提交 20+次</li>
                <li>封装 XtxSwiper、XtxGuess 等 5 个业务组件，提升代码复用性</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="project-item">
          <div class="project-header">
            <div class="project-title">个人博客知识付费系统</div>
            <div class="project-role">独立开发者</div>
            <div class="project-time">2025.03 ~ 至今</div>
          </div>
          <div class="project-tech">
            <el-tag size="small">Vue3</el-tag>
            <el-tag size="small">TS</el-tag>
            <el-tag size="small">Element Plus</el-tag>
            <el-tag size="small">Pinia</el-tag>
            <el-tag size="small">Django</el-tag>
            <el-tag size="small">MySQL</el-tag>
          </div>
          <div class="project-content">
            <p class="desc">
              独立开发的知识付费博客平台，整合技术文章、视频教程和在线课程。通过博客内容营销引导用户付费观看技术视频教程，实现个人知识变现。
            </p>
            <div class="responsibilities">
              <h4>主要职责：</h4>
              <ul>
                <li>
                  独立完成从需求分析到上线部署的全过程，使用 Vue3 技术栈开发前端，Django 开发后端
                </li>
                <li>设计并实现会员订阅、内容付费等核心功能</li>
                <li>优化系统性能和 SEO，使平台在搜索引擎关键词排名前 10</li>
              </ul>
            </div>
            <div class="achievements">
              <h4>项目成果：</h4>
              <ul>
                <li>平台上线 3 个月内积累用户 1000+，付费会员转化率达 5%</li>
                <li>通过性能优化，使首屏加载时间控制在 1.2 秒内，跳出率降低 30%</li>
                <li>开发的音乐播放器组件在 GitHub 获得 100+ Star</li>
                <li>站点 SEO 优化后，自然流量提升 200%，降低获客成本 60%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 作品展示 -->
    <section class="section">
      <h2>作品展示</h2>
      <div class="works">
        <a href="https://github.com/ZhouYu2156" target="_blank" class="work-item">
          <i class="el-icon-link" />
          <span>Github</span>
        </a>
        <a href="https://www.zhouyu2156.cn:5173/" target="_blank" class="work-item">
          <i class="el-icon-link" />
          <span>毕设项目</span>
        </a>
        <a href="https://space.bilibili.com/431828034" target="_blank" class="work-item">
          <i class="el-icon-video-camera" />
          <span>Bilibili</span>
        </a>
        <a href="https://blog.csdn.net/qq_51738765" target="_blank" class="work-item">
          <i class="el-icon-notebook-2" />
          <span>CSDN博客</span>
        </a>
      </div>
    </section>

    <!-- 自我评价 -->
    <section class="section">
      <h2>自我评价</h2>
      <div class="self-evaluation">
        <ul>
          <li>热爱前端技术探索，经常阅读 Github 上的优秀源码，并进行学习和实践</li>
          <li>拥有优秀的团队协作和业务理解能力，能够快速融入团队上手项目开发</li>
          <li>具备良好的时间管理能力，能够合理安排时间，提高工作效率</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.resume-container {
  @apply max-w-[1000px] mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg dark:shadow-none rounded;
  font-size: 14px;

  .header {
    @apply mb-6;

    .main-info {
      @apply flex gap-8;

      .avatar-section {
        @apply text-center flex-shrink-0;

        h1 {
          @apply my-2 text-2xl text-gray-900 dark:text-white;
        }

        .tags {
          @apply flex gap-2 justify-center;
        }
      }

      .contact-section {
        @apply flex-grow grid grid-cols-2 gap-2;

        .contact-item {
          @apply flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm;

          .el-icon {
            @apply text-blue-500 dark:text-blue-400 text-base;
          }
        }
      }
    }
  }

  .section {
    @apply my-4;

    h2 {
      @apply text-lg text-gray-900 dark:text-white mb-3 relative pl-3;

      &::before {
        @apply content-[''] absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded;
      }
    }
  }

  .job-intention {
    .intention-grid {
      @apply grid grid-cols-4 gap-4;

      .intention-item {
        @apply bg-gray-50 dark:bg-gray-800 p-3 rounded;

        p {
          @apply text-gray-500 dark:text-gray-400 text-sm m-0;
        }

        h3 {
          @apply text-gray-900 dark:text-white font-medium mt-1;
        }
      }
    }
  }

  .education {
    @apply bg-gray-50 dark:bg-gray-800 p-3 rounded;

    .edu-header {
      @apply flex justify-between items-center mb-1;

      h3 {
        @apply text-base text-gray-900 dark:text-white m-0;
      }

      span {
        @apply text-gray-500 dark:text-gray-400 text-sm;
      }
    }

    p {
      @apply text-gray-600 dark:text-gray-300 text-sm my-1;
    }
  }

  .skills {
    .skill-category {
      @apply mb-6;

      h3 {
        @apply text-base text-gray-900 dark:text-white mb-3 relative pl-3;

        &::before {
          @apply content-[''] absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded;
        }
      }

      ul {
        @apply list-none p-0 m-0;

        li {
          @apply relative pl-4 mb-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed;

          &::before {
            @apply content-['•'] absolute left-0 text-blue-500;
          }

          &:last-child {
            @apply mb-0;
          }
        }
      }
    }
  }

  .projects {
    .project-item {
      @apply bg-gray-50 dark:bg-gray-800 p-3 rounded mb-4;

      &:last-child {
        @apply mb-0;
      }

      .project-header {
        @apply grid grid-cols-3 items-center gap-4 mb-3;

        .project-title {
          @apply text-base font-bold text-gray-900 dark:text-white;
        }

        .project-role {
          @apply text-sm text-blue-500 dark:text-blue-400 text-center;
        }

        .project-time {
          @apply text-sm text-gray-500 dark:text-gray-400 text-right;
        }
      }

      .project-tech {
        @apply flex flex-wrap gap-2 mb-3;
      }

      .project-content {
        .desc {
          @apply my-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed;
        }

        h4 {
          @apply text-gray-700 dark:text-gray-200 my-3 text-sm;
        }

        ul {
          @apply list-none p-0 m-0;

          li {
            @apply relative pl-4 mb-1 text-gray-600 dark:text-gray-300 text-sm leading-relaxed;

            &::before {
              @apply content-['•'] absolute left-0 text-blue-500;
            }

            &:last-child {
              @apply mb-0;
            }
          }
        }
      }
    }
  }

  .works {
    @apply grid grid-cols-4 gap-3;

    .work-item {
      @apply flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded no-underline text-gray-900 dark:text-gray-300 text-sm transition-all duration-300;

      &:hover {
        @apply bg-blue-50 dark:bg-gray-700 text-blue-500 dark:text-blue-400 -translate-y-0.5;
      }
    }
  }

  .self-evaluation {
    ul {
      @apply list-none p-0 m-0;

      li {
        @apply relative pl-4 mb-1 text-gray-600 dark:text-gray-300 text-sm leading-relaxed;

        &::before {
          @apply content-['•'] absolute left-0 text-blue-500;
        }

        &:last-child {
          @apply mb-0;
        }
      }
    }
  }
}

// Element Plus 组件暗色主题适配
:deep(.el-divider) {
  @apply dark:border-gray-700;
}

:deep(.el-tag) {
  @apply dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300;

  &.el-tag--success {
    @apply dark:bg-green-900/50 dark:border-green-800 dark:text-green-200;
  }
}
</style>
