<script setup lang="ts">
import { useTokenStore } from '@/stores';
import { ShadcnButton } from '@/ui/button';
import { RouterLink } from 'vue-router';

const tokenStore = useTokenStore();
</script>

<template>
  <div v-if="!tokenStore.hasToken" class="flex h-full items-center">
    <div class="w-full rounded-lg bg-secondary p-3">
      <h1 class="text-center text-xl font-medium">Вы не авторизованы</h1>
      <p class="mb-6 text-center text-sm">Но это можно исправить :)</p>

      <div class="flex justify-center gap-4">
        <RouterLink :to="{ name: 'auth-login' }">
          <ShadcnButton size="sm">Войти</ShadcnButton>
        </RouterLink>

        <RouterLink :to="{ name: 'auth-registration' }">
          <ShadcnButton size="sm">Зарегистрироваться</ShadcnButton>
        </RouterLink>
      </div>
    </div>
  </div>

  <div v-else>
    <h1 class="text-center text-xl font-medium">Вы авторизованы</h1>
  </div>
</template>
