<script setup lang="ts">
import { ref, computed } from 'vue';
import { CalendarCheck2, Sparkles } from 'lucide-vue-next';
import { getCheckInConfig } from '@/stores/homeStore';

const isCheckedIn = ref(false);
const checkInConfig = computed(() => getCheckInConfig());

const handleCheckIn = () => {
  isCheckedIn.value = true;
};
</script>

<template>
  <div v-if="checkInConfig.enabled" class="perspective-1000 relative flex flex-col h-full">
    <Transition name="flip" mode="out-in">
      <!-- 未打卡状态 -->
      <div
        v-if="!isCheckedIn"
        class="rounded-card flex h-full w-full flex-col items-center justify-center border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
      >
        <div
          class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20"
        >
          <CalendarCheck2 :size="32" class="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 class="mb-1 text-lg font-bold dark:text-slate-100">
          每日签到
        </h3>
        <p class="mb-6 text-center text-xs text-slate-400 dark:text-slate-500">
          @雷神托尔 jrys
        </p>
        <button
          class="rounded-inner w-full bg-blue-600 py-3 text-base font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
          @click="handleCheckIn"
        >
          立即打卡
        </button>
      </div>

      <!-- 已打卡状态 -->
      <div
        v-else
        class="rounded-card relative flex h-full w-full flex-col overflow-hidden border border-blue-100 bg-linear-to-br from-white to-blue-50 p-5 shadow-md transition-all duration-300 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
      >
        <!-- 背景装饰 -->
        <div class="absolute top-0 right-0 p-3 opacity-10 dark:opacity-5">
          <Sparkles :size="80" class="text-blue-600 dark:text-blue-400" />
        </div>

        <!-- 头部运势信息 -->
        <div class="mb-4 flex items-start justify-between">
          <div>
            <p
              class="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500"
            >
              今日运势
            </p>
            <h3 class="mt-0.5 text-2xl font-black text-blue-600 dark:text-blue-400">
              {{ checkInConfig.fortune }}
            </h3>
          </div>
          <div class="text-right">
            <p
              class="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500"
            >
              Streak
            </p>
            <p class="font-mono text-xl font-bold text-slate-700 dark:text-slate-300">
              7 Days
            </p>
          </div>
        </div>

        <!-- 宜/忌 列表 -->
        <div class="space-y-2.5">
          <div class="flex items-center gap-3">
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            >
              宜
            </div>
            <div>
              <p class="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {{ checkInConfig.yiText }}
              </p>
              <p class="text-[9px] leading-tight text-slate-400 dark:text-slate-500">
                {{ checkInConfig.yiDesc }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400"
            >
              忌
            </div>
            <div>
              <p class="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {{ checkInConfig.jiText }}
              </p>
              <p class="text-[9px] leading-tight text-slate-400 dark:text-slate-500">
                {{ checkInConfig.jiDesc }}
              </p>
            </div>
          </div>
        </div>

        <!-- 每日一题卡片 -->
        <div
          class="rounded-inner mt-4 border border-blue-100/50 bg-white/60 p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-800/40"
        >
          <div class="mb-1 flex items-center justify-between">
            <div class="flex items-center gap-1">
              <span class="h-1 w-1 animate-pulse rounded-full bg-blue-500" />
              <span
                class="text-[9px] font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400"
              >每日一题</span>
            </div>
            <span class="font-mono text-[9px] text-slate-400 dark:text-slate-500">#{{ checkInConfig.dailyChallengeId }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="mr-2 truncate text-[11px] font-bold text-slate-700 dark:text-slate-200">{{ checkInConfig.dailyChallengeTitle }}</span>
            <button
              class="rounded-button bg-blue-600 px-2.5 py-1 text-[9px] font-bold text-white shadow-md shadow-blue-200 transition-colors hover:bg-blue-700"
            >
              去挑战
            </button>
          </div>
        </div>

        <!-- 底部格言 -->
        <div class="mt-auto border-t border-blue-50 pt-2 text-center dark:border-slate-800/50">
          <p class="text-[9px] italic text-blue-400/80 dark:text-blue-500/80">
            “ {{ checkInConfig.motto }} ”
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.flip-enter-active,
.flip-leave-active {
  transition: all 0.5s ease;
}

.flip-enter-from,
.flip-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}
</style>
