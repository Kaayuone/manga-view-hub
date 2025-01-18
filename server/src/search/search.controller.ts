import { Controller, Get, Param, Query, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SearchService } from './search.service';

import { lastValueFrom, map } from 'rxjs';

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
  ): Promise<TitleListItem[]> {
    try {
      const sourceResponseData = await lastValueFrom(
        this.httpService
          .get(`${SOURCES.SEARCH_LINKS_SOURCE_API_MAP.get(name)}${search}`)
          .pipe(map(response => response.data)),
      );

      return this.searchService.mapSourceTitleListResponse(sourceResponseData, name);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
