<script setup lang="ts">
import {
  ArrowDownToLine,
  ArrowLeft,
  BookCheck,
  Clock,
  EllipsisVertical,
  Heart,
  Play,
  User,
} from 'lucide-vue-next';
import ChapterItem from '@/features/chapter-item';
import { ShadcnButton } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { AspectRatio } from '@/ui/aspect-ratio';
import { Badge } from '@/ui/badge';
import { Separator } from '@/ui/separator';

import { useRouter } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core';
import { usePagination } from '@/lib/pagination';
import { useUserProgressStore } from '@/stores';

import { sourceApi } from '@/api';

import { computed, onMounted, ref } from 'vue';
import type { SourceName } from '@project-common/types/source';
import type { TitleChapter, TitleInfo } from '@project-common/types/title';
import { CONTENT_SOURCE, SPINNER } from '@/constants';

const props = defineProps<{
  id: number;
  sourceName: SourceName;
  url: string;
}>();

const loadingChapters = ref(false);
const titleInfo = ref<TitleInfo>();
const chapters = ref<TitleChapter[]>([]);

const endOfChapters = ref<HTMLDivElement>();

const titleCover = computed(() =>
  titleInfo.value ? `${titleInfo.value.sourceMediaLink}${titleInfo.value.cover}` : '',
);
const hasTranslators = computed(
  () => titleInfo?.value?.translators && titleInfo?.value?.translators.length > 0,
);
const lastChapterRead = computed(() => {
  const sourceProgress = userProgress[props.sourceName];
  return sourceProgress ? sourceProgress[props.url] : null;
});

const router = useRouter();
const { userProgress, setProgress } = useUserProgressStore();
const { pagination, paginationInfo, next, setPagination, setPaginationInfo } = usePagination();

onMounted(async () => {
  await getTitle();
  getChapterList();
  useIntersectionObserver(endOfChapters, onIntersectionObserver);
});

async function getTitle() {
  try {
    const { data } = await sourceApi.getTitleByIdInContentSource(props.id, props.sourceName, {
      titleUrl: props.url,
      useUrlInsteadId: CONTENT_SOURCE.SourcesTitleUseUrl.includes(props.sourceName),
    });
    titleInfo.value = data;
  } catch (error) {
    console.error(error);
  }
}

async function getChapterList() {
  if (!titleInfo.value) return;

  loadingChapters.value = true;
  try {
    const { data } = await sourceApi.getTitleChaptersInContentSource(props.sourceName, {
      page: pagination.page.value,
      size: pagination.size.value,
      chapterListId: titleInfo.value?.chapterListId,
    });
    chapters.value = [...chapters.value, ...data.content];
    setPagination(data.page, data.size);
    setPaginationInfo({
      isFirst: data.isFirst,
      isLast: data.isLast,
    });
  } catch (error) {
    console.error(error);
  }
  loadingChapters.value = false;
}

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
  if (entry.isIntersecting && !paginationInfo.value.isLast && chapters.value.length > 0) {
    next();
    getChapterList();
  }
}

function read(chapter: TitleChapter) {
  const chapterToReadIndex = chapters.value.findIndex(_chapter => _chapter.id === chapter.id);
  const lastChapterReadIndex = chapters.value.findIndex(
    _chapter => _chapter.id === lastChapterRead.value,
  );
  if (chapterToReadIndex < lastChapterReadIndex) {
    setProgress(props.sourceName, props.url, chapter.id);
  }
  router.push({
    name: 'read-manga',
    params: {
      id: chapter.id,
      sourceName: props.sourceName,
      url: props.url,
      titleId: props.id,
    },
  });
}

async function readLast() {
  const sourceProgress = userProgress[props.sourceName];
  const lastChapter = sourceProgress ? sourceProgress[props.url] : 0;

  // TODO: rework chapter list with this request
  let allChapters: TitleChapter[] = [];
  try {
    const { data } = await sourceApi.getAllTitleChapters(
      props.sourceName,
      titleInfo.value!.chapterListId,
    );
    allChapters = data;
  } catch (error) {
    console.error(error);
  }

  if (!lastChapter) {
    const firstChapter = allChapters.at(0);
    if (!firstChapter) {
      alert('Не получилось загрузить главу');
      return;
    }
    if (firstChapter.isPaid) {
      // TODO: replace alert with app notifications
      alert('Первая глава платная, не могу открыть');
      return;
    }

    router.push({
      name: 'read-manga',
      params: {
        id: firstChapter?.id,
        sourceName: props.sourceName,
        url: props.url,
        titleId: props.id,
      },
    });
    setProgress(props.sourceName, props.url, firstChapter.id);
  } else {
    const currentChapterIndex = allChapters.findIndex(chapter => chapter.id === lastChapter);
    const nextChapter = allChapters.at(currentChapterIndex + 1);
    if (!nextChapter) {
      alert('Не получилось загрузить главу');
      return;
    }
    if (nextChapter.isPaid) {
      // TODO: replace alert with app notifications
      alert('Следующая глава платная, не могу открыть');
      return;
    }

    router.push({
      name: 'read-manga',
      params: {
        id: nextChapter?.id,
        sourceName: props.sourceName,
        url: props.url,
        titleId: props.id,
      },
    });
    setProgress(props.sourceName, props.url, nextChapter.id);
  }
}

function backToList() {
  router.push({ name: 'content-source', params: { name: props.sourceName } });
}
</script>

<template>
  <div class="pb-3">
    <div class="sticky top-0 z-[1] flex justify-between bg-background py-2">
      <ShadcnButton variant="ghost" size="icon" @click="backToList">
        <ArrowLeft />
      </ShadcnButton>

      <div class="flex gap-x-2">
        <ShadcnButton variant="ghost" size="icon">
          <Heart />
        </ShadcnButton>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <ShadcnButton variant="ghost" size="icon">
              <ArrowDownToLine />
            </ShadcnButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Следующая глава</DropdownMenuItem>
            <DropdownMenuItem>Следующие 5 глав</DropdownMenuItem>
            <DropdownMenuItem>Следующие 10 глав</DropdownMenuItem>
            <DropdownMenuItem>Следующие 25 глав</DropdownMenuItem>
            <DropdownMenuItem>Непрочитанные главы</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <ShadcnButton variant="ghost" size="icon">
              <EllipsisVertical />
            </ShadcnButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>Обновить</DropdownMenuItem>
            <DropdownMenuItem>Поделиться</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div class="container px-3">
      <div class="my-3 flex items-start">
        <div class="min-w-[100px]">
          <AspectRatio :ratio="2 / 3">
            <img
              :src="titleCover"
              :alt="`Обложка произведения ${titleInfo?.title}`"
              class="h-full object-cover"
            />
          </AspectRatio>
        </div>

        <div class="ml-3 flex flex-col">
          <h1 class="mb-2 leading-tight">{{ titleInfo?.title }}</h1>

          <div class="mb-2 flex items-center gap-x-1">
            <User class="h-4 w-4" />
            <span class="text-2xs">{{ titleInfo?.authors.join(', ') }}</span>
          </div>

          <div v-if="hasTranslators" class="mb-2 flex items-center gap-x-1">
            <BookCheck class="h-4 w-4" />
            <span class="text-2xs">{{ titleInfo?.translators?.join(', ') }}</span>
          </div>

          <div class="flex items-center gap-x-1">
            <Clock class="h-4 w-4" />
            <span class="text-2xs">{{ titleInfo?.status }}</span>
          </div>
        </div>
      </div>

      <!-- TODO: Сворачивание описания и тегов -->
      <div class="mb-3 text-xs">
        {{ titleInfo?.description }}
      </div>

      <div class="mb-3 flex flex-wrap gap-1.5">
        <Badge v-for="tag in titleInfo?.tags" :key="tag" size="small">{{ tag }}</Badge>
      </div>

      <template v-for="(chapter, index) in chapters" :key="chapter.id">
        <Separator v-if="chapter.id === lastChapterRead" label="Прочитано" />
        <Separator v-else-if="index !== 0" />

        <ChapterItem :chapter="chapter" @open="read" />
      </template>

      <AtomSpinner v-if="loadingChapters" v-bind="SPINNER.ATOM_SPINNER_CONFIG" />
      <div ref="endOfChapters"></div>

      <ShadcnButton class="sticky bottom-3 ml-auto flex" size="sm" @click="readLast">
        <Play :size="16" class="mr-2" /> Читать
      </ShadcnButton>
    </div>
  </div>
</template>
