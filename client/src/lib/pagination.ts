import { ref } from 'vue';

import type { PaginationInfo } from '@project-common/types/common';

const PAGE_DEFAULT = 1;
const SIZE_DEFAULT = 50;

export function usePagination(_page: number = PAGE_DEFAULT, _size: number = SIZE_DEFAULT) {
  const page = ref(_page);
  const size = ref(_size);
  const totalItems = ref(0);
  const paginationInfo = ref<PaginationInfo>({
    isFirst: true,
    isLast: false,
  });

  function next() {
    page.value++;
  }

  function setPagination(_page: number, _size: number) {
    page.value = _page;
    size.value = _size;
  }

  function reset() {
    page.value = PAGE_DEFAULT;
    size.value = SIZE_DEFAULT;
  }

  function setTotalItems(_totalItems: number) {
    totalItems.value = _totalItems;
  }

  function setPaginationInfo(_paginationInfo: PaginationInfo) {
    paginationInfo.value = { ..._paginationInfo };
  }

  return {
    pagination: {
      page,
      size,
    },
    totalItems,
    paginationInfo,
    next,
    reset,
    setPagination,
    setTotalItems,
    setPaginationInfo,
  };
}
