<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import TitleCard from '@/features/title-card';
import { ShadcnInput } from '@/ui/input';
import { ShadcnButton } from '@/ui/button';

import { contentSource } from '@/api';
import { computed, ref, watch } from 'vue';
import { debouncedRef } from '@vueuse/core';

import type { TitleListItem } from '@/features/title-card/types';

const props = defineProps<{
  name: string;
}>();

const titleList = ref<TitleListItem[]>([]);
const query = ref('');
const debounceSearchQuery = debouncedRef(query, 500);

const hasItems = computed(() => titleList.value.length > 0);

watch(debounceSearchQuery, getTitleList);

async function getTitleList() {
  try {
    const { data } = await contentSource.getContentSourceManga(props.name, {
      search: debounceSearchQuery.value,
    });

    titleList.value = data;
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div :class="{ 'h-full': hasItems }">
    <div class="sticky top-0 z-10 flex gap-x-2 bg-background">
      <RouterLink :to="{ name: 'search-list' }">
        <ShadcnButton size="icon" variant="ghost">
          <ArrowLeft />
        </ShadcnButton>
      </RouterLink>

      <h1 class="text-xl font-medium">
        {{ props.name }}
      </h1>
    </div>

    <div class="my-2">
      <ShadcnInput v-model="query" placeholder="Поиск" />
    </div>

    <div class="h-full">
      <div class="flex flex-wrap items-start justify-start">
        <TitleCard v-for="(title, index) in titleList" :key="`manga-${index}`" :item="title" />
      </div>
    </div>
  </div>
</template>
