import type { AxiosPromise } from 'axios';
import request from '../config';

import type { TitleListItem } from '@/features/title-card/types';
import type { Source } from '@project-common/types/source';
import type { ParamName, ParamSearch } from '../types/request.types';

export function getSourceList(params: ParamName): AxiosPromise<Source[]> {
  return request({
    url: `/search/sources`,
    method: 'GET',
    params,
  });
}

// TODO: change params type
export function getContentSourceManga(
  name: string,
  params: ParamSearch,
): AxiosPromise<TitleListItem[]> {
  return request({
    url: `/search/source/${name}`,
    method: 'GET',
    params,
  });
}
