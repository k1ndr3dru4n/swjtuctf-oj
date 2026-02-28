<script setup lang="ts">
import { computed } from 'vue'
import { getCarouselSlides } from '@/stores/homeStore'

defineOptions({ name: 'HomeBanner' })

const slides = computed(() => getCarouselSlides())
</script>

<template>
  <div class="group rounded-card relative h-full overflow-hidden bg-slate-800 shadow-lg">
    <a-carousel
      v-if="slides.length > 0"
      class="rounded-card h-full w-full overflow-hidden"
      :auto-play="true"
      indicator-type="line"
      show-arrow="hover"
    >
      <a-carousel-item v-for="slide in slides" :key="slide.id">
        <div class="relative h-full w-full">
          <img
            :src="slide.imageUrl"
            class="h-full w-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
            :alt="slide.title"
          />
          <div
            class="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-900/80 to-transparent p-10"
          >
            <span
              v-if="slide.badge"
              class="mb-4 w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white"
            >
              {{ slide.badge }}
            </span>
            <h2 class="mb-2 text-4xl font-black text-white">
              {{ slide.title }}
            </h2>
            <p class="max-w-lg text-slate-200">
              {{ slide.subtitle }}
            </p>
          </div>
        </div>
      </a-carousel-item>
    </a-carousel>
    <div
      v-else
      class="flex h-full items-center justify-center text-slate-400 dark:text-slate-500"
    >
      暂无轮播图
    </div>
  </div>
</template>