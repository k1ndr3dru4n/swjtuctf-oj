<script setup lang="ts">
import { computed } from 'vue'
import { Hash } from 'lucide-vue-next'
import { homeStore } from '@/stores/homeStore'

defineOptions({ name: 'TrainingSidebar' })

const tags = computed(() => [...homeStore.hotTags])
</script>

<template>
  <div class="space-y-6">
    <h3
      class="mb-6 flex items-center gap-2 px-2 text-lg font-bold text-slate-800 dark:text-slate-100"
    >
      <Hash class="text-blue-600 dark:text-blue-400" :size="20" />
      热门标签
    </h3>

    <div
      class="rounded-card border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="rounded-button cursor-pointer bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>
