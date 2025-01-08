<script setup lang="ts">
import SearchSourceItem from '@/features/search-source-item';
import { ShadcnInput } from '@/ui/input';

import { contentSourceApi } from '@/api';

import { useRouter } from 'vue-router';
import { debouncedRef } from '@vueuse/core';
import { onMounted, ref } from 'vue';

import type { Source } from '@project-common/types/source';
import { SPINNER } from '@/constants';

const router = useRouter();

const query = ref('');
const debounceSearchQuery = debouncedRef(query, 500);
const loading = ref(false);
const sources = ref<Source[]>([]);

onMounted(getSourceList);

async function getSourceList() {
  loading.value = true;
  try {
    const { data } = await contentSourceApi.getSourceList(
      debounceSearchQuery.value ? { name: debounceSearchQuery.value } : {},
    );
    sources.value = data;
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
}

function openSource(name: string) {
  router.push({ name: 'content-source', params: { name } });
}
</script>

<template>
  <h1 class="sticky top-0 z-10 bg-background pb-1 text-xl font-medium">Поиск по источникам</h1>

  <div class="my-2">
    <ShadcnInput v-model="query" placeholder="Поиск" />
  </div>

  <AtomSpinner v-if="loading" v-bind="SPINNER.ATOM_SPINNER_FIXED_CONFIG" />

  <div v-else class="py-2">
    <SearchSourceItem
      v-for="source in sources"
      :key="source.name"
      :item="source"
      class="mb-2"
      @open="openSource"
    />
  </div>
</template>
