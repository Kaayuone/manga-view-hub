<script setup lang="ts">
import { ArrowDownToLine } from 'lucide-vue-next';
import { ShadcnButton } from '@/ui/button';
</script>

<!-- TODO: состояние "прочитанное" -->
<template>
  <div class="flex items-center justify-between">
    <div class="text-xs">
      <h2 class="mb-1 font-semibold">Глава 1</h2>
      <div class="text-2xs font-light">24.09.2024 | Автор главы/Переводчик</div>
    </div>

    <div>
      <ShadcnButton variant="ghost" size="icon-small">
        <ArrowDownToLine :size="16" />
      </ShadcnButton>
    </div>
  </div>
</template>
