
//导入 element plus 的所有 sass 样式进行编译
import "element-plus/theme-chalk/src/index.scss"
// 引入element-plus的暗黑主题css变量
import 'element-plus/theme-chalk/dark/css-vars.css'
// 导入额外的自定义样式
import './assets/main.scss'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(pinia)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(router)

app.mount('#app')
