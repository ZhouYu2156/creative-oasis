let requestAnimationFrameId: number | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null

export function usePlayMusic (cvs: HTMLCanvasElement, audio: HTMLAudioElement) {
  let isInit = false
  const ctx = cvs.getContext('2d') as CanvasRenderingContext2D
  let frequencyData: Uint8Array
  let isPlaying: boolean

  audio.onplay = () => {
    if (isInit) {
      isPlaying = true
      animate()
      return
    }

    try {
      // 如果已经存在 AudioContext，就复用它
      if (!audioContext) {
        audioContext = new AudioContext()
      }

      if (!analyser) {
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 2048
        const source = audioContext.createMediaElementSource(audio)
        source.connect(analyser)
        analyser.connect(audioContext.destination)
      }

      frequencyData = new Uint8Array(analyser.frequencyBinCount)
      isInit = true
      isPlaying = true
      animate()
    } catch (error) {
      console.error('Failed to initialize audio visualizer:', error)
    }
  }

  audio.onpause = () => {
    isPlaying = false
    if (requestAnimationFrameId) {
      cancelAnimationFrame(requestAnimationFrameId)
      requestAnimationFrameId = null
    }
  }

  const animate = () => {
    if (isPlaying) {
      requestAnimationFrameId = requestAnimationFrame(animate)
      drawVisualizer()
    }
  }

  const drawVisualizer = () => {
    const { width, height } = cvs
    ctx.clearRect(0, 0, width, height)
    if (!isInit || !analyser) return

    analyser.getByteFrequencyData(frequencyData)
    const len = frequencyData.length
    const barWidth = width / len
    const hueStep = 360 / len
    for (let i = 0; i < len; i++) {
      const digit = frequencyData[i]
      const barHeight = (digit / 255) * height
      const x1 = width / 2 + i * barWidth
      const x2 = width / 2 - (i + 1) * barWidth
      const y = height - barHeight
      const hue = (i * hueStep) % 360
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
      ctx.fillRect(x1, y, barWidth, barHeight)
      ctx.fillRect(x2, y, barWidth, barHeight)
    }
  }

  // 设置 canvas 尺寸
  const handleResize = () => {
    const rect = cvs.getBoundingClientRect()
    cvs.width = rect.width
    cvs.height = rect.height
  }

  window.addEventListener('resize', handleResize)
  handleResize()

  // 组件卸载时，清除音频可视化
  return () => {
    isPlaying = false
    if (requestAnimationFrameId) {
      cancelAnimationFrame(requestAnimationFrameId)
    }
    window.removeEventListener('resize', handleResize)
  }
}
