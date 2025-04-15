<script setup lang="ts">
// --------------------音频可视化待实现--------------------

const { visualizerCanvasRef, audio } = defineProps<{
  visualizerCanvasRef: HTMLCanvasElement | undefined
  audio: HTMLAudioElement
}>()

let callback: () => void

onMounted(() => {
  callback = usePlayMusic(visualizerCanvasRef as HTMLCanvasElement, audio)
})

onUnmounted(() => {
  callback()
})
</script>

<template>
  <!-- 音频可视化特效 -->
  <div class="absolute bottom-0 left-0 w-full h-[40vh] opacity-45 bg-red-700">
    <canvas ref="visualizerCanvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped lang="scss"></style>
