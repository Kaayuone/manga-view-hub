import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import type { RemangaResponse } from '@/types/remanga';
import type { Source, SourceName, Story } from '@project-common/types/source';
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
  ): Promise<Story[] | NotFoundException> {
    const sourceResponseData = await lastValueFrom(
      this.httpService
        .get(`${SOURCES.SEARCH_LINKS_SOURCE_API_MAP.get(name)}${search}`)
        .pipe(map(response => response.data)),
    );

    let responseData: Story[] = [];
    switch (name) {
      case 'remanga':
        const sourceResponseDataRemanga = sourceResponseData as RemangaResponse;
        responseData = sourceResponseDataRemanga.content.map(remangaStory => ({
          cover: remangaStory.cover.high,
          title: remangaStory.rus_name,
          sourceMediaLink: SOURCES.MediaLinks.REMANGA,
        }));
        break;

      default:
        return new NotFoundException(
          `The source with name ${name} is not existing!`,
        );
    }

    return responseData;
  }

  @Post()
  create(@Body() createSearchDto: CreateSearchDto) {
    return this.searchService.create(createSearchDto);
  }

  @Get()
  findAll() {
    return this.searchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.searchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSearchDto: UpdateSearchDto) {
    return this.searchService.update(+id, updateSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.searchService.remove(+id);
  }
}
