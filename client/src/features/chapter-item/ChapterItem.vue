<script setup lang="ts">
import { ArrowDownToLine, DollarSign } from 'lucide-vue-next';
import { ShadcnButton } from '@/ui/button';
import type { StoryChapter } from '@project-common/types/source';

const props = defineProps<{
  chapter: StoryChapter;
}>();

const emit = defineEmits<{
  open: [chapter: StoryChapter];
}>();

function openChapter() {
  if (props.chapter.isPaid) return;

  emit('open', props.chapter);
}
</script>

<!-- TODO: состояние "прочитанное" -->
<template>
  <div
    :class="{ 'active:bg-foreground/10': !chapter.isPaid }"
    class="-mx-3 flex items-center justify-between p-1.5 px-3"
    @click="openChapter"
  >
    <div :class="{ 'opacity-60': chapter.isPaid }" class="text-xs">
      <h2 class="mb-1 font-semibold">
        {{ chapter.tome }} Глава {{ chapter.number }}
        <DollarSign v-if="chapter.isPaid" :size="12" class="inline-block text-yellow-400" />
      </h2>
      <div class="text-2xs font-light">
        {{ chapter.publishDate ? new Date(chapter.publishDate).toLocaleDateString('ru') : '' }} |
        {{ chapter.publishers.map(publisher => publisher.name).join(', ') }}
      </div>
    </div>

    <div>
      <ShadcnButton variant="ghost" size="icon-small">
        <ArrowDownToLine :size="16" />
      </ShadcnButton>
    </div>
  </div>
</template>
