<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { ShadcnButton } from '@/ui/button';
import { Globe, Search } from 'lucide-vue-next';
import type { SearchSource } from './types';

const props = defineProps<{
  item?: SearchSource;
}>();

const emit = defineEmits<{
  open: [name: string];
}>();

function open() {
  emit('open', props.item!.name);
}
</script>

<template>
  <div v-if="props.item" class="flex items-center gap-2">
    <Avatar style="background-color: white">
      <AvatarImage :src="props.item.iconPath" alt="Иконка источника" />
      <AvatarFallback><Globe /></AvatarFallback>
    </Avatar>

    <div class="mr-auto">
      <h2 class="text-base">{{ props.item.text }}</h2>
      <p class="text-2xs">{{ props.item.description }}</p>
    </div>

    <ShadcnButton size="icon" variant="ghost" @click="open">
      <Search />
    </ShadcnButton>
  </div>
</template>
