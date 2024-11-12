<script setup lang="ts">
import SearchSourceItem from '@/features/search-source-item';
import { CONTENT_SOURCE } from '@/constants';
import { useRouter } from 'vue-router';
import { ShadcnInput } from '@/ui/input';

const router = useRouter();

function openSource(name: string) {
  router.push({ name: 'content-source', params: { name } });
}
</script>

<template>
  <h1 class="sticky top-0 z-10 bg-background pb-1 text-xl font-medium">Поиск по источникам</h1>

  <div class="my-2">
    <ShadcnInput placeholder="Поиск" />
  </div>

  <div class="py-2">
    <SearchSourceItem
      :item="CONTENT_SOURCE.sourceItemsMap.get(CONTENT_SOURCE.ContentSourceNames.REMANGA)"
      class="mb-2"
      @open="openSource"
    />
  </div>
</template>
