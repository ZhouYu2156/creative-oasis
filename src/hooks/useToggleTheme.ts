import { ref } from 'vue'

export function useToggleTheme () {
  /**
   * 是否为暗黑主题
   */
  const isDark = ref(false)

  // 初始化主题
  const initTheme = () => {
    // 优先使用 localStorage 中保存的主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 如果没有保存的主题，则使用系统主题
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    // 同步 DOM
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  // 立即初始化主题，不等待组件挂载
  initTheme()

  const enableTransitions = () =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches

  const toggleTheme = async (event: MouseEvent) => {
    const x = event.clientX
    const y = event.clientY

    if (!enableTransitions()) {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
      return
    }

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
    ]

    await document.startViewTransition(async () => {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }).ready

    document.documentElement.animate(
      { clipPath: isDark.value ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
      },
    )
  }

  return {
    isDark,
    toggleTheme,
  }
}
