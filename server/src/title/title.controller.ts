import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { Title } from './entities/title.entity';
import { Chapter } from './entities/chapter.entity';
import { TitleService } from './title.service';

import { lastValueFrom, map } from 'rxjs';
import { wrapInPagination } from '@/utils/pagination';

import type {
  RemangaChapter,
  RemangaChapterInfoResponse,
  RemangaChapterSimple,
  RemangaTitleInfoResponse,
} from '@/types/remanga';
import type { ChapterResponse } from '@/types/common';
import type { PaginationResponse } from '@project-common/types/common';
import type { SourceName } from '@project-common/types/source';
import type { ChapterPublisher } from '@project-common/types/title';

import { SOURCES } from '@/constants';

@Controller('title')
export class TitleController {
  constructor(
    private readonly titleService: TitleService,
    private readonly httpService: HttpService,
  ) {}

  @Get(':sourceName/:id')
  async getTitleByIdInSource(
    @Param('sourceName') sourceName: SourceName,
    @Param('id') id: string,
    @Query('titleUrl') titleUrl?: string,
    @Query('useUrlInsteadId') useUrlInsteadId?: boolean,
  ): Promise<Title | BadRequestException | NotFoundException | InternalServerErrorException> {
    if (useUrlInsteadId && !titleUrl) {
      throw new BadRequestException('Using url instead of title, but there is no title provided');
    }

    const searchLink = SOURCES.SEARCH_TITLE_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    try {
      const linkGetTitle = `${SOURCES.SEARCH_TITLE_LINK.get(sourceName)}${useUrlInsteadId ? titleUrl : id}`;
      const sourceResponseData = await lastValueFrom(
        this.httpService.get(linkGetTitle).pipe(map(response => response.data)),
      );
      let responseData: Title;
      // TODO: maybe in service
      switch (sourceName) {
        case 'remanga':
          const sourceResponseDataRemanga = sourceResponseData as RemangaTitleInfoResponse;
          const remangaTitle = sourceResponseDataRemanga.content;
          responseData = new Title({
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
          });
          break;

        default:
          throw new NotFoundException(`The source with name ${sourceName} is not existing!`);
      }
      return responseData;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // https://api.remanga.org/api/titles/chapters/?branch_id=42597&ordering=-index&user_data=1&count=40&page=3
  @Get(':sourceName/chapters')
  async getTitleChapters(
    @Param('sourceName') sourceName: SourceName,
    @Query('chapterListId') chapterListId: number,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<PaginationResponse<Chapter> | NotFoundException | InternalServerErrorException> {
    const searchLink = SOURCES.SEARCH_CHAPTERS_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    try {
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

      // TODO: maybe in service, when more sources
      const items = chaptersList.content.map<Chapter>(
        item =>
          new Chapter({
            id: item.id,
            number: parseFloat(item.chapter),
            publishDate: item.pub_date,
            publishers: item.publishers.map<ChapterPublisher>(publisher => ({
              id: publisher.id,
              name: publisher.name,
            })),
            tome: item.tome,
            isPaid: item.is_paid ?? false,
          }),
      );

      return wrapInPagination(
        items,
        page,
        size,
        undefined,
        chaptersList.content.at(-1).index === 1,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // https://api.remanga.org/api/titles/chapters/?branch_id=42597&&user_data=0
  // get all chapters
  @Get(':sourceName/chapters/:chapterListId')
  async getAllTitleChapters(
    @Param('sourceName') sourceName: SourceName,
    @Param('chapterListId') chapterListId: string,
  ): Promise<Chapter[] | NotFoundException | InternalServerErrorException> {
    const searchLink = SOURCES.SEARCH_CHAPTERS_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    try {
      const chaptersList: {
        content: RemangaChapterSimple[];
      } = await lastValueFrom(
        this.httpService
          .get(searchLink, {
            params: {
              branch_id: chapterListId,
              user_data: 0,
              ordering: 'index',
            },
          })
          .pipe(map(response => response.data)),
      );
      // TODO: maybe in service, when more sources
      const items = chaptersList.content.map<Chapter>(
        item =>
          new Chapter({
            id: item.id,
            number: parseFloat(item.chapter),
            publishDate: '',
            publishers: [],
            tome: item.tome,
            isPaid: item.is_paid ?? false,
          }),
      );

      return items;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // https://api.remanga.org/api/titles/chapters/881187/
  // get chapter by id
  @Get(':sourceName/chapter/:id')
  async getChapterFrames(
    @Param('sourceName') sourceName: SourceName,
    @Param('id') id: string,
  ): Promise<ChapterResponse | NotFoundException> {
    const searchLink = SOURCES.SEARCH_CHAPTERS_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    try {
      const chapterInfo: RemangaChapterInfoResponse = await lastValueFrom(
        this.httpService.get(`${searchLink}/${id}`).pipe(map(response => response.data)),
      );
      // TODO: maybe map in service
      return {
        tome: chapterInfo.content.tome,
        chapter: chapterInfo.content.chapter,
        pages: chapterInfo.content.pages.map(([{ id, link, height, width }]) => ({
          id,
          url: link,
          height,
          width,
        })),
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':sourceName/chapter/image/:imageUrl')
  async getImageThroughProxy(
    @Param('sourceName') sourceName: SourceName,
    @Param('imageUrl') imageUrl: string,
    @Res() res: Response,
  ) {
    try {
      const decodedUrl = decodeURIComponent(imageUrl);
      const chapterFrame = await lastValueFrom(
        this.httpService
          .get(decodedUrl, {
            headers: {
              Referer: 'https://remanga.org/',
            },
            responseType: 'arraybuffer',
          })
          .pipe(map(response => response.data)),
      );
      res.send(chapterFrame);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
