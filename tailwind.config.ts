import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 暗黑模式, 在类名中编写暗黑模式下的样式，然后通过html根元素添加dark类名即可控制模式切换主题。
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '200': '#bbf7d0',
          '300': '#86efac',
          '400': '#4ade80',
          '500': '#16c557',
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#14532d'
        },
        dark: {
          'bg': '#111827',
          'card': '#1f2937'
        }
      },
      fontFamily: {
        FZHanZhenGuangBiao: ['FZHanZhenGuangBiao'],
        ZKKuaiLeTi: ['ZKKuaiLeTi'],
        PingFangSC: ['PingFangSC'],
      }
    },
  },
  plugins: [],
} satisfies Config

