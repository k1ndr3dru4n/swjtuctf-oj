<script setup lang="ts">
import UserHeader from '@/components/user/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
    <UserHeader />
    <main class="mx-auto max-w-384 p-6">
      <router-view />
    </main>
  </div>
</template>
