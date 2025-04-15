<script setup lang="ts">
// 定义酷狗音乐数据接口
interface KugouMusic {
  id: string
  singer: string
  songName: string
  fileName: string
  albumId: string
  albumName: string
  extName: string
  emixSongId: string
}

// 定义播放器使用的音乐类型
interface PlayableMusic {
  id: string | number // 支持字符串或数字类型的 ID
  singer: string
  songName: string
  cover: string
  play_url: string
  lyrics: string
}

defineProps<{
  songs: KugouMusic[]
  loading?: boolean
  currentMusic?: PlayableMusic | null
  isPlaying?: boolean
}>()

const emit = defineEmits<{
  play: [music: KugouMusic]
  pause: []
  download: [music: KugouMusic]
}>()

// 生成骨架屏行数
const skeletonRows = Array.from({ length: 10 }, (_, i) => i)
</script>

<template>
  <div class="overflow-x-auto shadow-md">
    <!-- 骨架屏 -->
    <div v-if="loading" class="music-table-skeleton">
      <el-skeleton :loading="true" animated>
        <template #template>
          <div v-for="index in skeletonRows" :key="index" class="skeleton-row">
            <!-- 歌名列骨架 -->
            <div class="flex items-center gap-3">
              <el-skeleton-item variant="text" style="width: 200px" />
            </div>
            <!-- 歌手列骨架 -->
            <el-skeleton-item variant="text" style="width: 100px" />
            <!-- 专辑列骨架 -->
            <el-skeleton-item variant="text" style="width: 150px" />
            <!-- 操作列骨架 -->
            <div class="flex items-center gap-2">
              <el-skeleton-item
                variant="button"
                style="width: 32px; height: 32px; border-radius: 50%" />
              <el-skeleton-item
                variant="button"
                style="width: 32px; height: 32px; border-radius: 50%" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- 实际表格 -->
    <el-table v-else :data="songs" style="width: 100%" class="music-table">
      <!-- 歌名列 -->
      <el-table-column label="歌名" min-width="280">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <span class="truncate" :title="row.songName">{{ row.songName }}</span>
          </div>
        </template>
      </el-table-column>

      <!-- 歌手列 -->
      <el-table-column prop="singer" label="歌手" min-width="120">
        <template #default="{ row }">
          <span class="truncate" :title="row.singer">{{ row.singer }}</span>
        </template>
      </el-table-column>

      <!-- 专辑列 -->
      <el-table-column prop="albumName" label="专辑" min-width="120">
        <template #default="{ row }">
          <span class="truncate" :title="row.albumName">{{ row.albumName }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-button
              type="primary"
              :icon="String(currentMusic?.id) === row.id && isPlaying ? 'VideoPause' : 'VideoPlay'"
              circle
              @click="
                String(currentMusic?.id) === row.id && isPlaying ? emit('pause') : emit('play', row)
              " />
            <el-button
              type="info"
              :class="[
                'download-btn',
                'dark:!bg-primary-400 dark:hover:!bg-primary-500 dark:!border-primary-400',
              ]"
              :icon="'Download'"
              circle
              @click="emit('download', row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.music-table-skeleton {
  @apply bg-white dark:bg-dark-card rounded-lg overflow-hidden;

  .skeleton-row {
    @apply flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800;

    &:last-child {
      @apply border-none;
    }
  }

  :deep(.el-skeleton) {
    --el-skeleton-color: theme('colors.gray.100');
    --el-skeleton-to-color: theme('colors.gray.200');

    .dark & {
      --el-skeleton-color: theme('colors.gray.700');
      --el-skeleton-to-color: theme('colors.gray.600');
    }
  }
}

.music-table {
  :deep(.el-table__inner-wrapper) {
    @apply rounded-lg overflow-hidden;
  }

  :deep(.el-table__header-wrapper) {
    th {
      @apply bg-gray-50 dark:bg-gray-800;
      @apply text-gray-600 dark:text-gray-300;
      @apply font-medium;
    }
  }

  :deep(.el-table__body-wrapper) {
    tr {
      @apply transition-colors duration-300;

      &:hover {
        @apply bg-gray-50 dark:bg-gray-800;
      }
    }

    td {
      @apply text-gray-700 dark:text-gray-200;
    }
  }

  :deep(.download-btn) {
    @apply transition-colors duration-300;

    &.dark {
      --el-button-hover-text-color: white;
      --el-button-hover-bg-color: var(--el-color-primary);
      --el-button-hover-border-color: var(--el-color-primary);
    }
  }
}
</style>
