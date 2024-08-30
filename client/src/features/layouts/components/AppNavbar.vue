<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

import { computed, ref } from 'vue';

import type { NavigationTab } from '@/types';

const props = defineProps<{
  tabList: NavigationTab[];
}>();

const activeTab = defineModel({ default: '' });
</script>

<template>
  <Tabs v-model="activeTab" default-value="account" class="w-full">
    <TabsList class="w-full">
      <TabsTrigger
        v-for="tab in props.tabList"
        :key="tab.routeName"
        :value="tab.routeName"
        class="w-full"
      >
        {{ tab.text }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
