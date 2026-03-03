<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Search,
  Filter,
  EyeOff,
  Play,
  Copy,
  Trash2,
  RefreshCw,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Megaphone,
} from 'lucide-vue-next';
import MarkdownIt from 'markdown-it';
import { useChallengeStore } from '@/stores/challenge';
import { getChallenge } from '@/api/challenge';
import type { Category, Difficulty, Challenge } from '@/types/challenge';
import ChallengeCard from '@/components/user/training/ChallengeCard.vue';
import { CATEGORIES, CATEGORY_MAP } from '@/constants/category';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { RadarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';

// Register ECharts components
use([CanvasRenderer, RadarChart, TitleComponent, TooltipComponent, LegendComponent]);

// Initialize Markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// Use Pinia store
const challengeStore = useChallengeStore();

// State
const selectedCategory = ref<Category | 'All'>('All');
const searchQuery = ref('');
const selectedDifficulty = ref<Difficulty | 'All'>('All');
const hideSolved = ref(false);
const detailVisible = ref(false);
const flagInput = ref('');
const submitting = ref(false);
const isSidebarCollapsed = ref(false);
const isRightSidebarCollapsed = ref(false);

// Auto-collapse sidebars on small screens
onMounted(() => {
  const checkWidth = () => {
    if (window.innerWidth < 1440) {
      isSidebarCollapsed.value = true;
      isRightSidebarCollapsed.value = true;
    }
  };
  checkWidth();
  window.addEventListener('resize', checkWidth);
  // Fetch challenges from API
  loadChallenges();
  return () => window.removeEventListener('resize', checkWidth);
});

const difficulties: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];

// Load challenges from API
async function loadChallenges() {
  await challengeStore.fetchChallenges();
}

// Training Announcements
const trainingAnnouncements = [
  { id: 1, title: 'Web 分类新增 5 道基础题', date: '10:30', tag: 'NEW' },
  { id: 2, title: '容器系统维护完成，连接更稳定', date: '昨天', tag: 'INFO' },
  { id: 3, title: 'Pwn 进阶题：VM Escape 上线', date: '02-08', tag: 'HARD' },
];

// Radar Chart Data
const radarOption = computed(() => {
  const indicators = CATEGORIES.filter((cat: typeof CATEGORIES[0]) => cat.label !== 'All').map((cat: typeof CATEGORIES[0]) => {
    // Extract hex color from the inactive sidebar style
    const colorMatch = cat.sidebar.inactive.match(/text-\[(#[A-Z0-9]+)\]/i);
    const color = colorMatch ? colorMatch[1] : '#86909C';
    
    return {
      name: cat.label,
      max: 100,
      color: color // Set label color for each indicator
    };
  });

  const solveData = [80, 45, 30, 65, 20, 90, 40, 15];

  return {
    tooltip: { trigger: 'item' },
    radar: {
      indicator: indicators,
      radius: '60%',
      splitNumber: 4,
      axisName: {
        fontSize: 10,
        fontWeight: 'bold',
        // Note: individual indicator colors take precedence
      },
      splitLine: { lineStyle: { color: 'rgba(134, 144, 156, 0.1)' } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(134, 144, 156, 0.1)' } },
    },
    series: [
      {
        name: '解题进度',
        type: 'radar',
        data: [
          {
            value: solveData,
            name: '进度分布 (%)',
            symbol: 'none',
            itemStyle: { color: '#165DFF' },
            areaStyle: { color: 'rgba(22, 93, 255, 0.2)' },
            lineStyle: { width: 2, color: '#165DFF' },
          },
        ],
      },
    ],
  };
});

const getCategoryClass = (cat: (typeof CATEGORIES)[0]) => {
  const active = selectedCategory.value === cat.label;
  const cfg = CATEGORY_MAP[cat.label].sidebar;
  return active ? cfg.active : cfg.inactive;
};

// Filtering and Sorting - use store challenges
const filteredChallenges = computed(() => {
  const result = challengeStore.challenges.filter((c: Challenge) => {
    const matchCategory = selectedCategory.value === 'All' || c.category === selectedCategory.value;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchDifficulty =
      selectedDifficulty.value === 'All' || c.difficulty === selectedDifficulty.value;
    const matchSolved = hideSolved.value ? c.status !== 'solved' : true;
    return matchCategory && matchSearch && matchDifficulty && matchSolved;
  });

  const categoryOrder = CATEGORIES.map((cat) => cat.label);
  const difficultyMap: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };

  return result.sort((a, b) => {
    const catA = categoryOrder.indexOf(a.category);
    const catB = categoryOrder.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return difficultyMap[a.difficulty] - difficultyMap[b.difficulty];
  });
});

// Actions
const openDetail = async (id: number) => {
  const challenge = challengeStore.challenges.find((c) => c.id === id);
  if (challenge) {
    challengeStore.setCurrentChallenge(challenge);
    detailVisible.value = true;
    flagInput.value = '';
    
    // Fetch full challenge details from API
    try {
      const detail = await getChallenge(id);
      challengeStore.setCurrentChallenge(detail);
    } catch (error) {
      console.error('Failed to fetch challenge detail:', error);
    }
  }
};

const startContainer = async () => {
  const challenge = challengeStore.currentChallenge;
  if (!challenge) return;
  
  challengeStore.updateContainerState(challenge.id, 'loading');
  
  try {
    // TODO: Call API to start container
    // const response = await api.startContainer(challenge.id);
    // challengeStore.updateContainerState(challenge.id, 'running', response.data);
    
    // Mock for now
    setTimeout(() => {
      challengeStore.updateContainerState(challenge.id, 'running', {
        ip: '10.10.10.101',
        port: Math.floor(Math.random() * 50000) + 10000,
        timeLeft: '01:00:00',
      });
    }, 2000);
  } catch (error) {
    console.error('Failed to start container:', error);
    challengeStore.updateContainerState(challenge.id, 'idle');
  }
};

const destroyContainer = () => {
  const challenge = challengeStore.currentChallenge;
  if (!challenge) return;
  
  challengeStore.updateContainerState(challenge.id, 'idle');
};

const extendTime = () => {
  const challenge = challengeStore.currentChallenge;
  if (challenge?.containerInfo) {
    challenge.containerInfo.timeLeft = '01:00:00';
  }
};

const submitFlag = async () => {
  if (!flagInput.value || !challengeStore.currentChallenge) return;
  submitting.value = true;
  
  try {
    // TODO: Call API to submit flag
    // await api.submitFlag(challengeStore.currentChallenge.id, flagInput.value);
    
    console.log('Flag submitted:', flagInput.value);
    flagInput.value = '';
  } catch (error) {
    console.error('Flag submission failed:', error);
  } finally {
    submitting.value = false;
  }
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const renderedDescription = computed(() => {
  return challengeStore.currentChallenge ? md.render(challengeStore.currentChallenge.description) : '';
});

const currentCategoryMeta = computed(() => {
  if (!challengeStore.currentChallenge) return null;
  return CATEGORY_MAP[challengeStore.currentChallenge.category];
});
</script>

<template>
  <div class="flex min-h-[calc(100vh-64px)] gap-6">
    <!-- Left Sidebar -->
    <aside
      class="hidden shrink-0 flex-col gap-4 transition-all duration-300 lg:flex"
      :class="isSidebarCollapsed ? 'w-16' : 'w-48'"
    >
      <div
        class="sticky top-16 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-sm dark:bg-slate-900"
        :class="{ 'items-center': isSidebarCollapsed }"
      >
        <button
          class="mb-2 flex h-10 w-full items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          @click="isSidebarCollapsed = !isSidebarCollapsed"
        >
          <ChevronLeft v-if="!isSidebarCollapsed" :size="20" />
          <ChevronRight v-else :size="20" />
        </button>

        <button
          v-for="cat in CATEGORIES"
          :key="cat.label"
          class="group relative flex h-10 items-center rounded-xl font-medium transition-all"
          :class="[
            getCategoryClass(cat),
            isSidebarCollapsed ? 'mx-auto w-10 justify-center' : 'w-full gap-3 px-3',
          ]"
          @click="selectedCategory = cat.label"
        >
          <component :is="cat.icon" :size="20" />
          <span v-if="!isSidebarCollapsed" class="truncate text-sm font-bold">{{ cat.label }}</span>
          <span
            v-if="isSidebarCollapsed"
            class="absolute left-14 z-50 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            {{ cat.label }}
          </span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="min-w-0 flex-1 pb-10">
      <!-- Top Filter Bar -->
      <div
        class="sticky top-16 z-30 -mx-4 mb-6 bg-slate-50/80 px-4 py-4 backdrop-blur-md lg:static lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none dark:bg-slate-950/80 lg:dark:bg-transparent"
      >
        <div
          class="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900"
        >
          <div class="flex min-w-50 flex-1 items-center gap-4">
            <div class="relative max-w-md flex-1">
              <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索题目..."
                class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-4 pl-9 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Filter class="h-4 w-4 text-slate-400" />
              <select
                v-model="selectedDifficulty"
                class="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option v-for="diff in difficulties" :key="diff" :value="diff">
                  {{ diff }}
                </option>
              </select>
            </div>

            <div class="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            <label class="flex cursor-pointer items-center gap-2 select-none">
              <div class="relative">
                <input v-model="hideSolved" type="checkbox" class="peer sr-only" />
                <div
                  class="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                />
              </div>
              <span
                class="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                <EyeOff class="h-4 w-4" /> 隐藏已解出
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Challenge Grid -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        <ChallengeCard
          v-for="challenge in filteredChallenges"
          :key="challenge.id"
          :challenge="challenge"
          @view-details="openDetail"
        />
      </div>
    </div>

    <!-- Right Info Sidebar -->
    <aside
      class="hidden shrink-0 flex-col gap-4 transition-all duration-300 lg:flex"
      :class="isRightSidebarCollapsed ? 'w-16' : 'w-72'"
    >
      <div class="sticky top-16 space-y-2">
        <!-- Solve Progress (Radar) -->
        <div
          class="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col"
          :class="{ 'items-center': isRightSidebarCollapsed }"
        >
          <!-- Toggle Button (Integrated) -->
          <button
            class="mb-2 flex h-10 w-full items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors"
            :class="{ 'w-10': isRightSidebarCollapsed }"
            @click="isRightSidebarCollapsed = !isRightSidebarCollapsed"
          >
            <ChevronRight v-if="!isRightSidebarCollapsed" :size="20" />
            <ChevronLeft v-else :size="20" />
          </button>

          <!-- Collapsed State: Solve Ratio -->
          <template v-if="isRightSidebarCollapsed">
            <a-tooltip content="解题进度" position="left">
              <div class="flex flex-col items-center gap-1 py-2 text-blue-600 dark:text-blue-400">
                <span class="text-[10px] font-black leading-none">124</span>
                <div class="h-px w-4 bg-slate-200 dark:bg-slate-700" />
                <span class="text-[10px] font-black leading-none">200</span>
              </div>
            </a-tooltip>
          </template>

          <!-- Expanded State -->
          <div v-else class="p-3 pt-0">
            <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
              解题进度
            </h3>
            <div class="h-56 w-full">
              <v-chart class="chart" :option="radarOption" autoresize />
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <div class="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
                <p class="text-[10px] font-bold text-slate-400 uppercase">
                  总解出
                </p>
                <p class="text-lg font-black text-slate-800 dark:text-slate-100">
                  124
                </p>
              </div>
              <div class="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
                <p class="text-[10px] font-bold text-slate-400 uppercase">
                  总积分
                </p>
                <p class="text-lg font-black text-blue-600 dark:text-blue-400">
                  4200
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Training Announcements -->
        <div
          class="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          :class="{ 'flex flex-col items-center': isRightSidebarCollapsed }"
        >
          <template v-if="isRightSidebarCollapsed">
            <a-tooltip content="训练公告" position="left">
              <button class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors">
                <Megaphone :size="20" />
              </button>
            </a-tooltip>
          </template>

          <div v-else class="p-3">
            <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
              训练公告
            </h3>
            <div class="space-y-4">
              <div v-for="ann in trainingAnnouncements" :key="ann.id" class="group cursor-pointer">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        class="rounded px-1.5 py-0.5 text-[8px] font-black"
                        :class="{
                          'bg-blue-100 text-blue-600 dark:bg-blue-900/30': ann.tag === 'NEW',
                          'bg-slate-100 text-slate-600 dark:bg-slate-800': ann.tag === 'INFO',
                          'bg-orange-100 text-orange-600 dark:bg-orange-900/30': ann.tag === 'HARD',
                        }"
                      >{{ ann.tag }}</span>
                      <span class="text-[10px] font-mono text-slate-400">{{ ann.date }}</span>
                    </div>
                    <p
                      class="line-clamp-2 text-xs font-bold leading-relaxed text-slate-700 transition-colors group-hover:text-blue-600 dark:text-slate-200"
                    >
                      {{ ann.title }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="mt-6 w-full rounded-lg border border-slate-100 py-2 text-[10px] font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all dark:border-slate-800 dark:hover:bg-slate-800"
            >
              查看更多公告
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Detail Modal -->
    <a-modal
      v-model:visible="detailVisible"
      width="600px"
      :footer="false"
      :unmount-on-close="true"
      modal-class="rounded-card overflow-hidden"
    >
      <template #title>
        <div class="flex w-full items-center gap-3">
          <div
            v-if="currentCategoryMeta"
            class="flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-1.5"
            :class="currentCategoryMeta.cardClass"
          >
            <component :is="currentCategoryMeta.icon" :size="16" />
            <span class="text-xs font-bold uppercase tracking-wider">{{
              currentCategoryMeta.label
            }}</span>
          </div>
          <div class="h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-800" />
          <span class="truncate text-lg font-bold">{{ challengeStore.currentChallenge?.title }}</span>
        </div>
      </template>

      <div v-if="challengeStore.currentChallenge" class="flex flex-col gap-6">
        <div
          class="prose prose-sm dark:prose-invert max-w-none rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="markdown-body" v-html="renderedDescription" />
        </div>

        <div
          class="rounded-xl border border-slate-200 bg-slate-50/30 p-5 dark:border-slate-700 dark:bg-slate-800/20"
        >
          <div v-if="challengeStore.currentChallenge.containerState === 'idle'" class="py-2 text-center">
            <button
              class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95 dark:shadow-none"
              @click="startContainer"
            >
              <Play class="h-5 w-5" /> 开启靶机环境
            </button>
            <p class="mt-3 text-xs text-slate-500">
              点击开启后将为您分配独立的 Docker 容器
            </p>
          </div>

          <div
            v-else-if="challengeStore.currentChallenge.containerState === 'loading'"
            class="flex flex-col items-center py-4"
          >
            <Loader2 class="mb-3 h-8 w-8 animate-spin text-blue-600" />
            <span class="text-sm font-medium text-slate-600 dark:text-slate-300">容器部署中，请稍后...</span>
            <div class="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div class="animate-progress h-full bg-blue-500" />
            </div>
          </div>

          <div
            v-else-if="challengeStore.currentChallenge.containerState === 'running' && challengeStore.currentChallenge.containerInfo"
            class="space-y-4"
          >
            <div
              class="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div class="flex flex-col">
                <span class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">连接地址</span>
                <div class="flex items-center gap-2 font-mono text-base font-bold text-slate-800 dark:text-slate-100">
                  {{ challengeStore.currentChallenge.containerInfo.ip }}:{{ challengeStore.currentChallenge.containerInfo.port }}
                  <button
                    class="text-slate-400 transition-colors hover:text-blue-600"
                    @click="copyToClipboard(`${challengeStore.currentChallenge.containerInfo.ip}:${challengeStore.currentChallenge.containerInfo.port}`)"
                  >
                    <Copy class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div class="text-right">
                <span class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">剩余时间</span>
                <div class="font-mono text-lg font-bold text-red-500">
                  {{ challengeStore.currentChallenge.containerInfo.timeLeft }}
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400"
                @click="extendTime"
              >
                <RefreshCw class="h-4 w-4" /> 延时
              </button>
              <button
                class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                @click="destroyContainer"
              >
                <Trash2 class="h-4 w-4" /> 销毁
              </button>
            </div>
          </div>
        </div>

        <div class="mt-auto">
          <h4 class="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500">
            提交 Flag
          </h4>
          <div class="flex gap-2">
            <input
              v-model="flagInput"
              type="text"
              placeholder="flag{...}"
              class="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-blue-500 dark:focus:bg-slate-900 dark:focus:ring-blue-900/30"
              @keyup.enter="submitFlag"
            />
            <button
              class="flex items-center gap-2 rounded-lg bg-slate-900 px-6 font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-blue-600"
              :disabled="!flagInput || submitting"
              @click="submitFlag"
            >
              <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
              <Send v-else class="h-4 w-4" />
              提交
            </button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
@import 'github-markdown-css/github-markdown-light.css';

/* 简单的进度条动画 */
@keyframes progress {
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 90%;
  }
}
.animate-progress {
  animation: progress 2s ease-in-out infinite;
}

/* 适配暗色模式的 Markdown 样式 */
.dark .markdown-body {
  background-color: transparent;
  color: #e2e8f0;
}
.dark .markdown-body pre {
  background-color: #1e293b;
}
</style>