<script setup lang="ts">
import { User, Trophy, CircleCheckBig } from 'lucide-vue-next';
import type { Challenge } from '../../../types/challenge';
import { CATEGORY_MAP } from '@/constants/category';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    challenge: Challenge;
    /** 是否显示右下角难度标签（比赛页可不显示） */
    showDifficulty?: boolean;
  }>(),
  { showDifficulty: true }
);

const emit = defineEmits<{
  (e: 'view-details', id: number): void;
}>();

const categoryMeta = computed(() => {
  return CATEGORY_MAP[props.challenge.category] || CATEGORY_MAP.Misc;
});

const categoryIcon = computed(() => categoryMeta.value.icon);
const categoryColor = computed(() => categoryMeta.value.cardClass);

// 提取分类主色（用于边框和装饰条）
const themeColor = computed(() => {
  const match = categoryMeta.value.sidebar.inactive.match(/text-\[(#[A-Z0-9]+)\]/i);
  return match ? match[1] : '#165DFF';
});

const difficultyColor = computed(() => {
  switch (props.challenge.difficulty) {
    case 'Easy':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
    case 'Medium':
      return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20';
    case 'Hard':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
    default:
      return 'text-slate-600 bg-slate-50';
  }
});
</script>

<template>
  <div
    class="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 active:scale-95 active:shadow-inner dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
    :class="{ 'opacity-50 grayscale-[0.6]': challenge.status === 'solved' }"
    :style="{
      '--theme-color': themeColor,
    }"
    @click="emit('view-details', challenge.id)"
  >
    <!-- 左侧渐变装饰条 -->
    <div
      class="absolute top-0 left-0 bottom-0 w-0 bg-linear-to-r from-(--theme-color) to-transparent transition-all duration-300 group-hover:w-1"
    />

    <!-- 悬停时的边框和阴影增强 -->
    <div
      class="absolute inset-0 pointer-events-none rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-(--theme-color) group-hover:opacity-30"
    />

    <!-- 状态标签 (新版：大图标溢出) -->
    <div
      v-if="challenge.status === 'solved'"
      class="pointer-events-none absolute -top-4 -right-4 z-0 h-2/3 opacity-75 transition-transform duration-500 group-hover:scale-110"
    >
      <CircleCheckBig
        class="h-full w-auto text-green-500"
        :stroke-width="1.8"
      />
    </div>

    <div class="p-5">
      <!-- 头部：图标 + 标题 -->
      <div class="mb-4 flex items-start gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          :class="categoryColor"
        >
          <component :is="categoryIcon" :size="20" />
        </div>
        <div>
          <h3 class="line-clamp-1 text-base font-bold text-slate-800 dark:text-slate-100">
            {{ challenge.title }}
          </h3>
          <p class="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {{ challenge.description.slice(0, 60) }}...
          </p>
        </div>
      </div>

      <!-- 底部信息 -->
      <div
        class="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800"
      >
        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-1">
            <User :size="12" />
            <span>{{ challenge.solvedCount }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Trophy :size="12" />
            <span>{{ challenge.points }} pts</span>
          </div>
        </div>
        <span
          v-if="showDifficulty"
          class="rounded-full px-2 py-0.5 text-xs font-bold"
          :class="difficultyColor"
        >
          {{ challenge.difficulty }}
        </span>
      </div>
    </div>
  </div>
</template>
