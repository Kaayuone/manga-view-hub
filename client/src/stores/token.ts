import { computed } from 'vue';
import { defineStore } from 'pinia';
import type { TokenResponse } from '@/api/types/response.types';
import { useLocalStorage } from '@vueuse/core';

export const useTokenStore = defineStore('token', () => {
  const accessToken = useLocalStorage<string>('accessToken', '');
  const refreshToken = useLocalStorage<string>('refreshToken', '');

  const hasAccessToken = computed(() => Boolean(accessToken.value));
  const hasToken = computed(() => Boolean(accessToken.value) || Boolean(refreshToken.value));

  function setTokens(tokens: TokenResponse) {
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;
  }

  return { accessToken, refreshToken, hasToken, hasAccessToken, setTokens };
});
