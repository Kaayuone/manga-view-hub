<script setup lang="ts">
import { AspectRatio } from '@/ui/aspect-ratio';
import { Card, CardHeader, CardTitle } from '@/ui/card';

import type { TitleListItem } from '@project-common/types/source';

const props = defineProps<{
  item: TitleListItem;
}>();

const emit = defineEmits<{
  open: [item: TitleListItem];
}>();

function openTitlePage() {
  emit('open', props.item);
}
</script>

<template>
  <!-- TODO: добавить бэдж с количеством непрочитанных глав -->
  <div class="w-1/3 p-1 md:w-1/4 lg:w-1/5" @click="openTitlePage">
    <AspectRatio :ratio="2 / 3">
      <Card class="relative flex h-full cursor-pointer flex-col overflow-hidden">
        <img
          :src="`${props.item.sourceMediaLink}${props.item.cover}`"
          :alt="`Обложка произведения ${props.item.title}`"
          class="h-full object-cover"
        />
        <CardHeader
          class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary-foreground via-primary-foreground/80 via-40% p-1 pt-4"
        >
          <CardTitle class="text-2xs md:text-base">{{ props.item.title }}</CardTitle>
        </CardHeader>
      </Card>
    </AspectRatio>
  </div>
</template>
