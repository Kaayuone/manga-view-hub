<script setup lang="ts">
import MangaCard from '@/features/manga-card';
</script>

<template>
  <div class="h-full">
    <!-- Шапка: Заголовок, поиск, фильтр/сортировка, меню действий: обновление библиотека, категории, открыть случайное произведение -->
    <h1 class="sticky top-0 z-10 bg-background text-xl font-medium">Библиотека</h1>

    <div class="h-full">
      <div class="flex flex-wrap items-start justify-start">
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
        <MangaCard />
      </div>
    </div>
  </div>
</template>
