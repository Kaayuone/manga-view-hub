import type { PaginationResponse } from '@project-common/types/common';

export function wrapInPagination<T>(
  items: T[],
  page: number = 1,
  size: number = 50,
  totalItems?: number,
  isLast?: boolean,
): PaginationResponse<T> {
  const _isLast = totalItems
    ? Math.ceil(totalItems / size) === page
    : (isLast ?? false);
  return {
    content: items,
    page,
    size,
    totalItems: totalItems ?? 0,
    isFirst: page === 1,
    isLast: _isLast,
  };
}
