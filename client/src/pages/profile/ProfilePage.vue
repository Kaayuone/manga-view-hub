<script setup lang="ts">
import UnauthorizedMessage from '@/components/UnauthorizedMessage.vue';
import { useTokenStore } from '@/stores';

const tokenStore = useTokenStore();
</script>

<template>
  <div v-if="!tokenStore.hasToken" class="flex h-full items-center">
    <UnauthorizedMessage />
  </div>

  <div v-else>
    <h1 class="text-center text-xl font-medium">Вы авторизованы</h1>
  </div>
</template>
