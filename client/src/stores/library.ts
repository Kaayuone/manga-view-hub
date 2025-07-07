import { defineStore } from 'pinia';
import { ref } from 'vue';
import { titleApi } from '@/api';
import type { TitleLibraryId } from '@/api/types/request.types';
import type { SourceName } from '@project-common/types/source';

export const useLibraryStore = defineStore('library', () => {
  const libraryItems = ref<TitleLibraryId[]>([]);

  async function getLibraryItems(userId: number) {
    try {
      const { data } = await titleApi.getUserLibraryIds(userId);
      libraryItems.value = data;
    } catch (error) {
      console.error(error);
    }
  }

  function checkIsItemInLibrary(sourceName: SourceName, idInSource: number) {
    return libraryItems.value.find(
      item => item.sourceName === sourceName && item.idInSource === idInSource,
    )?.id;
  }

  return {
    getLibraryItems,
    checkIsItemInLibrary,
  };
});
