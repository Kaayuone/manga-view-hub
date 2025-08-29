<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ShadcnButton } from '@/ui/button';

const { title = 'Вы не авторизованы', message = 'Но это можно исправить :)' } = defineProps<{
  title?: string;
  message?: string;
}>();
</script>

<template>
  <div class="w-full max-w-[600px] rounded-lg bg-secondary p-3">
    <h1 class="mb-2 text-center text-xl font-medium">{{ title }}</h1>
    <p class="mx-auto mb-6 max-w-[80%] text-center text-sm">{{ message }}</p>

    <div class="flex justify-center gap-4">
      <RouterLink :to="{ name: 'auth-login' }">
        <ShadcnButton size="sm">Войти</ShadcnButton>
      </RouterLink>

      <RouterLink :to="{ name: 'auth-registration' }">
        <ShadcnButton size="sm">Зарегистрироваться</ShadcnButton>
      </RouterLink>
    </div>
  </div>
</template>
