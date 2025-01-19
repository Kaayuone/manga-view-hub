import { Injectable, NotFoundException } from '@nestjs/common';

import type { RemangaResponse } from '@/types/remanga';
import type { SourceName, TitleListItem } from '@project-common/types/source';

import { SOURCES } from '@/constants';
@Injectable()
export class SearchService {
  findAllSources(name?: string) {
    return SOURCES.SOURCE_LIST.filter(source => source.text.includes(name ?? ''));
  }

  mapSourceTitleListResponse(sourceResponseData: unknown, sourceName: SourceName) {
    let responseData: TitleListItem[] = [];
    switch (sourceName) {
      case 'remanga':
        const sourceResponseDataRemanga = sourceResponseData as RemangaResponse;
        responseData = sourceResponseDataRemanga.content.map(remangaTitle => ({
          id: remangaTitle.id,
          urlName: remangaTitle.dir,
          cover: remangaTitle.cover.high,
          title: remangaTitle.rus_name,
          sourceMediaLink: SOURCES.MediaLinks.REMANGA,
        }));
        break;

      default:
        throw new NotFoundException(`The source with name ${name} is not existing!`);
    }

    return responseData;
  }
}
