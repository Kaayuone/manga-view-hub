import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Res,
  Body,
  Post,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { Title } from './entities/title.entity';
import { Chapter } from './entities/chapter.entity';
import { TitleService } from './title.service';

import { lastValueFrom, map } from 'rxjs';

import type { ChapterResponse } from '@/types/common';
import type { PaginationResponse } from '@project-common/types/common';
import type { SourceName } from '@project-common/types/source';

import { SOURCES } from '@/constants';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('title')
export class TitleController {
  constructor(
    private readonly titleService: TitleService,
    private readonly httpService: HttpService,
  ) {}

  @Get('info/:sourceName/:id')
  async getTitleByIdInSource(
    @Param('sourceName') sourceName: SourceName,
    @Param('id') id: string,
    @Query('titleUrl') titleUrl?: string,
    @Query('useUrlInsteadId') useUrlInsteadId?: boolean,
  ): Promise<Title> {
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

      return this.titleService.mapTitleInfo(sourceResponseData, sourceName);
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
  ): Promise<PaginationResponse<Chapter>> {
    const searchLink = SOURCES.SEARCH_CHAPTERS_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    try {
      const chaptersList = await lastValueFrom(
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

      return this.titleService.mapSourceChapters(chaptersList, sourceName, page, size);
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
  ): Promise<Chapter[]> {
    const searchLink = SOURCES.SEARCH_CHAPTERS_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    try {
      const chaptersList = await lastValueFrom(
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

      return this.titleService.mapSourceSimpleChapters(chaptersList, sourceName);
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
  ): Promise<ChapterResponse> {
    const searchLink = SOURCES.SEARCH_CHAPTERS_LINK.get(sourceName);
    if (!searchLink) {
      throw new NotFoundException('There is no such source in the app');
    }

    try {
      const chapterInfo = await lastValueFrom(
        this.httpService.get(`${searchLink}/${id}`).pipe(map(response => response.data)),
      );

      return this.titleService.mapChapterFrames(chapterInfo, sourceName);
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

  @UseGuards(JwtAuthGuard)
  @Get('library/:userId')
  async getTitlesForLibrary(@Param('userId') userId: number) {
    if (!userId && typeof userId === 'number') throw new BadRequestException('No user provided');
    const titles = await this.titleService.getUserLibrary(userId);
    return titles.map(title => ({ ...title, sourceMediaLink: SOURCES.MediaLinks.REMANGA }));
  }

  @UseGuards(JwtAuthGuard)
  @Get('library/:userId/ids')
  async getTitlesIdsForLibrary(@Param('userId') userId: number) {
    if (!userId && typeof userId === 'number') throw new BadRequestException('No user provided');
    const titles = await this.titleService.getUserLibrary(userId);
    return titles.map(({ id, idInSource, sourceName }) => ({ id, idInSource, sourceName }));
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-to-library')
  addTitleToLibrary(
    @Body('idInSource') idInSource: number,
    @Body('sourceName') sourceName: SourceName,
    @Body('urlInSource') urlInSource: string,
    @Body('cover') cover: string,
    @Body('title') title: string,
    @Body('userId') userId: number,
  ) {
    if (!idInSource || !sourceName || !urlInSource || !userId || !cover || !title) {
      throw new BadRequestException('Invalid data');
    }
    return this.titleService.addTitleToUsersLibrary(
      idInSource,
      sourceName,
      urlInSource,
      userId,
      title,
      cover,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-from-library/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTitleToLibrary(@Param('id') id: number) {
    if (!id) {
      throw new BadRequestException('Invalid data');
    }
    this.titleService.removeTitleFromUsersLibrary(id);
  }
}
