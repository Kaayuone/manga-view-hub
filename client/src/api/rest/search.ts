import request from '../config';

import type { AxiosPromise } from 'axios';
import type { Source, SourceName, TitleListItem } from '@project-common/types/source';
import type { ParamName, ParamSearch } from '../types/request.types';

export function getSourceList(params: ParamName): AxiosPromise<Source[]> {
  return request({
    url: `/search/sources`,
    method: 'GET',
    params,
  });
}

export function getTitlesInSourceBySearch(
  name: SourceName,
  params: ParamSearch,
): AxiosPromise<TitleListItem[]> {
  return request({
    url: `/search/source/${name}`,
    method: 'GET',
    params,
  });
}
