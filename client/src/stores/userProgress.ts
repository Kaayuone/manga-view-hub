import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { SourceName } from '@project-common/types/source';

type UserProgress = {
  [key in SourceName]?: {
    [key: string]: number;
  };
};

export const useUserProgressStore = defineStore('userProgress', () => {
  const userProgress = useLocalStorage<UserProgress>('progress', {});

  function setProgress(source: SourceName, titleUrl: string, chapterId: number) {
    if (!userProgress.value[source]) {
      userProgress.value[source] = { [titleUrl]: chapterId };
    } else {
      userProgress.value[source][titleUrl] = chapterId;
    }
  }

  return { userProgress, setProgress };
});
