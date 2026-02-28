<script setup lang="ts">
import { computed } from 'vue'
import { Activity, MessageSquare, Megaphone } from 'lucide-vue-next'
import { getSelectedFeeds } from '@/stores/homeStore'

const feeds = computed(() => {
  const list = getSelectedFeeds()
  return list.map((c) => ({
    id: c.id,
    type: c.source === 'forum' ? 'discussion' : 'announcement',
    icon: c.source === 'forum' ? MessageSquare : Megaphone,
    iconColor: c.source === 'forum' ? 'text-purple-500' : 'text-blue-500',
    sourceLabel: c.sourceLabel,
    title: c.title,
    time: c.time,
    author: c.author,
  }))
})
</script>

<template>
  <div>
    <h3
      class="mb-6 flex items-center gap-2 px-2 text-lg font-bold text-slate-800 dark:text-slate-100"
    >
      <Activity class="text-blue-600 dark:text-blue-400" :size="20" />
      最新动态
    </h3>

    <div
      v-if="feeds.length > 0"
      class="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800"
    >
      <div v-for="feed in feeds" :key="feed.id" class="relative pl-12">
        <!-- 图标 -->
        <div
          class="absolute top-0 left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <component :is="feed.icon" :class="`h-4 w-4 ${feed.iconColor}`" />
        </div>

        <!-- 卡片 -->
        <div
          class="group rounded-inner cursor-pointer border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
        >
          <div class="mb-2 flex items-center gap-2 flex-wrap">
            <span
              class="rounded-full px-2 py-0.5 text-[10px] font-bold"
              :class="
                feed.sourceLabel === '论坛帖子'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              "
            >
              {{ feed.sourceLabel }}
            </span>
            <span v-if="feed.author" class="text-xs text-slate-500 dark:text-slate-400">
              {{ feed.author }}
            </span>
            <span class="text-xs text-slate-400 dark:text-slate-500">{{ feed.time }}</span>
          </div>
          <h4
            class="text-base font-bold text-slate-800 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400"
          >
            {{ feed.title }}
          </h4>
        </div>
      </div>
    </div>

    <p v-if="feeds.length === 0" class="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
      暂无动态，管理员可在「首页管理」中筛选展示内容
    </p>
  </div>
</template>
