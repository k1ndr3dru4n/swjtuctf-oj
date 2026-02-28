<script setup lang="ts">
import Banner from '@/components/user/home/Banner.vue'
import Announcements from '@/components/user/home/Announcements.vue'
import CheckIn from '@/components/user/home/CheckIn.vue'
import ActivityFeed from '@/components/user/home/ActivityFeed.vue'
import Sidebar from '@/components/user/training/Sidebar.vue'
</script>

<template>
  <div class="space-y-8">
    <!-- 第一行：Banner (45%: 9/20) + 公告 (30%: 6/20) + 签到 (25%: 5/20)，与 CTFOJDemo 一致固定行高 20rem -->
    <section class="grid h-80 grid-cols-20 gap-6">
      <div class="col-span-9 min-h-0">
        <Banner class="h-full" />
      </div>
      <div class="col-span-6 min-h-0">
        <Announcements />
      </div>
      <div class="col-span-5 min-h-0">
        <CheckIn />
      </div>
    </section>

    <!-- 第二行：动态 (75%: 15/20) + 侧边栏 (25%: 5/20) -->
    <section class="grid grid-cols-20 gap-6 pb-12">
      <div class="col-span-15">
        <ActivityFeed />
      </div>
      <div class="col-span-5">
        <Sidebar />
      </div>
    </section>
  </div>
</template>