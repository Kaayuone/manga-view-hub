import type { Pagination } from '@project-common/types/common';
import type { SourceName } from '@project-common/types/source';

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

export type UserCredentials = {
  username: string;
  password: string;
};

export type DataAddToLibrary = {
  idInSource: number;
  sourceName: SourceName;
  urlInSource: string;
  userId: number;
  title: string;
  cover: string;
};

export type TitleLibrary = DataAddToLibrary & {
  id: number;
  sourceMediaLink: string;
};

export type TitleLibraryId = {
  id: number;
  idInSource: number;
  sourceName: SourceName;
};
