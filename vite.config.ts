import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/creative-oasis/',
  plugins: [
    vue(),
    // vueDevTools(),
    // use unplugin-auto-import {  } from "module";
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })], // 自动导入ElementPlus的组件
      imports: ['vue', 'vue-router'], // 自动导入vue和vue-router
      dirs: [
        './src/api',
        './src/hooks',
        './src/stores',
        './src/types',
        './src/utils',
        './src/views',
      ], // 自动导入自定义的目录
      dts: './src/auto-imports.d.ts', // 生成的类型声明文件
    }),
    // use unplugin-vue-components
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        IconsResolver({
          prefix: 'icon', // 使用icon作为前缀
        }),
      ],
      // 指定组件目录，可以是多个目录
      dirs: ['./src/components'],
      // 自定义组件的命名规则
      extensions: ['vue'],
      // 自动导入组件的类型声明文件
      dts: './src/components.d.ts',
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
    }),
  ],
  /*server: {
    host: true,
    port: 5173,
    open: false
  },*/
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1024 * 2,
  },
  // use vite-plugin-windicss
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/element/index.scss" as *;
        `,
      },
    },
  },
})
