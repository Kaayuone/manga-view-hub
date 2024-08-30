import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root-default',
      component: async () => (await import('@/features/layouts')).LayoutDefault,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/home'),
        },
        {
          path: '/library',
          name: 'library',
          component: () => import('@/pages/library'),
        },
      ],
    },
  ],
});

export default router;
