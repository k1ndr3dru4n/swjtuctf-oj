<script setup lang="ts">
import { Sparkles, Globe, Zap, ChevronRight } from 'lucide-vue-next';

// 题目数据
const webChallenges = [
  { id: 1, name: 'HTTP 基础：Header 隐写', difficulty: '简单', colorClass: 'bg-emerald-500' },
  { id: 2, name: 'SQLi 1：简单布尔盲注', difficulty: '简单', colorClass: 'bg-emerald-500' },
  { id: 3, name: 'XSS 实战：Cookie 劫持', difficulty: '中等', colorClass: 'bg-amber-500' },
];

const newChallenges = [
  { id: 1, name: 'ShellCode 入门：Orw', difficulty: '困难', colorClass: 'bg-rose-500' },
  { id: 2, name: 'Go 程序逆向：SimpleRE', difficulty: '中等', colorClass: 'bg-amber-500' },
  { id: 3, name: 'RSA 进阶：维纳攻击', difficulty: '困难', colorClass: 'bg-rose-500' },
];
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between px-2">
      <h3 class="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
        <Sparkles class="text-amber-500" :size="20" />
        推荐训练
      </h3>
      <a
        href="#"
        class="flex items-center gap-1 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        查看全部 <ChevronRight :size="12" />
      </a>
    </div>

    <div class="grid h-65 grid-cols-3 gap-6">
      <!-- 推荐题单 1 (Web) -->
      <div
        class="group rounded-card relative flex cursor-pointer flex-col overflow-hidden border border-slate-200 bg-white p-5 transition-all hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-600 dark:hover:shadow-cyan-900/20"
      >
        <div
          class="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition-colors group-hover:bg-cyan-500/20"
        />
        <div class="mb-4 flex items-center gap-3">
          <div
            class="rounded-inner flex h-10 w-10 items-center justify-center bg-linear-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-200 transition-transform group-hover:scale-110 dark:shadow-none"
          >
            <Globe :size="20" />
          </div>
          <div>
            <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">
              Web 入门
            </h4>
            <p
              class="text-[9px] font-black tracking-widest text-cyan-600 uppercase dark:text-cyan-400"
            >
              精通 Web 开发
            </p>
          </div>
        </div>
        <div class="flex-1 space-y-2">
          <div
            v-for="c in webChallenges"
            :key="c.id"
            class="rounded-button flex items-center justify-between bg-slate-50 p-2 transition-colors group-hover:bg-cyan-50 dark:bg-slate-800 dark:group-hover:bg-cyan-900/30"
          >
            <div class="flex items-center gap-2 overflow-hidden">
              <Globe class="shrink-0 text-cyan-500" :size="14" />
              <span class="truncate text-[11px] font-bold text-slate-700 dark:text-slate-300">{{
                c.name
              }}</span>
            </div>
            <span
              :class="`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-black text-white ${c.colorClass}`"
            >{{ c.difficulty }}</span>
          </div>
        </div>
      </div>

      <!-- 推荐题单 2 (上新) -->
      <div
        class="group rounded-card relative flex cursor-pointer flex-col overflow-hidden border border-slate-200 bg-white p-5 transition-all hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-600 dark:hover:shadow-indigo-900/20"
      >
        <div
          class="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-colors group-hover:bg-indigo-500/20"
        />
        <div class="mb-4 flex items-center gap-3">
          <div
            class="rounded-inner flex h-10 w-10 items-center justify-center bg-linear-to-br from-indigo-400 to-indigo-600 text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110 dark:shadow-none"
          >
            <Zap :size="20" />
          </div>
          <div>
            <h4 class="text-sm font-black text-slate-800 dark:text-slate-100">
              题目上新
            </h4>
            <p
              class="text-[9px] font-black tracking-widest text-indigo-600 uppercase dark:text-indigo-400"
            >
              最新挑战
            </p>
          </div>
        </div>
        <div class="flex-1 space-y-2">
          <div
            v-for="c in newChallenges"
            :key="c.id"
            class="rounded-button flex items-center justify-between bg-slate-50 p-2 transition-colors group-hover:bg-rose-50 dark:bg-slate-800 dark:group-hover:bg-rose-900/30"
          >
            <div class="flex items-center gap-2 overflow-hidden">
              <Zap class="shrink-0 text-rose-500" :size="14" />
              <span class="truncate text-[11px] font-bold text-slate-700 dark:text-slate-300">{{
                c.name
              }}</span>
            </div>
            <span
              :class="`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-black text-white uppercase ${c.colorClass}`"
            >{{ c.difficulty }}</span>
          </div>
        </div>
      </div>

      <!-- 正在进行的比赛 -->
      <div
        class="group rounded-card relative flex cursor-pointer flex-col overflow-hidden border border-blue-200 bg-linear-to-br from-blue-600 to-blue-800 p-5 text-white transition-all hover:shadow-2xl hover:shadow-blue-300 dark:border-blue-900 dark:hover:shadow-blue-900/50"
      >
        <div
          class="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
        />
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 animate-ping rounded-full bg-red-400" />
            <span class="text-[10px] font-black tracking-widest uppercase">正在进行</span>
          </div>
          <span class="rounded-full bg-white/20 px-2 py-0.5 font-mono text-[10px]">#2026-Rookie</span>
        </div>

        <h4 class="mb-4 text-lg leading-tight font-black">
          SWJTU Rookie CTF Game 2026
        </h4>

        <div class="flex-1 space-y-4">
          <div class="flex items-end justify-between">
            <div>
              <p class="text-[10px] font-bold text-blue-200 uppercase">
                当前排名
              </p>
              <p class="text-2xl font-black italic">
                #27 <span class="text-xs font-normal opacity-60">/ 78</span>
              </p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold text-blue-200 uppercase">
                剩余时间
              </p>
              <p class="font-mono text-sm font-bold">
                92天 17时 00分
              </p>
            </div>
          </div>
          <div class="space-y-1.5">
            <div class="flex justify-between text-[10px] font-bold opacity-80">
              <span>进度</span>
              <span>65%</span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                class="h-full rounded-full bg-white shadow-[0_0:10px_rgba(255,255,255,0.5)]"
                style="width: 65%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
