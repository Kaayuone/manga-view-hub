import request from '../config';

import type { AxiosPromise } from 'axios';
import type { PaginationResponse } from '@project-common/types/common';
import type { TitleChapter, TitleInfo } from '@project-common/types/title';
import type { SourceName } from '@project-common/types/source';
import type { ChapterInfoResponse } from '../types/response.types';
import type {
  DataAddToLibrary,
  ParamsChapterList,
  ParamsGetTitle,
  TitleLibrary,
  TitleLibraryId,
} from '../types/request.types';

export function getTitleByIdInSource(
  id: number,
  sourceName: SourceName,
  params?: ParamsGetTitle,
): AxiosPromise<TitleInfo> {
  return request({
    url: `/title/info/${sourceName}/${id}`,
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

export function getUserLibrary(userId: number) {
  return request<TitleLibrary[]>({
    url: `/title/library/${userId}`,
    method: 'GET',
  });
}

export function getUserLibraryIds(userId: number) {
  return request<TitleLibraryId[]>({
    url: `/title/library/${userId}/ids`,
    method: 'GET',
  });
}

export function addToLibrary(data: DataAddToLibrary) {
  return request<number>({
    url: `/title/add-to-library`,
    method: 'POST',
    data,
  });
}

export function removeFromLibrary(id: number) {
  return request({
    url: `/title/remove-from-library/${id}`,
    method: 'DELETE',
  });
}
