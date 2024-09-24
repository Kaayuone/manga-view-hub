<script setup lang="ts">
import { AspectRatio } from '@/ui/aspect-ratio';
import { Card, CardHeader, CardTitle } from '@/ui/card';
</script>

<template>
  <!-- TODO: добавить бэдж с количеством непрочитанных глав -->
  <div class="w-1/3 p-1 md:w-1/4 lg:w-1/5">
    <AspectRatio :ratio="2 / 3">
      <Card class="flex h-full flex-col">
        <CardHeader class="mt-auto p-1">
          <CardTitle class="text-sm md:text-base">Название манги</CardTitle>
        </CardHeader>
      </Card>
    </AspectRatio>
  </div>
</template>
