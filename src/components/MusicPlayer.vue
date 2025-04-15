<script setup lang="ts">
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import OaAudioVisualizer from './OaAudioVisualizer.vue'

// 音乐对象数据结构
export interface Music {
  id: string
  singer: string
  songName: string
  cover: string
  play_url: string
  lyrics: string
}

// 音频上下文管理器
const audioContextManager = {
  context: null as AudioContext | null,
  source: null as MediaElementAudioSourceNode | null,
  analyser: null as AnalyserNode | null,
  initialized: false,

  initialize(audio: HTMLAudioElement) {
    if (this.initialized) return this.analyser

    try {
      this.context = new AudioContext()
      this.source = this.context.createMediaElementSource(audio)
      this.analyser = this.context.createAnalyser()
      this.analyser.fftSize = 1024
      this.analyser.smoothingTimeConstant = 0.8

      this.source.connect(this.analyser)
      this.analyser.connect(this.context.destination)

      this.initialized = true
      return this.analyser
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
      return null
    }
  },

  resume() {
    return this.context?.resume()
  },

  cleanup() {
    if (this.source) {
      this.source.disconnect()
      this.source = null
    }
    if (this.analyser) {
      this.analyser.disconnect()
      this.analyser = null
    }
    if (this.context) {
      this.context.close()
      this.context = null
    }
    this.initialized = false
  },
}

// 音效图标组件
const AudioEffectIcons = {
  none: `<svg viewBox="0 0 24 24" class="w-5 h-5">
    <path fill="currentColor" d="M12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8m0-2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>`,
  equalizer: `<svg viewBox="0 0 24 24" class="w-5 h-5">
    <path fill="currentColor" d="M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z"/>
  </svg>`,
  reverb: `<svg viewBox="0 0 24 24" class="w-5 h-5">
    <path fill="currentColor" d="M12 3v18c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-2 0C6.48 3 3 6.48 3 12s3.48 9 7 9V3z"/>
  </svg>`,
  chorus: `<svg viewBox="0 0 24 24" class="w-5 h-5">
    <path fill="currentColor" d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
  </svg>`,
  distortion: `<svg viewBox="0 0 24 24" class="w-5 h-5">
    <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>`,
  delay: `<svg viewBox="0 0 24 24" class="w-5 h-5">
    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>`,
}

// 音频效果器管理
const audioEffects = {
  equalizer: null as BiquadFilterNode | null,
  reverb: null as ConvolverNode | null,
  chorus: null as DelayNode[] | null,
  distortion: null as WaveShaperNode | null,
  delay: null as DelayNode[] | null,

  // 初始化效果器
  initialize(context: AudioContext) {
    // 均衡器 - 3段均衡，突出人声和高频
    this.equalizer = context.createBiquadFilter()
    this.equalizer.type = 'peaking'
    this.equalizer.frequency.value = 2500 // 提升到2.5kHz，更突出人声
    this.equalizer.Q.value = 2.5 // 更窄的Q值，让效果更明显
    this.equalizer.gain.value = 12 // 大幅提升增益

    // 混响 - 更长的衰减时间和更复杂的脉冲响应
    this.reverb = context.createConvolver()
    this.createReverbImpulse(context).then((buffer) => {
      if (this.reverb) this.reverb.buffer = buffer
    })

    // 合唱 - 使用多重延迟线创造更厚重的效果
    this.chorus = [context.createDelay(), context.createDelay(), context.createDelay()]
    this.chorus.forEach((delay, i) => {
      delay.delayTime.value = 0.03 + i * 0.01 // 错开的延迟时间
    })

    // 失真 - 更温和的失真曲线
    this.distortion = context.createWaveShaper()
    const gainNode = context.createGain() // 创建增益节点控制失真后的音量
    gainNode.gain.value = 0.5 // 将音量降低到一半
    this.distortion.curve = this.createDistortionCurve(200) // 降低失真度
    this.distortion.oversample = '4x'

    // 延迟 - 单个延迟，更简单的效果
    this.delay = [context.createDelay()]
    this.delay[0].delayTime.value = 0.3 // 300ms 延迟
  },

  // 创建更温和的失真曲线
  createDistortionCurve(amount: number) {
    const samples = 44100
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180

    for (let i = 0; i < samples; ++i) {
      const x = (i * 2) / samples - 1
      // 使用更温和的失真算法
      curve[i] = Math.tanh(amount * x * 0.5) // 减小失真强度
    }
    return curve
  },

  // 创建更复杂的混响效果
  async createReverbImpulse(context: AudioContext) {
    const length = context.sampleRate * 4 // 4秒的混响时间
    const decay = 3.5 // 更长的衰减
    const buffer = context.createBuffer(2, length, context.sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        // 添加初始反射和后期混响
        const t = i / context.sampleRate
        const amplitude = Math.exp(-t * decay)
        // 添加正弦波调制以增加空间感
        const modulation = Math.sin(t * 10) * 0.3
        channelData[i] = (Math.random() * 2 - 1) * amplitude * (1 + modulation)
      }
    }
    return buffer
  },

  // 清理效果器
  cleanup() {
    if (this.equalizer) {
      this.equalizer.disconnect()
      this.equalizer = null
    }
    if (this.reverb) {
      this.reverb.disconnect()
      this.reverb = null
    }
    if (this.chorus) {
      this.chorus.forEach((delay) => delay.disconnect())
      this.chorus = null
    }
    if (this.distortion) {
      this.distortion.disconnect()
      this.distortion = null
    }
    if (this.delay) {
      this.delay.forEach((delay) => delay.disconnect())
      this.delay = null
    }
  },
}

// ------------------- 基础状态定义 -------------------
// 组件内部状态
const currentMusic = ref<Music | null>(null)
const isPlaying = ref(false)
const playMode = ref(1) // 1-顺序播放，2-随机播放，3-单曲循环
const showVolumePanel = ref(false)
const volume = ref(30)

// 播放模式枚举
const PlayMode = {
  ORDER: 1, // 顺序播放
  RANDOM: 2, // 随机播放
  SINGLE: 3, // 单曲循环
} as const

// ------------------- 播放历史管理 -------------------
// 从 localStorage 获取播放历史
const HISTORY_KEY = 'music_play_history'
const playHistory = ref<Music[]>(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'))

// 监听播放历史变化并保存
watch(
  playHistory,
  (newHistory) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  },
  { deep: true },
)

// ------------------- 音频实例与进度管理 -------------------
// 音频实例
const audio = ref<HTMLAudioElement>(new Audio())
audio.value.crossOrigin = 'anonymous'

// 播放进度相关状态
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)

// 添加缓冲进度状态
const bufferProgress = ref(0)

// 添加拖动状态
const isDragging = ref(false)

// 格式化时间显示
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 字体选项
const fontOptions = [
  { label: '系统默认', value: '' },
  { label: '方正汉真广标', value: 'font-["FZHanZhenGuangBiao"]' },
  { label: '站酷快乐体', value: 'font-["ZKKuaiLeTi"]' },
  { label: '苹方简体', value: 'font-["PingFangSC"]' },
]

// 当前选择的字体
const currentFont = ref('')

// 切换字体
const changeFont = (font: string) => {
  currentFont.value = font
}

// ------------------- 音频事件监听 -------------------
onMounted(() => {
  // 确保在组件挂载时就初始化音频分析器
  nextTick(() => {
    audioContextManager.initialize(audio.value)
  })

  // 音频播放事件
  audio.value.addEventListener('play', () => {
    isPlaying.value = true
    audioContextManager.resume()
  })

  // 音频暂停事件
  audio.value.addEventListener('pause', () => {
    isPlaying.value = false
  })

  // 音频结束事件
  audio.value.addEventListener('ended', () => {
    switch (playMode.value) {
      case PlayMode.SINGLE:
        // 单曲循环：重新播放当前歌曲
        audio.value.currentTime = 0
        audio.value.play()
        break
      case PlayMode.RANDOM:
        // 随机播放：随机选择一首歌曲
        if (playHistory.value.length > 1) {
          const currentIndex = playHistory.value.findIndex(
            (item) => item.id === currentMusic.value?.id,
          )
          let randomIndex
          do {
            randomIndex = Math.floor(Math.random() * playHistory.value.length)
          } while (randomIndex === currentIndex && playHistory.value.length > 1)
          playMusic(playHistory.value[randomIndex])
        }
        break
      case PlayMode.ORDER:
      default:
        // 顺序播放：播放下一首
        handleNext()
        break
    }
  })

  // 设置初始音量
  audio.value.volume = volume.value / 100

  // 监听播放进度更新
  audio.value.addEventListener('timeupdate', () => {
    if (audio.value.buffered.length > 0) {
      bufferProgress.value =
        (audio.value.buffered.end(audio.value.buffered.length - 1) / audio.value.duration) * 100
    }
    currentTime.value = audio.value.currentTime
    duration.value = audio.value.duration
    if (!isDragging.value) {
      progress.value = (audio.value.currentTime / audio.value.duration) * 100 || 0
    }
  })

  // 监听音频加载完成
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration
  })

  // 监听缓冲进度
  audio.value.addEventListener('progress', () => {
    if (audio.value.buffered.length > 0) {
      bufferProgress.value =
        (audio.value.buffered.end(audio.value.buffered.length - 1) / audio.value.duration) * 100
    }
  })
})

// 监听音乐变化时重新初始化分析器
watch(
  () => currentMusic.value,
  () => {
    if (!audioContextManager.initialized) {
      nextTick(() => {
        audioContextManager.initialize(audio.value)
      })
    }
  },
)

// 清理事件监听
onBeforeUnmount(() => {
  audio.value.pause()
  audio.value.src = ''
  audio.value.remove()
  audioContextManager.cleanup()
})

// ------------------- 播放控制功能 -------------------
// 播放指定音乐
const playMusic = async (music: Music) => {
  currentMusic.value = music
  audio.value.src = music.play_url
  audio.value.preload = 'auto' // 自动预加载(不设置也可以实现了，但是保险起见吧)
  audio.value.autoplay = true // 资源加载的优先级高于preload
  // audio.value.play()

  // 更新播放历史
  const existingIndex = playHistory.value.findIndex((item) => item.id === music.id)
  if (existingIndex !== -1) {
    if (existingIndex !== 0) {
      const [removedMusic] = playHistory.value.splice(existingIndex, 1)
      playHistory.value.unshift(removedMusic)
    }
  } else {
    if (playHistory.value.length >= 50) {
      playHistory.value.pop()
    }
    playHistory.value.unshift(music)
  }
}

// 处理播放/暂停
const handlePlayPause = () => {
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
}

// 处理上一首
const handlePrev = () => {
  if (!playHistory.value.length) return

  if (playMode.value === PlayMode.RANDOM) {
    // 随机播放模式
    const currentIndex = playHistory.value.findIndex((item) => item.id === currentMusic.value?.id)
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * playHistory.value.length)
    } while (randomIndex === currentIndex && playHistory.value.length > 1)
    playMusic(playHistory.value[randomIndex])
  } else {
    // 顺序播放模式
    const currentIndex = playHistory.value.findIndex((item) => item.id === currentMusic.value?.id)
    const prevIndex =
      currentIndex === -1 || currentIndex === playHistory.value.length - 1 ? 0 : currentIndex + 1
    playMusic(playHistory.value[prevIndex])
  }
}

// 处理下一首
const handleNext = () => {
  if (!playHistory.value.length) return

  if (playMode.value === PlayMode.RANDOM) {
    // 随机播放模式
    const currentIndex = playHistory.value.findIndex((item) => item.id === currentMusic.value?.id)
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * playHistory.value.length)
    } while (randomIndex === currentIndex && playHistory.value.length > 1)
    playMusic(playHistory.value[randomIndex])
  } else {
    // 顺序播放模式
    const currentIndex = playHistory.value.findIndex((item) => item.id === currentMusic.value?.id)
    const nextIndex =
      currentIndex === -1 || currentIndex === 0 ? playHistory.value.length - 1 : currentIndex - 1
    playMusic(playHistory.value[nextIndex])
  }
}

// 切换播放模式
const togglePlayMode = () => {
  playMode.value = (playMode.value % 3) + 1
}

// ------------------- 进度条控制 -------------------
// 修改进度条控制部分
const handleProgressChange = (event: MouseEvent) => {
  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)

  if (audio.value.duration) {
    const newTime = percent * audio.value.duration
    audio.value.currentTime = newTime
  }
}

// 修改拖动结束处理
const handleDragEnd = (event: MouseEvent) => {
  if (!isDragging.value) return

  isDragging.value = false
  handleProgressChange(event)
  // 如果之前是播放状态，或者当前是播放状态，都应该继续播放
  if (isPlaying.value || audio.value.paused === false) {
    audio.value.play()
  }
}

// 修改拖动开始处理
const handleDragStart = () => {
  isDragging.value = true
  // 记录当前播放状态，但不暂停播放
  // audio.value.pause() // 移除这行
}

// 添加拖动中处理
const handleDragging = (event: MouseEvent) => {
  if (!isDragging.value) return

  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
  progress.value = percent * 100
}

// ------------------- 音量控制 -------------------
const toggleVolumePanel = () => {
  showVolumePanel.value = !showVolumePanel.value
}

const handleVolumeChange = (val: number) => {
  volume.value = val
  audio.value.volume = val / 100
}

// 点击外部关闭音量面板
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.volume-control')) {
    showVolumePanel.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ------------------- 播放列表控制 -------------------
const showPlaylist = ref(false)
const togglePlaylist = () => {
  showPlaylist.value = !showPlaylist.value
}

// 添加移除音乐的方法
const removeFromHistory = (musicId: string, event: MouseEvent) => {
  // 阻止事件冒泡，避免触发播放
  event.stopPropagation()

  // 从播放历史中移除
  const index = playHistory.value.findIndex((item) => item.id === musicId)
  if (index !== -1) {
    playHistory.value.splice(index, 1)
  }

  // 如果移除的是当前播放的音乐，且还有其他音乐，则播放下一首
  if (currentMusic.value?.id === musicId && playHistory.value.length > 0) {
    playMusic(playHistory.value[0])
  }
}

// ------------------- 歌词管理 -------------------
interface LyricLine {
  time: number
  text: string
}

const lyrics = ref<LyricLine[]>([])
const currentLyricIndex = ref(-1)
const lyricContainerRef = ref<HTMLElement>()
const showLyrics = ref(false)

// 解析歌词
const parseLyrics = (lyricsText: string) => {
  const lines = lyricsText.split('\n')
  const result: LyricLine[] = []

  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2})\]/

  lines.forEach((line) => {
    const match = timeRegex.exec(line)
    if (match) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const centiseconds = parseInt(match[3])
      const time = minutes * 60 + seconds + centiseconds / 100
      const text = line.replace(timeRegex, '').trim()
      if (text) {
        result.push({ time, text })
      }
    }
  })

  return result.sort((a, b) => a.time - b.time)
}

// 更新当前歌词索引
const updateCurrentLyric = () => {
  if (!lyrics.value.length) return

  const currentTime = audio.value.currentTime
  let index = lyrics.value.findIndex((lyric) => lyric.time > currentTime)

  if (index === -1) {
    index = lyrics.value.length
  }
  currentLyricIndex.value = index - 1

  // 滚动到当前歌词
  scrollToCurrentLyric()
}

// 切换歌词显示
const toggleLyrics = () => {
  showLyrics.value = !showLyrics.value
}

// 修改原来的滚动函数，只在播放过程中使用平滑滚动
const scrollToCurrentLyric = () => {
  if (!lyricContainerRef.value) return

  const currentLyricElement = lyricContainerRef.value.querySelector('.current-lyric')
  if (currentLyricElement) {
    const container = lyricContainerRef.value
    const elementTop = (currentLyricElement as HTMLElement).offsetTop
    const containerHeight = container.clientHeight
    const targetScrollTop = elementTop - containerHeight / 2 + currentLyricElement.clientHeight / 2

    // 只在非切换显示时使用平滑滚动
    container.scrollTo({
      top: targetScrollTop,
      behavior: showLyrics.value ? 'smooth' : 'instant',
    })
  }
}

// 监听音乐变化
watch(
  () => currentMusic.value,
  (newMusic) => {
    if (newMusic?.lyrics) {
      lyrics.value = parseLyrics(newMusic.lyrics)
      currentLyricIndex.value = -1
      showLyrics.value = true
    } else {
      lyrics.value = []
      showLyrics.value = false
    }
  },
  { immediate: true },
)

// 监听播放进度更新歌词
watch(
  () => currentTime.value,
  () => {
    updateCurrentLyric()
  },
)

// Tooltip 默认配置
interface TooltipConfig {
  showAfter: number
  hideAfter: number
  trigger: 'hover' | 'click' | 'focus' | 'contextmenu'
  placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
}

// 组件 Props 定义
interface Props {
  tooltipConfig?: Partial<TooltipConfig>
}

const props = withDefaults(defineProps<Props>(), {
  tooltipConfig: () => ({
    showAfter: 300,
    hideAfter: 500,
    trigger: 'hover',
    placement: 'top',
  }),
})

// ------------------- 对外暴露接口 -------------------
defineExpose({
  playMusic,
  pause() {
    audio.value.pause()
  },
  resume() {
    audio.value.play()
  },
  getPlayHistory: () => playHistory.value,
})

// 清空播放列表
const clearPlayHistory = () => {
  ElMessageBox.confirm('确定要清空播放列表吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    playHistory.value = []
    currentMusic.value = null
    if (audio.value) {
      audio.value.pause()
      audio.value.currentTime = 0
    }
    isPlaying.value = false
  })
}

// 处理下载
const handleDownload = async (song: Music) => {
  try {
    // 创建进度提示
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在下载: 0%',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    // 获取音乐文件
    const response = await fetch(song.play_url)
    const contentLength = Number(response.headers.get('content-length'))
    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error('无法读取文件流')
    }

    // 读取数据流
    const chunks: Uint8Array[] = []
    let receivedLength = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      receivedLength += value.length

      // 更新进度
      const progress = ((receivedLength / contentLength) * 100).toFixed(1)
      loadingInstance.setText(`正在下载: ${progress}%`)
    }

    // 合并数据块
    const blob = new Blob(chunks, { type: 'audio/mpeg' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl

    // 设置下载文件名: 歌手-歌名.mp3，处理特殊字符
    const fileName = `${song.singer}-${song.songName}.mp3`.replace(/[<>:"/\\|?*]+/g, '_')
    link.download = fileName

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
    loadingInstance.close()

    ElMessage.success({
      message: '下载成功！',
      duration: 2000,
    })
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error({
      message: '下载失败，请稍后重试',
      duration: 2000,
    })
  }
}

// 音效选项
const effectOptions = [
  { value: 'none', label: '关闭音效', icon: AudioEffectIcons.none },
  { value: 'equalizer', label: '均衡器', icon: AudioEffectIcons.equalizer },
  { value: 'reverb', label: '混响', icon: AudioEffectIcons.reverb },
  { value: 'chorus', label: '合唱', icon: AudioEffectIcons.chorus },
  { value: 'distortion', label: '失真', icon: AudioEffectIcons.distortion },
  { value: 'delay', label: '延迟', icon: AudioEffectIcons.delay },
]

// 音效状态
const currentEffect = ref<'none' | 'equalizer' | 'reverb' | 'chorus' | 'distortion' | 'delay'>(
  'none',
)

// 切换音效
const toggleAudioEffect = (effect: typeof currentEffect.value) => {
  if (!audioContextManager.context || !audioContextManager.source) return

  // 断开之前的连接
  audioContextManager.source.disconnect()

  // 断开所有效果器
  const nodes = [
    audioEffects.equalizer,
    audioEffects.reverb,
    ...(audioEffects.chorus || []),
    audioEffects.distortion,
    ...(audioEffects.delay || []),
  ]
  nodes.forEach((node) => node?.disconnect())

  // 初始化效果器(如果需要)
  if (!audioEffects.equalizer) {
    audioEffects.initialize(audioContextManager.context)
  }

  // 应用选中的音效
  if (effect === 'none') {
    audioContextManager.source.connect(audioContextManager.analyser!)
    currentEffect.value = 'none'
    ElMessage.success('已关闭音效')
  } else {
    switch (effect) {
      case 'equalizer':
        if (audioEffects.equalizer) {
          audioContextManager.source.connect(audioEffects.equalizer)
          audioEffects.equalizer.connect(audioContextManager.analyser!)
        }
        break
      case 'reverb':
        if (audioEffects.reverb) {
          audioContextManager.source.connect(audioEffects.reverb)
          audioEffects.reverb.connect(audioContextManager.analyser!)
        }
        break
      case 'chorus':
        if (audioEffects.chorus) {
          // 并联连接多个延迟线
          audioEffects.chorus.forEach((delay) => {
            audioContextManager.source!.connect(delay)
            delay.connect(audioContextManager.analyser!)
          })
          // 直接连接一部分原声
          audioContextManager.source.connect(audioContextManager.analyser!)
        }
        break
      case 'distortion':
        if (audioEffects.distortion) {
          audioContextManager.source.connect(audioEffects.distortion)
          audioEffects.distortion.connect(audioContextManager.analyser!)
        }
        break
      case 'delay':
        if (audioEffects.delay) {
          // 使用单个延迟线
          audioContextManager.source.connect(audioEffects.delay[0])
          audioEffects.delay[0].connect(audioContextManager.analyser!)
          // 添加一些直接声音
          audioContextManager.source.connect(audioContextManager.analyser!)
        }
        break
    }
    currentEffect.value = effect
    ElMessage.success(`已开启${effectOptions.find((opt) => opt.value === effect)?.label}`)
  }
}

// 组件卸载时清理音效
onBeforeUnmount(() => {
  audioEffects.cleanup()
})
</script>

<template>
  <!-- 歌词展示 -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full">
    <div
      v-if="showLyrics && currentMusic"
      class="fixed inset-0 bottom-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl overflow-hidden"
      style="z-index: 99">
      <!-- 背景图 -->
      <div
        class="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20 blur-2xl"
        :style="{ backgroundImage: `url(${currentMusic?.cover})` }" />

      <!-- 主容器：使用网格布局 -->
      <div
        class="relative h-full grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 scroll-smooth overflow-auto">
        <!-- 左侧：音频可视化区域 -->
        <div class="hidden lg:flex items-center justify-center">
          <div
            class="w-full max-w-lg aspect-square rounded-lg bg-black/5 dark:bg-black/35 backdrop-blur-md relative overflow-hidden">
            <!-- 封面图片 -->
            <div
              v-if="!isPlaying && currentMusic"
              class="absolute inset-0 flex items-center justify-center group">
              <img
                :src="currentMusic.cover"
                :alt="currentMusic.songName"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />

              <!-- 装饰性圆环 -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-[102%] h-[102%] rounded-full border-2 border-white/10 animate-spin-slow"></div>
                <div class="absolute w-[104%] h-[104%] rounded-full border border-white/5"></div>
              </div>

              <!-- 悬浮遮罩 -->
              <div
                class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <!-- 顶部歌曲信息 -->
                <div
                  class="absolute top-0 inset-x-0 p-6 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 text-white/90 bg-gradient-to-b from-black/80 to-transparent">
                  <h3 class="text-xl font-bold mb-1">{{ currentMusic.songName }}</h3>
                  <p class="text-sm opacity-80">{{ currentMusic.singer }}</p>
                </div>

                <!-- 中间播放按钮 -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="transform transition-all duration-500 scale-90 group-hover:scale-100 group-hover:cursor-pointer relative">
                    <!-- 播放按钮背景光晕 -->
                    <div
                      class="absolute inset-0 bg-white/10 rounded-full blur-xl scale-150 animate-pulse-slow"></div>
                    <!-- 播放按钮 -->
                    <div
                      class="relative bg-white/10 backdrop-blur-sm rounded-full p-4 hover:bg-white/20 transition-colors">
                      <el-icon class="play-icon-large" @click="handlePlayPause">
                        <VideoPlay />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 音频可视化 -->
            <OaAudioVisualizer
              v-if="isPlaying && audioContextManager.analyser"
              :audio="audio"
              :is-playing="isPlaying"
              :current-time="currentTime"
              :show-visualizer="showLyrics"
              :analyser="audioContextManager.analyser" />
          </div>
        </div>

        <!-- 右侧：歌词区域 -->
        <div
          ref="lyricContainerRef"
          class="relative h-full overflow-hidden"
          :class="[currentFont]"
          style="
            mask-image: linear-gradient(
              to bottom,
              transparent 0%,
              black 25%,
              black 75%,
              transparent 100%
            );
          ">
          <div class="max-w-2xl mx-auto">
            <!-- 顶部占位，确保第一句歌词可以居中 -->
            <div class="h-[45vh]"></div>
            <!-- 歌词列表 -->
            <div
              v-for="(line, index) in lyrics"
              :key="index"
              class="text-center transition-all duration-500 h-16 flex items-center justify-center relative"
              :class="{
                'current-lyric': index === currentLyricIndex,
                'text-gray-600 dark:text-indigo-200 opacity-60': index !== currentLyricIndex,
              }">
              <span
                class="transform-gpu transition-all duration-500 px-4 py-1 relative text-base"
                :class="{
                  'current-lyric-text animate-lyric-glow dark:animate-lyric-glow-dark':
                    index === currentLyricIndex,
                }">
                {{ line.text }}
              </span>
            </div>
            <!-- 底部占位，确保最后一句歌词可以居中 -->
            <div class="h-[45vh]"></div>
          </div>
        </div>
      </div>

      <!-- 关闭按钮 -->
      <button
        class="absolute top-4 right-4 p-2 rounded-full bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors flex justify-center w-8 h-8"
        @click="toggleLyrics">
        <el-icon class="text-xl">
          <Close />
        </el-icon>
      </button>
    </div>
  </Transition>

  <!-- 现有的播放器面板代码 -->
  <div
    class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50 shadow-lg transform transition-transform duration-300"
    :class="[currentMusic ? 'translate-y-0' : 'translate-y-full']"
    style="z-index: 100">
    <!-- 向父组件传递当前播放状态 -->
    <slot name="current-music" :current-music="currentMusic" :is-playing="isPlaying" />

    <!-- 进度条 -->
    <div
      class="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer group"
      @click="handleProgressChange"
      @mousedown="handleDragStart"
      @mousemove="handleDragging"
      @mouseup="handleDragEnd"
      @mouseleave="handleDragEnd">
      <!-- 缓冲进度条 -->
      <div
        class="absolute top-0 left-0 h-full bg-gray-300 dark:bg-gray-600 transition-all duration-300"
        :style="{ width: `${bufferProgress}%` }" />

      <!-- 播放进度条 -->
      <div
        class="absolute top-0 left-0 h-full bg-primary-500"
        :class="{ 'transition-all duration-300': !isDragging }"
        :style="{ width: `${progress}%` }" />

      <!-- 进度指示器 -->
      <div
        class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100"
        :class="{ 'transition-all duration-300': !isDragging }"
        :style="{ left: `${progress - 0.05}%` }" />
    </div>

    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between gap-4">
        <!-- 左侧：音乐信息 -->
        <div class="flex items-center space-x-4 min-w-0 flex-1 relative">
          <!-- 封面大小调整，小屏幕更小 -->
          <div
            class="h-12 sm:h-16 aspect-square relative cursor-pointer group"
            @click="toggleLyrics">
            <img
              :src="currentMusic?.cover"
              :alt="currentMusic?.songName"
              class="h-full w-full object-cover rounded" />
            <!-- 悬浮动画箭头 -->
            <div
              class="absolute inset-0 bg-black/[55%] opacity-65 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
              <div class="text-white/90">
                <div v-if="showLyrics" class="flex flex-col items-center">
                  <el-icon class="text-base sm:text-lg animate-bounce-1"><ArrowDown /></el-icon>
                  <el-icon class="text-base sm:text-lg animate-bounce-2"><ArrowDown /></el-icon>
                </div>
                <div v-else class="flex flex-col items-center">
                  <el-icon class="text-base sm:text-lg animate-bounce-2"><ArrowUp /></el-icon>
                  <el-icon class="text-base sm:text-lg animate-bounce-1"><ArrowUp /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- 歌曲信息文字大小调整 -->
          <div class="min-w-0">
            <h3 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
              {{ currentMusic?.songName || '未播放' }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ currentMusic?.singer || '未知歌手' }}
            </p>
          </div>
        </div>

        <!-- 中间：播放控制 -->
        <div class="flex items-center justify-center gap-4 sm:gap-6 flex-1">
          <!-- 播放模式 -->
          <el-tooltip
            :content="playMode === 1 ? '顺序播放' : playMode === 2 ? '随机播放' : '单曲循环'"
            v-bind="props.tooltipConfig">
            <button class="control-btn group" @click="togglePlayMode">
              <el-icon class="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                <component
                  :is="
                    playMode === PlayMode.ORDER
                      ? 'Sort'
                      : playMode === PlayMode.RANDOM
                        ? 'Position'
                        : 'RefreshRight'
                  " />
              </el-icon>
            </button>
          </el-tooltip>

          <!-- 上一首 -->
          <el-tooltip content="上一首" v-bind="props.tooltipConfig">
            <button class="control-btn group" @click="handlePrev">
              <el-icon class="text-2xl group-hover:scale-110 transition-transform">
                <Back />
              </el-icon>
            </button>
          </el-tooltip>

          <!-- 播放/暂停 -->
          <el-tooltip :content="isPlaying ? '暂停' : '播放'" v-bind="props.tooltipConfig">
            <button
              class="w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              @click="handlePlayPause">
              <el-icon class="text-2xl">
                <component :is="isPlaying ? 'VideoPause' : 'VideoPlay'" />
              </el-icon>
            </button>
          </el-tooltip>

          <!-- 下一首 -->
          <el-tooltip content="下一首" v-bind="props.tooltipConfig">
            <button class="control-btn group" @click="handleNext">
              <el-icon class="text-2xl group-hover:scale-110 transition-transform">
                <Right />
              </el-icon>
            </button>
          </el-tooltip>

          <!-- 歌词和播放列表按钮 -->
          <div class="flex items-center gap-2">
            <!-- 歌词按钮 -->
            <el-tooltip content="歌词" v-bind="props.tooltipConfig">
              <button class="control-btn group" @click="toggleLyrics">
                <el-icon class="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  <component :is="showLyrics ? 'DocumentDelete' : 'Document'" />
                </el-icon>
              </button>
            </el-tooltip>

            <!-- 播放列表按钮 -->
            <el-tooltip content="播放列表" v-bind="props.tooltipConfig">
              <button class="control-btn group relative" @click="togglePlaylist">
                <el-icon class="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  <component :is="showPlaylist ? 'Fold' : 'Expand'" />
                </el-icon>
                <span
                  v-if="playHistory.length"
                  class="absolute -top-1 -right-1 min-w-4 h-4 text-xs leading-4 px-1 rounded-full bg-primary-500 text-white">
                  {{ playHistory.length }}
                </span>
              </button>
            </el-tooltip>
          </div>
        </div>

        <!-- 右侧：音量和字体控制 -->
        <div class="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
          <!-- 时间显示 -->
          <div class="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
            <span>{{ formatTime(currentTime) }}</span>
            <span class="mx-1">/</span>
            <span>{{ formatTime(duration) }}</span>
          </div>

          <!-- 字体切换按钮 -->
          <div class="relative">
            <el-tooltip content="切换字体" v-bind="props.tooltipConfig">
              <el-dropdown @command="changeFont" trigger="click">
                <button class="control-btn">
                  <el-icon class="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                    <Edit />
                  </el-icon>
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="font in fontOptions"
                      :key="font.value"
                      :command="font.value"
                      :class="[
                        font.value,
                        currentFont === font.value
                          ? 'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'hover:text-primary-500 dark:hover:text-primary-400',
                      ]">
                      <div class="flex items-center gap-2">
                        <span :class="font.value">{{ font.label }}</span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </div>

          <!-- 音量控制 -->
          <div class="group relative volume-control">
            <el-tooltip content="音量控制" v-bind="props.tooltipConfig">
              <button class="control-btn" @click.stop="toggleVolumePanel">
                <el-icon class="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  <component :is="volume === 0 ? 'Mute' : 'Microphone'" />
                </el-icon>
              </button>
            </el-tooltip>
            <!-- 音量滑块 -->
            <div
              v-show="showVolumePanel"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-12 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-4 flex justify-center z-50">
              <el-slider
                v-model="volume"
                vertical
                height="100px"
                :min="0"
                :max="100"
                :step="1"
                @input="(val: number | number[]) => handleVolumeChange(Number(val))" />
            </div>
          </div>

          <!-- 下载按钮 -->
          <el-tooltip content="下载" v-bind="props.tooltipConfig">
            <button class="control-btn" @click="() => handleDownload(currentMusic as Music)">
              <el-icon class="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                <Download />
              </el-icon>
            </button>
          </el-tooltip>

          <!-- 音效 -->
          <el-dropdown trigger="click" @command="toggleAudioEffect">
            <button class="control-btn" :class="{ 'text-primary-500': currentEffect !== 'none' }">
              <el-tooltip :content="'音效切换'" v-bind="props.tooltipConfig">
                <el-icon class="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  <div
                    v-html="effectOptions.find((opt) => opt.value === currentEffect)?.icon"></div>
                </el-icon>
              </el-tooltip>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="option in effectOptions"
                  :key="option.value"
                  :command="option.value"
                  :class="{ 'text-primary-500': currentEffect === option.value }">
                  <div class="flex items-center gap-2">
                    <div v-html="option.icon"></div>
                    <span>{{ option.label }}</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 播放列表面板 -->
    <div
      v-show="showPlaylist"
      class="absolute bottom-full right-2 mb-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
      <div
        class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          播放列表（{{ playHistory.length }}）
        </h3>
        <div class="flex items-center gap-2">
          <!-- 清空列表按钮 -->
          <el-tooltip
            :placement="props.tooltipConfig.placement"
            content="清空列表"
            v-if="playHistory.length > 0">
            <button
              class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-red-500"
              @click="clearPlayHistory">
              <el-icon><Delete /></el-icon>
            </button>
          </el-tooltip>
          <!-- 关闭按钮 -->
          <el-tooltip :placement="props.tooltipConfig.placement" :content="'隐藏列表'">
            <button
              class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500"
              @click="showPlaylist = false">
              <el-icon><Close /></el-icon>
            </button>
          </el-tooltip>
        </div>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="music in playHistory"
          :key="music.id"
          class="group flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer relative"
          :class="{ 'bg-gray-50 dark:bg-gray-700': currentMusic?.id === music.id }"
          @click="playMusic(music)">
          <img :src="music.cover" :alt="music.songName" class="w-10 h-10 rounded object-cover" />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ music.songName }}
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ music.singer }}</p>
          </div>
          <div class="flex items-center gap-2">
            <!-- 正在播放按钮 -->
            <el-tooltip
              :content="'正在播放'"
              v-bind="props.tooltipConfig"
              v-if="currentMusic?.id === music.id">
              <button
                class="opacity-100 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                @click.stop="handlePlayPause">
                <el-icon class="text-primary-500 dark:text-primary-400">
                  <component :is="isPlaying ? 'VideoPause' : 'VideoPlay'" />
                </el-icon>
              </button>
            </el-tooltip>
            <!-- 添加删除按钮 -->
            <el-tooltip content="从列表中移除" v-bind="props.tooltipConfig">
              <button
                class="opacity-100 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                @click="removeFromHistory(music.id, $event)">
                <el-icon
                  class="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                  <Delete />
                </el-icon>
              </button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 控制按钮基础样式
.control-btn {
  @apply w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400;
  @apply hover:text-primary-500 dark:hover:text-primary-400;
  @apply hover:bg-gray-100 dark:hover:bg-gray-800;
  @apply transition-all duration-300;
}

// 播放按钮阴影效果
.el-icon {
  @apply transition-all duration-300;
}

// 滑块样式保持不变
.el-slider {
  @apply mx-auto;
}

:deep(.el-slider__runway) {
  @apply bg-gray-200 dark:bg-gray-700;
}

:deep(.el-slider__bar) {
  @apply bg-primary-500;
}

:deep(.el-slider__button) {
  @apply border-primary-500;
}

// 播放列表滚动条样式
.overflow-y-auto {
  &::-webkit-scrollbar {
    @apply w-2;
  }

  &::-webkit-scrollbar-track {
    @apply bg-gray-100 dark:bg-gray-700;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-600 rounded;

    &:hover {
      @apply bg-gray-400 dark:bg-gray-500;
    }
  }
}

// 歌词滚动条样式
.overflow-y-auto {
  &::-webkit-scrollbar {
    @apply w-1;
  }

  &::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300/20 dark:bg-gray-600/20 rounded;

    &:hover {
      @apply bg-gray-400/30 dark:bg-gray-500/30;
    }
  }
}

// 修改光效动画
@keyframes lyricGlow {
  0% {
    color: var(--el-color-primary-dark-2);
    filter: drop-shadow(0 0 2px rgba(var(--el-color-primary-rgb), 0.4));
  }
  50% {
    color: var(--el-color-primary);
    filter: drop-shadow(0 0 4px rgba(var(--el-color-primary-rgb), 0.6));
  }
  100% {
    color: var(--el-color-primary-dark-2);
    filter: drop-shadow(0 0 2px rgba(var(--el-color-primary-rgb), 0.4));
  }
}

// 修改暗色主题的光效动画
@keyframes lyricGlow-dark {
  0% {
    color: #c7d2fe; // Indigo-200
    filter: drop-shadow(0 0 3px rgba(199, 210, 254, 0.5));
  }
  50% {
    color: #e0e7ff; // Indigo-100
    filter: drop-shadow(0 0 5px rgba(224, 231, 255, 0.7));
  }
  100% {
    color: #c7d2fe; // Indigo-200
    filter: drop-shadow(0 0 3px rgba(199, 210, 254, 0.5));
  }
}

.animate-lyric-glow {
  animation: lyricGlow 3s ease-in-out infinite;
  font-weight: 500;

  &::after {
    content: '';
    @apply absolute left-0 right-0 h-px bottom-0;
    background: linear-gradient(
      90deg,
      transparent,
      var(--el-color-primary) 20%,
      var(--el-color-primary-dark-2) 50%,
      var(--el-color-primary) 80%,
      transparent
    );
    animation: lineGlow 3s ease-in-out infinite;
    filter: blur(1px);
  }
}

// 暗色主题下的光效样式
.dark .animate-lyric-glow {
  animation: lyricGlow-dark 3s ease-in-out infinite;

  &::after {
    background: linear-gradient(
      90deg,
      transparent,
      rgba(224, 231, 255, 0.2) 20%,
      // Indigo-100
      rgba(199, 210, 254, 0.4) 50%,
      // Indigo-200
      rgba(224, 231, 255, 0.2) 80%,
      // Indigo-100
      transparent
    );
    filter: blur(2px);
    opacity: 0.8;
  }
}

// 当前歌词文本样式
.current-lyric-text {
  @apply text-lg lg:text-3xl md:text-2xl font-medium !important;
}

// 修改当前歌词的样式
.current-lyric {
  @apply transition-all duration-700;

  span {
    @apply relative font-medium;
    letter-spacing: 0.5px;

    &::before {
      content: '';
      @apply absolute -inset-6;
      background: radial-gradient(
        circle at center,
        rgba(var(--el-color-primary-rgb), 0.08),
        transparent 70%
      );
      @apply opacity-0;
      animation: bgPulse 3s ease-in-out infinite;
      border-radius: 8px;
    }
  }
}

// 暗色主题下的当前歌词背景
.dark .current-lyric span::before {
  background: radial-gradient(
    circle at center,
    rgba(199, 210, 254, 0.15),
    // Indigo-200
    transparent 70%
  );
}

// 修改暗色主题下的文字颜色（删除之前的样式）
.dark {
  .current-lyric {
    color: #e0e7ff; // Indigo-100
  }
}

// 全局背景微调
.lyrics-container {
  background: linear-gradient(
    135deg,
    rgba(var(--el-color-primary-rgb), 0.02),
    rgba(var(--el-color-primary-rgb), 0.03),
    rgba(var(--el-color-primary-rgb), 0.02)
  );
}

// 暗色主题下的全局背景
.dark .lyrics-container {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.05),
    // Indigo-500
    rgba(129, 140, 248, 0.08),
    // Indigo-400
    rgba(99, 102, 241, 0.05) // Indigo-500
  );
}

// 修改暗色主题下的文字颜色
.dark {
  .text-gray-300 {
    color: #c7d2fe; // Indigo-200
  }

  .text-gray-400 {
    color: #a5b4fc; // Indigo-300
  }

  .text-gray-500 {
    color: #818cf8; // Indigo-400
  }
}

// 暗色主题下的滚动条
.dark .overflow-y-auto {
  &::-webkit-scrollbar-thumb {
    background-color: rgba(165, 180, 252, 0.2); // Indigo-300

    &:hover {
      background-color: rgba(165, 180, 252, 0.3); // Indigo-300
    }
  }
}

// 修改暗色主题下的背景模糊度
.dark .backdrop-blur-2xl {
  backdrop-filter: blur(24px);
}

// 暗色主题下的背景图片透明度调整
.dark .opacity-20 {
  opacity: 0.15;
}

// 固定每行高度并确保足够空间
.lyrics-container {
  .h-16 {
    height: 5rem; // 增加一点高度以确保有足够空间
  }
}

// 优化滚动效果，使其更加平滑
.overflow-y-auto {
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    @apply w-1;
  }

  &::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300/20 dark:bg-gray-600/20 rounded;

    &:hover {
      @apply bg-gray-400/30 dark:bg-gray-500/30;
    }
  }
}

// 预览字体样式
:deep(.el-dropdown-menu .el-dropdown-item) {
  &[class*='FZHanZhenGuangBiao'] {
    font-family: 'FZHanZhenGuangBiao', sans-serif;
  }
  &[class*='ZKKuaiLeTi'] {
    font-family: 'ZKKuaiLeTi', sans-serif;
  }
  &[class*='PingFangSC'] {
    font-family: 'PingFangSC', sans-serif;
  }
}

// 添加错开的动画效果
@keyframes bounce-1 {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.75;
  }
  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}

@keyframes bounce-2 {
  0%,
  100% {
    transform: translateY(6px);
    opacity: 1;
  }
  50% {
    transform: translateY(0);
    opacity: 0.75;
  }
}

.animate-bounce-1 {
  animation: bounce-1 1.5s infinite;
}

.animate-bounce-2 {
  animation: bounce-2 1.5s infinite;
}

.aspect-square {
  aspect-ratio: 1;
}

// 音效图标样式
:deep(svg) {
  @apply w-5 h-5;

  path {
    @apply fill-current;
  }
}

// 下拉菜单项样式
:deep(.el-dropdown-menu__item) {
  @apply py-2 px-4;

  &:hover {
    @apply bg-gray-100 dark:bg-gray-700;
  }

  &.text-primary-500 {
    @apply bg-primary-50 dark:bg-primary-900/20;
  }
}

// 修改播放图标样式
.play-icon-large {
  @apply text-white;

  &.el-icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
    transition: all 0.3s ease;
  }

  :deep(svg) {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.3));
  }
}

// 添加新的动画
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
</style>
