<script setup lang="ts">
import ChapterItem from '@/features/chapter-item';
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

import { contentSourceApi } from '@/api';

import { computed, onMounted, ref } from 'vue';
import type { SourceName, StoryChapter, StoryInfo } from '@project-common/types/source';
import { CONTENT_SOURCE, SPINNER } from '@/constants';

const props = defineProps<{
  id: number;
  sourceName: SourceName;
  url: string;
}>();

const loadingChapters = ref(false);
const storyInfo = ref<StoryInfo>();
const chapters = ref<StoryChapter[]>([]);

const endOfChapters = ref<HTMLDivElement>();

const storyImage = computed(() =>
  storyInfo.value ? `${storyInfo.value.sourceMediaLink}${storyInfo.value.cover}` : '',
);
const hasTranslators = computed(
  () => storyInfo?.value?.translators && storyInfo?.value?.translators.length > 0,
);

const router = useRouter();
const { pagination, paginationInfo, next, setPagination, setPaginationInfo } = usePagination();

onMounted(async () => {
  await getTitle();
  getChapterList();
  useIntersectionObserver(endOfChapters, onIntersectionObserver);
});

async function getTitle() {
  try {
    const { data } = await contentSourceApi.getStoryByIdInContentSource(
      props.id,
      props.sourceName,
      {
        titleUrl: props.url,
        useUrlInsteadId: CONTENT_SOURCE.SourcesTitleUseUrl.includes(props.sourceName),
      },
    );
    storyInfo.value = data;
  } catch (error) {
    console.error(error);
  }
}

async function getChapterList() {
  if (!storyInfo.value) return;

  loadingChapters.value = true;
  try {
    const { data } = await contentSourceApi.getStoryChaptersInContentSource(props.sourceName, {
      page: pagination.page.value,
      size: pagination.size.value,
      chapterListId: storyInfo.value?.chapterListId,
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

function read(chapter: StoryChapter) {
  router.push({
    name: 'read-manga',
    params: {
      id: chapter.id,
      sourceName: props.sourceName,
      url: props.url,
      storyId: props.id,
    },
  });
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
              :src="storyImage"
              :alt="`Обложка произведения ${storyInfo?.title}`"
              class="h-full object-cover"
            />
          </AspectRatio>
        </div>

        <div class="ml-3 flex flex-col">
          <h1 class="mb-2 leading-tight">{{ storyInfo?.title }}</h1>

          <div class="mb-2 flex items-center gap-x-1">
            <User class="h-4 w-4" />
            <span class="text-2xs">{{ storyInfo?.authors.join(', ') }}</span>
          </div>

          <div v-if="hasTranslators" class="mb-2 flex items-center gap-x-1">
            <BookCheck class="h-4 w-4" />
            <span class="text-2xs">{{ storyInfo?.translators?.join(', ') }}</span>
          </div>

          <div class="flex items-center gap-x-1">
            <Clock class="h-4 w-4" />
            <span class="text-2xs">{{ storyInfo?.status }}</span>
          </div>
        </div>
      </div>

      <!-- TODO: Сворачивание описания и тегов -->
      <div class="mb-3 text-xs">
        {{ storyInfo?.description }}
      </div>

      <div class="mb-3 flex flex-wrap gap-1.5">
        <Badge v-for="tag in storyInfo?.tags" :key="tag" size="small">{{ tag }}</Badge>
      </div>

      <template v-for="(chapter, index) in chapters" :key="chapter.id">
        <ChapterItem :chapter="chapter" @open="read" />

        <Separator v-if="index === 7" label="Прочитано" />
        <Separator v-else-if="index !== chapters.length - 1" />
      </template>

      <AtomSpinner v-if="loadingChapters" v-bind="SPINNER.ATOM_SPINNER_CONFIG" />
      <div ref="endOfChapters"></div>

      <ShadcnButton class="sticky bottom-3 ml-auto flex" size="sm" @click="read">
        <Play :size="16" class="mr-2" /> Читать
      </ShadcnButton>
    </div>
  </div>
</template>
