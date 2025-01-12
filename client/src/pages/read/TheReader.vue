<script setup lang="ts">
import { ShadcnButton } from '@/ui/button';
import { ArrowLeft, Menu, Settings } from 'lucide-vue-next';

import { useUserProgressStore } from '@/stores';
import { useRouter } from 'vue-router';

import { sourceApi, titleApi } from '@/api';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { SourceName } from '@project-common/types/source';
import type { ChapterFrame, TitleChapter, TitleInfo } from '@project-common/types/title';
import type { ChapterInfo } from '@/types';
import { CONTENT_SOURCE, SPINNER } from '@/constants';

const props = defineProps<{
  id: number;
  titleId: number;
  sourceName: SourceName;
  url: string;
}>();

const menu = ref(true);
const framesLoading = ref(false);
const frames = ref<ChapterFrame[]>([]);
const titleInfo = ref<TitleInfo>();
const chapterInfo = ref<ChapterInfo>();
const chapters = ref<TitleChapter[]>([]);

const showPreviousChapterButton = computed(() => {
  const currentChapterIndex = chapters.value.findIndex(chapter => chapter.id === props.id);
  return (
    chapters.value.length > 0 &&
    chapters.value.at(0)?.id !== props.id &&
    !chapters.value.at(currentChapterIndex - 1)?.isPaid
  );
});
const showNextChapterButton = computed(() => {
  const currentChapterIndex = chapters.value.findIndex(chapter => chapter.id === props.id);
  return (
    chapters.value.length > 0 &&
    chapters.value.at(-1)?.id !== props.id &&
    !chapters.value.at(currentChapterIndex + 1)?.isPaid
  );
});

const router = useRouter();
const { setProgress } = useUserProgressStore();

onMounted(() => {
  getFrames();
  getTitle().then(() => getAllChapters(titleInfo.value!.chapterListId));
});

onBeforeUnmount(() => {
  frames.value.forEach(frame => URL.revokeObjectURL(frame.url));
});

async function getFrames() {
  framesLoading.value = true;
  try {
    const { data } = await titleApi.getChapterInfo(props.sourceName, props.id);
    chapterInfo.value = {
      tome: data.tome,
      chapter: data.chapter,
    };
    data.pages.forEach((frame, index) => {
      frames.value.push({ ...frame, url: '' });
      // TODO: Optimize using intersection observer
      getImage(frame, index);
    });
  } catch (error) {
    console.error(error);
  }
  framesLoading.value = false;
}

async function getImage(frame: ChapterFrame, index: number) {
  try {
    const { data } = await titleApi.getFrameThroughProxy(props.sourceName, frame.url);
    const _frame = frames.value.at(index)!;
    _frame.url = URL.createObjectURL(data);
  } catch (error) {
    console.error(error);
  }
}

async function getTitle() {
  try {
    const { data } = await sourceApi.getTitleByIdInContentSource(props.titleId, props.sourceName, {
      titleUrl: props.url,
      useUrlInsteadId: CONTENT_SOURCE.SourcesTitleUseUrl.includes(props.sourceName),
    });
    titleInfo.value = data;
  } catch (error) {
    console.error(error);
  }
}

async function getAllChapters(chapterListId: number) {
  try {
    const { data } = await sourceApi.getAllTitleChapters(props.sourceName, chapterListId);
    chapters.value = data;
  } catch (error) {
    console.error(error);
  }
}

function backToTitle() {
  router.replace({
    name: 'title-page',
    params: {
      id: props.titleId,
      sourceName: props.sourceName,
      url: props.url,
    },
  });
}

function openPreviousChapter() {
  const currentChapterIndex = chapters.value.findIndex(chapter => chapter.id === props.id);
  router.replace({
    name: 'read-manga',
    params: {
      id: chapters.value.at(currentChapterIndex - 1)!.id,
      titleId: props.titleId,
      sourceName: props.sourceName,
      url: props.url,
    },
  });
}

function openNextChapter() {
  const currentChapterIndex = chapters.value.findIndex(chapter => chapter.id === props.id);
  router.replace({
    name: 'read-manga',
    params: {
      id: chapters.value.at(currentChapterIndex + 1)!.id,
      titleId: props.titleId,
      sourceName: props.sourceName,
      url: props.url,
    },
  });
  setProgress(props.sourceName, props.url, chapters.value.at(currentChapterIndex + 1)!.id);
}

function toggleMenu() {
  menu.value = !menu.value;
}
</script>

<template>
  <div>
    <header
      :class="{ '-translate-y-full': !menu }"
      class="fixed top-0 z-[1] flex w-full justify-between bg-background/90 px-2 py-2 transition-all"
    >
      <ShadcnButton variant="ghost" size="icon" @click="backToTitle">
        <ArrowLeft />
      </ShadcnButton>

      <div class="mr-auto px-2">
        <h1
          :title="titleInfo?.title"
          class="max-w-[calc(100vw-128px)] overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-none"
        >
          {{ titleInfo?.title }}
        </h1>

        <span class="text-xs leading-3">
          {{ `${chapterInfo?.tome}. ` }}{{ chapterInfo?.chapter }}
        </span>
      </div>

      <!-- TODO: settings menu -->
      <ShadcnButton variant="ghost" size="icon">
        <Settings />
      </ShadcnButton>

      <!-- TODO: chapter menu -->
      <ShadcnButton variant="ghost" size="icon">
        <Menu />
      </ShadcnButton>
    </header>

    <div class="mr-auto px-2 py-3">
      <ShadcnButton
        :class="{ 'transparent-inactive': !showPreviousChapterButton }"
        class="mx-auto mb-3 block"
        variant="secondary"
        size="xs"
        @click="openPreviousChapter"
      >
        Предыдущая глава
      </ShadcnButton>

      <h1
        :title="titleInfo?.title"
        class="overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm leading-none"
      >
        {{ titleInfo?.title }}
      </h1>

      <span class="block text-center text-xs leading-3"> Глава {{ chapterInfo?.chapter }} </span>
    </div>

    <div v-if="!framesLoading" @click="toggleMenu">
      <template v-for="frame in frames">
        <img
          v-if="frame.url"
          :key="frame.id"
          :src="frame.url"
          :width="frame.width"
          :height="frame.height"
          loading="lazy"
          alt=""
        />
      </template>
    </div>

    <div v-else>
      <AtomSpinner v-bind="SPINNER.ATOM_SPINNER_FIXED_CONFIG" />
    </div>

    <div class="mr-auto mt-3 px-2 py-3">
      <ShadcnButton
        :class="{ 'transparent-inactive': !showNextChapterButton }"
        class="mx-auto block"
        variant="secondary"
        size="xs"
        @click="openNextChapter"
      >
        Следующая глава
      </ShadcnButton>
    </div>
  </div>
</template>
