import type { AxiosPromise } from 'axios';
import request from '../config';

import type { TitleListItem } from '@/features/title-card/types';
import type { ParamSearch } from '../types/request.types';

// TODO: change params type
export function getContentSourceManga(
  name: string,
  params: ParamSearch,
): AxiosPromise<TitleListItem[]> {
  return request({
    url: `/search/source/${name}`,
    params,
  });
}
