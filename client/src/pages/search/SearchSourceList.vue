<script setup lang="ts">
import SearchSourceItem from '@/features/search-source-item';
import type { SearchSource } from '@/features/search-source-item/types';

import remangaIcon from '@/assets/images/remanga.png';

const SOURCE_REMANGA: SearchSource = {
  name: 'Remanga',
  description: 'Русский',
  iconPath: remangaIcon,
};

function openSource() {
  // router.push
}
</script>

<template>
  <h1 class="sticky top-0 z-10 bg-background pb-1 text-xl font-medium">Поиск по источникам</h1>

  <!-- TODO: add search field -->

  <div class="py-2">
    <SearchSourceItem :item="SOURCE_REMANGA" class="mb-2" @open="openSource" />
  </div>
</template>
