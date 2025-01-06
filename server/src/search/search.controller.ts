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
  BadRequestException,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import type {
  RemangaChapter,
  RemangaResponse,
  RemangaTitleInfoResponse,
} from '@/types/remanga';
import type {
  ChapterPublisher,
  Source,
  SourceName,
  StoryChapter,
  StoryInfo,
  StoryListItem,
} from '@project-common/types/source';
import { SOURCES } from '@/constants';
import { wrapInPagination } from '@/utils/pagination';
import { PaginationResponse } from '@project-common/types/common';

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
  ): Promise<StoryListItem[] | NotFoundException> {
    const sourceResponseData = await lastValueFrom(
      this.httpService
        .get(`${SOURCES.SEARCH_LINKS_SOURCE_API_MAP.get(name)}${search}`)
        .pipe(map(response => response.data)),
    );
    console.log('sourceResponseData :>> ', sourceResponseData);
    let responseData: StoryListItem[] = [];
    switch (name) {
      case 'remanga':
        const sourceResponseDataRemanga = sourceResponseData as RemangaResponse;
        responseData = sourceResponseDataRemanga.content.map(remangaStory => ({
          id: remangaStory.id,
          urlName: remangaStory.dir,
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

  @Get('title/:sourceName/:id')
  async getTitleByIdInSource(
    @Param('sourceName') sourceName: SourceName,
    @Param('id') id: string,
    @Query('titleUrl') titleUrl?: string,
    @Query('useUrlInsteadId') useUrlInsteadId?: boolean,
  ): Promise<StoryInfo | BadRequestException | NotFoundException> {
    if (useUrlInsteadId && !titleUrl) {
      throw new BadRequestException(
        'Using url instead of title, but there is no title provided',
      );
    }

    const searchLink = SOURCES.SEARCH_TITLE_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    const linkGetTitle = `${SOURCES.SEARCH_TITLE_LINK.get(sourceName)}${useUrlInsteadId ? titleUrl : id}`;
    const sourceResponseData = await lastValueFrom(
      this.httpService.get(linkGetTitle).pipe(map(response => response.data)),
    );
    let responseData: StoryInfo;
    switch (sourceName) {
      case 'remanga':
        const sourceResponseDataRemanga =
          sourceResponseData as RemangaTitleInfoResponse;
        const remangaTitle = sourceResponseDataRemanga.content;
        responseData = {
          id: remangaTitle.id,
          urlName: remangaTitle.dir,
          cover: remangaTitle.img.high,
          title: remangaTitle.rus_name,
          sourceMediaLink: SOURCES.MediaLinks.REMANGA,
          authors: Object.keys(remangaTitle.creators).flatMap(key =>
            remangaTitle.creators[key].map(creator => creator.name),
          ),
          description: remangaTitle.description.replace(/(<([^>]+)>)/gi, ''), // remove tags from string
          status: remangaTitle.status.name,
          tags: [
            ...remangaTitle.genres.map(genre => genre.name),
            ...remangaTitle.categories.map(category => category.name),
          ],
          translators: remangaTitle.publishers.map(publisher => publisher.name),
          chapterListId: remangaTitle.branches.at(0).id,
        };
        break;

      default:
        return new NotFoundException(
          `The source with name ${name} is not existing!`,
        );
    }
    return responseData;
  }

  @Get(':sourceName/chapters')
  async getStoryChapters(
    @Param('sourceName') sourceName: SourceName,
    @Query('chapterListId') chapterListId: number,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<PaginationResponse<StoryChapter>> {
    const searchLink = SOURCES.SEARCH_CHAPTERS_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    const chaptersList: {
      content: RemangaChapter[];
    } = await lastValueFrom(
      this.httpService
        .get(searchLink, {
          params: {
            branch_id: chapterListId,
            page,
            count: size,
          },
        })
        .pipe(map(response => response.data)),
    );
    console.log('chaptersList :>> ', chaptersList);
    const items = chaptersList.content.map<StoryChapter>(item => ({
      id: item.id,
      number: parseFloat(item.chapter),
      publishDate: item.pub_date,
      publishers: item.publishers.map<ChapterPublisher>(publisher => ({
        id: publisher.id,
        name: publisher.name,
      })),
      tome: item.tome,
    }));
    console.log(
      'chaptersList.content.at(-1) :>> ',
      chaptersList.content.at(-1),
    );

    return wrapInPagination(
      items,
      page,
      size,
      undefined,
      chaptersList.content.at(-1).index === 1,
    );
  }
  // https://api.remanga.org/api/titles/chapters/?branch_id=42597&ordering=-index&user_data=1&count=40&page=3

  // https://api.remanga.org/api/titles/chapters/881187/
  // get chapter by id

  // https://api.remanga.org/api/titles/chapters/?branch_id=42597&&user_data=0
  // get all chapters

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
