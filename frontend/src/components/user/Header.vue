<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  Terminal,
  Home,
  Swords,
  Flag,
  MessageSquare,
  Search,
  Box,
  Clock,
  RefreshCw,
  Trash2,
  Sun,
  Moon,
  Bell,
  Settings,
  Edit,
  LogOut,
  Wrench,
} from 'lucide-vue-next';

defineOptions({ name: 'UserHeader' });

const searchText = ref('');
const isDark = ref(false);
const route = useRoute();

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

const updateTheme = () => {
  const el = document.documentElement;
  const body = document.body;
  
  if (isDark.value) {
    el.classList.add('dark');
    body.classList.add('dark');
    el.setAttribute('arco-theme', 'dark');
    body.setAttribute('arco-theme', 'dark');
    el.style.colorScheme = 'dark';
    localStorage.setItem('theme', 'dark');
  } else {
    el.classList.remove('dark');
    body.classList.remove('dark');
    el.removeAttribute('arco-theme');
    body.removeAttribute('arco-theme');
    el.style.colorScheme = 'light';
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
  } else {
    isDark.value = false;
  }
  updateTheme();
});

const containers = ref([
  {
    id: 1,
    name: 'pwn_stack_overflow',
    timeLeft: '00:08:45',
    status: '运行中',
  },
]);
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/90"
  >
    <div class="mx-auto flex h-16 max-w-384 items-center justify-between px-6">
      <!-- 左侧：Logo + 导航 -->
      <div class="flex items-center gap-8">
        <router-link to="/" class="flex cursor-pointer items-center gap-2.5">
          <div
            class="rounded-button flex h-8 w-8 items-center justify-center bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Terminal :size="20" />
          </div>
          <span class="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            SWJTU <span class="text-blue-600">CTF OJ</span>
          </span>
        </router-link>
        <nav class="flex items-center gap-1">
          <!-- 主页图标：变色（激活态） -->
          <router-link
            to="/"
            class="rounded-button flex h-9 w-9 items-center justify-center transition-all"
            :class="
              route.path === '/'
                ? 'font-bold text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            "
          >
            <Home :size="18" />
          </router-link>

          <!-- 训练：不变色（默认态） -->
          <router-link
            to="/training"
            class="rounded-button flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            :class="
              route.path === '/training'
                ? 'font-bold text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            "
          >
            <Swords :size="16" />
            训练
          </router-link>

          <!-- 赛事 -->
          <router-link
            to="/contest"
            class="rounded-button flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            :class="
              route.path.startsWith('/contest')
                ? 'font-bold text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            "
          >
            <Flag :size="16" />
            赛事
          </router-link>

          <!-- 论坛 -->
          <router-link
            to="/forum"
            class="rounded-button flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            :class="
              route.path === '/forum'
                ? 'font-bold text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            "
          >
            <MessageSquare :size="16" />
            论坛
          </router-link>

          <!-- 管理 -->
          <router-link
            to="/admin/manage"
            class="rounded-button flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            :class="
              route.path.startsWith('/admin/manage')
                ? 'font-bold text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            "
          >
            <Wrench :size="16" />
            管理
          </router-link>
        </nav>
      </div>

      <!-- 右侧：搜索 + 工具 + 头像 -->
      <div class="flex items-center gap-3">
        <!-- 搜索 -->
        <div class="group relative">
          <Search class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" :size="16" />
          <input
            v-model="searchText"
            type="text"
            placeholder="搜索题目ID、名称..."
            class="h-9 w-48 rounded-full border border-slate-200 bg-slate-50 pr-4 pl-9 text-sm transition-all focus:w-64 focus:border-blue-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:bg-slate-900"
          />
        </div>

        <!-- 容器监控 -->
        <a-dropdown trigger="click" position="br">
          <div
            class="flex cursor-pointer items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-600 transition-all hover:shadow-md dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <Box :size="16" />
            <span class="font-mono text-sm font-bold">1/3</span>
          </div>
          <template #content>
            <div
              class="rounded-select w-80 border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div class="mb-2 flex items-center justify-between px-1">
                <span
                  class="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
                >运行中的容器</span>
                <span
                  class="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                >1/3</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="container in containers"
                  :key="container.id"
                  class="rounded-inner border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-800"
                >
                  <div class="mb-2 flex items-start justify-between">
                    <div>
                      <div class="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {{ container.name }}
                      </div>
                      <div class="mt-0.5 flex items-center gap-1 font-mono text-xs text-red-500">
                        <Clock :size="12" /> {{ container.timeLeft }}
                      </div>
                    </div>
                    <div
                      class="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {{ container.status }}
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      class="rounded-button flex flex-1 items-center justify-center gap-1 border border-slate-200 bg-white py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-blue-600 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-blue-400"
                    >
                      <RefreshCw :size="12" /> 续时
                    </button>
                    <button
                      class="rounded-button flex flex-1 items-center justify-center gap-1 border border-slate-200 bg-white py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-red-600 hover:text-red-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-red-400"
                    >
                      <Trash2 :size="12" /> 销毁
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-2 text-center">
                <span class="text-xs text-slate-400">下次刷新在 30s 后</span>
              </div>
            </div>
          </template>
        </a-dropdown>

        <div class="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-800" />

        <!-- 黑夜模式切换 -->
        <button
          class="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-400 transition-colors hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-blue-400"
          @click="toggleDarkMode"
        >
          <Sun v-if="isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>

        <!-- 系统工具 -->
        <button
          class="rounded-full p-2 text-slate-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Bell :size="20" />
        </button>
        <router-link
          to="/settings"
          class="rounded-full p-2 text-slate-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Settings :size="20" />
        </router-link>

        <!-- 头像 -->
        <a-dropdown trigger="click" position="br">
          <div
            class="relative h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-blue-100 ring-2 ring-transparent transition-all hover:ring-blue-100 dark:border-slate-700 dark:bg-blue-900 dark:hover:ring-blue-900"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
          <template #content>
            <div
              class="rounded-select w-48 border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                class="rounded-t-select flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div class="flex items-center gap-2">
                  <span class="text-base">🤔</span>
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-200">Thinking...</span>
                </div>
                <button class="text-slate-400 hover:text-blue-600">
                  <Edit :size="12" />
                </button>
              </div>
              <div class="my-1 h-px bg-slate-100 dark:bg-slate-800" />
              <router-link
                to="/settings"
                class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <Settings :size="16" />
                个人设置
              </router-link>
              <div class="my-1 h-px bg-slate-100 dark:bg-slate-800" />
              <router-link
                to="/login"
                class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut :size="16" />
                退出
              </router-link>
            </div>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
</template>
