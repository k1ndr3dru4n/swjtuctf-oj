<script setup lang="ts">
import { Megaphone } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { getPublishedAnnouncements } from '@/stores/announcementStore';
import type { Announcement } from '@/types/announcement';

defineOptions({ name: 'HomeAnnouncements' });

const router = useRouter();

// 获取已发布的公告（最多显示3条）
const announcements = computed(() => {
  const published = getPublishedAnnouncements();
  return published.slice(0, 3).map((ann: Announcement) => {
    // 根据标题内容判断类型
    let type = '系统通知';
    let typeColor = 'text-amber-400';
    if (ann.title.includes('比赛') || ann.title.includes('赛事') || ann.title.includes('CTF')) {
      type = '赛事公告';
      typeColor = 'text-blue-400';
    } else if (ann.title.includes('更新') || ann.title.includes('版本')) {
      type = '版本更新';
      typeColor = 'text-emerald-400';
    }
    
    // 格式化日期
    const dateParts = ann.createdAt?.split(' ')[0]?.split('-')
    const date = dateParts && dateParts.length > 1 ? dateParts.slice(1).join('-') : '';
    
    return {
      id: ann.id,
      type,
      typeColor,
      title: ann.title,
      date,
    };
  });
});

// 跳转到公告列表
const goToAnnouncementList = () => {
  router.push({ path: '/announcement' });
};

// 跳转到公告详情
const goToAnnouncementDetail = (id: number) => {
  router.push({ path: `/announcement/${id}` });
};
</script>

<template>
  <div
    class="rounded-card relative flex h-full flex-col overflow-hidden border border-slate-800 bg-slate-900 p-5 shadow-2xl transition-colors"
  >
    <!-- 背景装饰 -->
    <div class="absolute top-0 right-0 h-24 w-24 bg-blue-500/10 blur-3xl" />

    <div class="relative mb-4 flex shrink-0 items-center justify-between px-1">
      <h3 class="flex items-center gap-2 text-base font-bold text-slate-100">
        <Megaphone class="text-blue-400" :size="18" />
        全站公告
      </h3>
    </div>

    <div class="custom-scrollbar relative mb-4 flex-1 space-y-4 overflow-y-auto pr-1">
      <div
        v-for="(item, index) in announcements"
        :key="item.id"
        :class="['group cursor-pointer', index !== 0 ? 'border-t border-slate-800 pt-3' : '']"
        @click="goToAnnouncementDetail(item.id)"
      >
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span
              :class="`mb-0.5 text-[9px] font-black tracking-tighter uppercase ${item.typeColor}`"
            >{{ item.type }}</span>
            <p
              :class="`text-xs font-bold text-slate-200 hover:${item.typeColor} line-clamp-1 transition-colors`"
            >
              {{ item.title }}
            </p>
          </div>
          <span class="ml-2 font-mono text-[9px] text-slate-500">{{ item.date }}</span>
        </div>
      </div>
    </div>

    <button
      class="rounded-inner relative mt-auto w-full shrink-0 border border-slate-700 bg-slate-800 py-2 text-[10px] font-black text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
      @click="goToAnnouncementList"
    >
      查看全部历史公告
    </button>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
