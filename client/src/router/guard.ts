import { useTokenStore, useLibraryStore } from '@/stores';
import { useUserStore } from '@/stores/user';
import { jwtDecode } from 'jwt-decode';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export function navigationGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const tokenStore = useTokenStore();
  if (to.meta.requiresAuth && !tokenStore.hasToken) {
    next('/login');
  } else if (tokenStore.hasAccessToken) {
    const userStore = useUserStore();
    if (!userStore.userId) {
      userStore.userId = jwtDecode(tokenStore.accessToken).id;
      const libraryStore = useLibraryStore();
      libraryStore.getLibraryItems(userStore.userId);
    }
    if (to.path === '/login' || to.path === '/register') {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
}
