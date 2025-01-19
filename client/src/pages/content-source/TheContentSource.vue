<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import TitleCard from '@/features/title-card';
import { ShadcnInput } from '@/ui/input';
import { ShadcnButton } from '@/ui/button';

import { useRouter } from 'vue-router';

import { searchApi } from '@/api';

import { computed, ref, watch } from 'vue';
import { debouncedRef } from '@vueuse/core';

import type { SourceName, TitleListItem } from '@project-common/types/source';
import { SPINNER } from '@/constants';

const props = defineProps<{
  name: SourceName;
}>();

const loading = ref(false);
const titleList = ref<TitleListItem[]>([]);
const query = ref('');
const debounceSearchQuery = debouncedRef(query, 500);

const hasItems = computed(() => titleList.value.length > 0);

const router = useRouter();

watch(debounceSearchQuery, getTitleList);

async function getTitleList() {
  loading.value = true;
  try {
    const { data } = await searchApi.getTitlesInSourceBySearch(props.name, {
      search: debounceSearchQuery.value,
    });

    titleList.value = data;
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
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
      <div v-if="!loading" class="flex flex-wrap items-start justify-start">
        <TitleCard
          v-for="(title, index) in titleList"
          :key="`manga-${index}`"
          :item="title"
          @open="openTitlePage"
        />
      </div>

      <AtomSpinner v-else v-bind="SPINNER.ATOM_SPINNER_FIXED_CONFIG" />
    </div>
  </div>
</template>
