import type { AxiosPromise } from 'axios';
import request from '../config';

import type { Source, TitleListItem } from '@project-common/types/source';
import type {
  ParamName,
  ParamsChapterList,
  ParamSearch,
  ParamsGetTitle,
} from '../types/request.types';
import type { PaginationResponse } from '@project-common/types/common';
import type { TitleChapter, TitleInfo } from '@project-common/types/title';

export function getSourceList(params: ParamName): AxiosPromise<Source[]> {
  return request({
    url: `/search/sources`,
    method: 'GET',
    params,
  });
}

// TODO: change params type
export function getContentSourceStories(
  name: string,
  params: ParamSearch,
): AxiosPromise<TitleListItem[]> {
  return request({
    url: `/search/source/${name}`,
    method: 'GET',
    params,
  });
}

export function getStoryByIdInContentSource(
  id: number,
  sourceName: string,
  params?: ParamsGetTitle,
): AxiosPromise<TitleInfo> {
  return request({
    url: `/search/title/${sourceName}/${id}`,
    method: 'GET',
    params,
  });
}

export function getStoryChaptersInContentSource(
  sourceName: string,
  params: ParamsChapterList,
): AxiosPromise<PaginationResponse<TitleChapter>> {
  return request({
    url: `/search/${sourceName}/chapters`,
    method: 'GET',
    params,
  });
}

export function getAllStoryChapters(
  sourceName: string,
  chapterListId: number,
): AxiosPromise<TitleChapter[]> {
  return request({
    url: `/search/${sourceName}/${chapterListId}/chapters`,
    method: 'GET',
  });
}
