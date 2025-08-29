import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const userId = ref(0);

  const hasUserId = computed(() => !!userId.value);

  return { userId, hasUserId };
});
