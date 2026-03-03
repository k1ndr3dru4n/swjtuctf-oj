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
        {
          path: 'training',
          name: 'training',
          component: () => import('@/views/user/training/TrainingView.vue'),
        },
        {
          path: 'announcement',
          name: 'announcement',
          component: () => import('@/views/user/announcement/AnnouncementListView.vue'),
        },
        {
          path: 'announcement/:id',
          name: 'announcementDetail',
          component: () => import('@/views/user/announcement/AnnouncementDetailView.vue'),
        },
      ],
    },
  ],
})

export default router
