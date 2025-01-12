import request from '../config';

import type { AxiosPromise } from 'axios';
import type { PaginationResponse } from '@project-common/types/common';
import type { TitleChapter, TitleInfo } from '@project-common/types/title';
import type { SourceName } from '@project-common/types/source';
import type { ChapterInfoResponse } from '../types/response.types';
import type { ParamsChapterList, ParamsGetTitle } from '../types/request.types';

export function getTitleByIdInSource(
  id: number,
  sourceName: SourceName,
  params?: ParamsGetTitle,
): AxiosPromise<TitleInfo> {
  return request({
    url: `/title/${sourceName}/${id}`,
    method: 'GET',
    params,
  });
}

export function getTitleChaptersInSource(
  sourceName: SourceName,
  params: ParamsChapterList,
): AxiosPromise<PaginationResponse<TitleChapter>> {
  return request({
    url: `/title/${sourceName}/chapters`,
    method: 'GET',
    params,
  });
}

export function getAllTitleChapters(
  sourceName: SourceName,
  chapterListId: number,
): AxiosPromise<TitleChapter[]> {
  return request({
    url: `/title/${sourceName}/chapters/${chapterListId}`,
    method: 'GET',
  });
}

export function getChapterInfo(
  sourceName: SourceName,
  id: number,
): AxiosPromise<ChapterInfoResponse> {
  return request({
    url: `/title/${sourceName}/chapter/${id}`,
    method: 'GET',
  });
}

export function getFrameThroughProxy(sourceName: SourceName, imageUrl: string) {
  return request({
    url: `/title/${sourceName}/chapter/image/${encodeURIComponent(imageUrl)}`,
    method: 'GET',
    responseType: 'blob',
  });
}
