import { createRouter, createWebHistory, type RouteLocation } from 'vue-router';

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
        {
          path: '/search',
          name: 'search-list',
          component: async () => (await import('@/pages/search')).SearchSourceList,
        },
        {
          // TODO: Убрать из дефолтного лейаута
          path: '/manga/:id',
          name: 'manga',
          component: () => import('@/pages/manga'),
          props: (route: RouteLocation) => ({ id: parseInt(route.params.id as string) }),
        },
      ],
    },
  ],
});

export default router;
