import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/UserLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/user/home/HomeView.vue'),
        },
      ],
    },
  ],
})

export default router
