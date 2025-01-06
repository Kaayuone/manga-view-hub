import type { Pagination } from '@project-common/types/common';

export type ParamSearch = {
  search?: string;
};

export type ParamName = {
  name?: string;
};

export type ParamsGetTitle = {
  titleUrl?: string;
  useUrlInsteadId?: boolean;
};

export type PaginationRequest = Pick<Pagination, 'page' | 'size'>;

export type ParamsChapterList = PaginationRequest & {
  chapterListId: number;
};
