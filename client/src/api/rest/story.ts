import type { AxiosPromise } from 'axios';
import type { SourceName } from '@project-common/types/source';
import type { ChapterInfoResponse } from '../types/reponse.types';
import request from '../config';

export function getChapterInfo(
  sourceName: SourceName,
  id: number,
): AxiosPromise<ChapterInfoResponse> {
  return request({
    url: `/search/${sourceName}/chapter/${id}`,
    method: 'GET',
  });
}

export function getFrameThroughProxy(sourceName: SourceName, imageUrl: string) {
  return request({
    url: `/search/${sourceName}/chapter/image/${encodeURIComponent(imageUrl)}`,
    method: 'GET',
    responseType: 'blob',
  });
}
