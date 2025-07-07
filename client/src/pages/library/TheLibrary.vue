<script setup lang="ts">
import TitleCard from '@/features/title-card';
import { titleApi } from '@/api';
import { useUserStore } from '@/stores';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { TitleListItem } from '@project-common/types/source';
import type { LibraryItem } from './types';

const userStore = useUserStore();

const titleItems = ref<LibraryItem[]>([]);

const router = useRouter();

onMounted(getLibrary);

async function getLibrary() {
  if (!userStore.userId) return;
  try {
    const { data } = await titleApi.getUserLibrary(userStore.userId);
    titleItems.value = data.map(item => ({
      id: item.id,
      cover: item.cover,
      idInSource: item.idInSource,
      sourceMediaLink: item.sourceMediaLink,
      title: item.title,
      urlName: item.urlInSource,
      sourceName: item.sourceName,
    }));
  } catch (error) {
    console.error(error);
  }
}

function openTitlePage(item: TitleListItem) {
  const _item = titleItems.value.find(
    title => title.urlName === item.urlName && title.id === item.id,
  )!;
  router.push({
    name: 'title-page',
    params: { id: _item.idInSource, sourceName: _item.sourceName, url: _item.urlName },
  });
}
</script>

<template>
  <div class="h-full">
    <!-- Шапка: Заголовок, поиск, фильтр/сортировка, меню действий: обновление библиотека, категории, открыть случайное произведение -->
    <h1 class="sticky top-0 z-10 bg-background text-xl font-medium">Библиотека</h1>

    <div class="h-full">
      <div class="flex flex-wrap items-start justify-start">
        <TitleCard
          v-for="item in titleItems"
          :key="`${item.urlName}-${item.id}`"
          :item="item"
          @open="openTitlePage"
        />
      </div>
    </div>
  </div>
</template>
