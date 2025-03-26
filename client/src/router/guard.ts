import { useTokenStore } from '@/stores';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export function navigationGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const tokenStore = useTokenStore();
  if (to.meta.requiresAuth && !tokenStore.hasToken) {
    next('/login');
  } else if (tokenStore.hasToken) {
    if (to.path === '/login' || to.path === '/register') {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
}
