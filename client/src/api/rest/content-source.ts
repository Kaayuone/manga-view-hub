import type { AxiosPromise } from 'axios';
import request from '../config';

import type { Source, StoryChapter, StoryInfo, StoryListItem } from '@project-common/types/source';
import type {
  ParamName,
  ParamsChapterList,
  ParamSearch,
  ParamsGetTitle,
} from '../types/request.types';
import type { PaginationResponse } from '@project-common/types/common';

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
): AxiosPromise<StoryListItem[]> {
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
): AxiosPromise<StoryInfo> {
  return request({
    url: `/search/title/${sourceName}/${id}`,
    method: 'GET',
    params,
  });
}

export function getStoryChaptersInContentSource(
  sourceName: string,
  params: ParamsChapterList,
): AxiosPromise<PaginationResponse<StoryChapter>> {
  return request({
    url: `/search/${sourceName}/chapters`,
    method: 'GET',
    params,
  });
}

export function getAllStoryChapters(
  sourceName: string,
  chapterListId: number,
): AxiosPromise<StoryChapter[]> {
  return request({
    url: `/search/${sourceName}/${chapterListId}/chapters`,
    method: 'GET',
  });
}
