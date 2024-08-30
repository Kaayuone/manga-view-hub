<script setup lang="ts">
import AppNavbar from './components/AppNavbar.vue';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import type { NavigationTab } from '@/types';

const TABS: NavigationTab[] = [
  {
    text: 'Главная',
    routeName: 'home',
  },
  {
    text: 'Библиотека',
    routeName: 'library',
  },
];

const contentHeight = ref('100vh');
const activeRoute = ref('home');

const navbar = ref<InstanceType<typeof AppNavbar> | null>(null);

const route = useRoute();
const router = useRouter();

watch(activeRoute, value => {
  router.push({ name: value });
});

onBeforeMount(() => {
  activeRoute.value = route.name?.toString() || 'home';
});

onMounted(() => {
  contentHeight.value = `calc(100vh - ${navbar.value?.$el.clientHeight}px)`;
});
</script>

<template>
  <div :style="`height: ${contentHeight}`" class="overflow-y-auto px-2 md:px-4">
    <RouterView />
  </div>

  <AppNavbar ref="navbar" v-model="activeRoute" :tab-list="TABS" class="relative" />
</template>
