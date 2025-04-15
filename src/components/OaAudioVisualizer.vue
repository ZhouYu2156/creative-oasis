<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Props 定义
interface Props {
  audio: HTMLAudioElement // 音频实例
  isPlaying: boolean // 播放状态
  currentTime: number // 当前播放时间
  showVisualizer?: boolean // 是否显示可视化效果
  analyser?: AnalyserNode | null // 音频分析器
}

const props = withDefaults(defineProps<Props>(), {
  showVisualizer: true,
})

// 可视化配置
const config = {
  barCount: 360, // 频谱条数量
  totalDegrees: 360, // 总角度
  barMinHeight: 2, // 最小高度
  radius: 100, // 外圆环半径
  innerRadius: 70, // 内圆环半径
  clockSize: 48, // 时钟字体大小
  gap: 2, // 频谱条间隔
}

// 性能优化相关变量
const lastDrawTime = ref(0)
const targetFPS = 30 // 限制帧率到 30fps
const frameInterval = 1000 / targetFPS
let dataArray: Uint8Array = new Uint8Array(0)
let animationFrame: number | undefined

// Canvas 相关
const visualizerCanvas = ref<HTMLCanvasElement | null>(null)
const canvasCtx = ref<CanvasRenderingContext2D | null>(null)

// 格式化时间显示
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 初始化音频分析器
const initAudioAnalyser = () => {
  // 预分配数组，避免频繁创建
  dataArray = new Uint8Array(props.analyser?.frequencyBinCount || 0)
}

// 初始化 Canvas
const initCanvas = () => {
  if (!visualizerCanvas.value) return

  const dpr = window.devicePixelRatio || 1
  const rect = visualizerCanvas.value.getBoundingClientRect()

  visualizerCanvas.value.width = rect.width * dpr
  visualizerCanvas.value.height = rect.height * dpr

  canvasCtx.value = visualizerCanvas.value.getContext('2d')
  if (canvasCtx.value) {
    canvasCtx.value.scale(dpr, dpr)
  }
}

// 绘制函数
const drawCircularSpectrum = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  if (!props.analyser || !ctx || !dataArray || !props.showVisualizer) return

  const actualWidth = width / (window.devicePixelRatio || 1)
  const actualHeight = height / (window.devicePixelRatio || 1)
  const centerX = actualWidth / 2
  const centerY = actualHeight / 2
  const scale = Math.min(centerX, centerY) * 0.8
  const outerRadius = scale
  const innerRadius = scale * 0.7

  // 获取频率数据
  props.analyser.getByteFrequencyData(dataArray)

  // 清除画布
  ctx.clearRect(0, 0, actualWidth, actualHeight)

  // 绘制时钟
  ctx.save()
  ctx.fillStyle = '#fff'
  ctx.font = `${config.clockSize}px FZHanZhenGuangBiao`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(formatTime(props.currentTime), centerX, centerY)
  ctx.restore()

  // 分别绘制外圈和内圈
  const drawRing = (radius: number, isInner: boolean) => {
    const freqStart = isInner ? 0.1 : 0.3
    const freqEnd = isInner ? 0.3 : 0.5
    const startFreq = Math.floor(dataArray.length * freqStart)
    const endFreq = Math.floor(dataArray.length * freqEnd)
    const usableFreqRange = endFreq - startFreq
    const degreesPerBar = config.totalDegrees / config.barCount

    ctx.save()
    ctx.translate(centerX, centerY)

    for (let i = 0; i < config.barCount; i += 2) {
      const freqIndex = startFreq + Math.floor((i / config.barCount) * usableFreqRange)
      const value = dataArray[freqIndex]

      const exp = isInner ? 1.5 : 1.2
      const normalizedValue = Math.pow(value / 255, exp)
      const barHeight = Math.max(normalizedValue * (radius * 0.3), config.barMinHeight)

      const angle = (i * degreesPerBar - 90) * (Math.PI / 180)
      const hue = ((i / config.barCount) * 300 + 30) % 360

      ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${isInner ? 0.6 : 0.8})`

      ctx.rotate(angle)
      const barWidth = Math.max(2, (2 * Math.PI * radius) / config.barCount - config.gap)
      ctx.fillRect(-barWidth / 2, -radius - barHeight, barWidth, barHeight)
      ctx.rotate(-angle)
    }
    ctx.restore()
  }

  drawRing(outerRadius, false)
  drawRing(innerRadius, true)
}

// 动画循环
const animate = (timestamp: number) => {
  if (!props.isPlaying || !props.showVisualizer || !props.analyser) return

  // 帧率控制
  if (timestamp - lastDrawTime.value < frameInterval) {
    animationFrame = requestAnimationFrame(animate)
    return
  }

  lastDrawTime.value = timestamp

  if (canvasCtx.value && visualizerCanvas.value) {
    drawCircularSpectrum(
      canvasCtx.value,
      visualizerCanvas.value.width,
      visualizerCanvas.value.height,
    )
  }

  animationFrame = requestAnimationFrame(animate)
}

// 监听播放状态
watch(
  () => props.isPlaying,
  async (playing) => {
    if (playing) {
      try {
        if (props.showVisualizer) {
          animate(0)
        }
      } catch (error) {
        console.error('Failed to resume audio context:', error)
      }
    } else {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  },
)

// 监听显示状态
watch(
  () => props.showVisualizer,
  (visible) => {
    if (visible && props.analyser) {
      nextTick(() => {
        initCanvas()
        initAudioAnalyser()
        if (props.isPlaying) {
          animate(0)
        }
      })
    } else {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  },
  { immediate: true },
)

// 组件挂载时初始化
onMounted(() => {
  nextTick(() => {
    initAudioAnalyser()
    if (props.showVisualizer) {
      initCanvas()
    }
    window.addEventListener('resize', initCanvas)
  })
})

// 组件卸载时清理
onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('resize', initCanvas)
})
</script>

<template>
  <div class="w-full h-full relative">
    <canvas ref="visualizerCanvas" class="w-full h-full absolute inset-0" />
  </div>
</template>
