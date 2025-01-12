import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SearchService } from './search.service';

import { lastValueFrom, map } from 'rxjs';

import type { RemangaResponse } from '@/types/remanga';
import type { Source, SourceName, TitleListItem } from '@project-common/types/source';

import { SOURCES } from '@/constants';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly httpService: HttpService,
  ) {}

  // TODO: get all sources from db + cache them
  @Get('/sources')
  async getSourceList(@Query('name') name?: string): Promise<Source[]> {
    return this.searchService.findAllSources(name);
  }

  @Get('/source/:name')
  async searchInSource(
    @Param('name') name: SourceName,
    @Query('search') search: string,
  ): Promise<TitleListItem[] | NotFoundException | InternalServerErrorException> {
    try {
      const sourceResponseData = await lastValueFrom(
        this.httpService
          .get(`${SOURCES.SEARCH_LINKS_SOURCE_API_MAP.get(name)}${search}`)
          .pipe(map(response => response.data)),
      );

      // TODO: maybe in search service
      let responseData: TitleListItem[] = [];
      switch (name) {
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
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
