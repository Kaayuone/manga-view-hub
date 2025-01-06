import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocation } from 'vue-router';

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
          path: '/source/:name',
          name: 'content-source',
          component: () => import('@/pages/content-source'),
          props: true,
        },
      ],
    },
    {
      path: '/title/:sourceName/:id/:url',
      name: 'title-page',
      component: () => import('@/pages/story'),
      props: (route: RouteLocation) => ({
        id: parseInt(route.params.id as string),
        sourceName: route.params.sourceName,
        url: route.params.url,
      }),
    },
    {
      path: '/read/:sourceName/:id/:url',
      name: 'read-manga',
      component: () => import('@/pages/read'),
      props: (route: RouteLocation) => ({
        id: parseInt(route.params.id as string),
        sourceName: route.params.sourceName,
        url: route.params.url,
      }),
    },
  ],
});

export default router;
