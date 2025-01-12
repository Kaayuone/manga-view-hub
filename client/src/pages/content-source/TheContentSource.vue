<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import TitleCard from '@/features/title-card';
import { ShadcnInput } from '@/ui/input';
import { ShadcnButton } from '@/ui/button';

import { useRouter } from 'vue-router';

import { sourceApi } from '@/api';

import { computed, ref, watch } from 'vue';
import { debouncedRef } from '@vueuse/core';

import type { TitleListItem } from '@project-common/types/source';

const props = defineProps<{
  name: string;
}>();

const titleList = ref<TitleListItem[]>([]);
const query = ref('');
const debounceSearchQuery = debouncedRef(query, 500);

const hasItems = computed(() => titleList.value.length > 0);

const router = useRouter();

watch(debounceSearchQuery, getTitleList);

async function getTitleList() {
  try {
    const { data } = await sourceApi.getContentSourceStories(props.name, {
      search: debounceSearchQuery.value,
    });

    titleList.value = data;
  } catch (error) {
    console.error(error);
  }
}

function openTitlePage(item: TitleListItem) {
  router.push({
    name: 'title-page',
    params: { id: item.id, sourceName: props.name, url: item.urlName },
  });
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
        <TitleCard
          v-for="(title, index) in titleList"
          :key="`manga-${index}`"
          :item="title"
          @open="openTitlePage"
        />
      </div>
    </div>
  </div>
</template>
