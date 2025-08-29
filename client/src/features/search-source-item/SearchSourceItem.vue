<script setup lang="ts">
import { Globe } from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';

import type { Source } from '@project-common/types/source';

const props = defineProps<{
  item?: Source;
}>();

const emit = defineEmits<{
  open: [name: string];
}>();

function open() {
  emit('open', props.item!.name);
}
</script>

<template>
  <div
    v-if="props.item"
    class="flex cursor-pointer items-center gap-2 rounded-lg p-1 transition-all active:bg-primary-foreground"
    @click="open"
  >
    <Avatar>
      <AvatarImage
        :src="`src/assets/images/${props.item.iconPath}`"
        class="bg-white"
        alt="Иконка источника"
      />
      <AvatarFallback><Globe /></AvatarFallback>
    </Avatar>

    <div class="mr-auto">
      <h2 class="text-base">{{ props.item.text }}</h2>
      <p class="text-2xs">{{ props.item.description }}</p>
    </div>
  </div>
</template>
