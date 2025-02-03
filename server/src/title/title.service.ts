import { Injectable, NotFoundException } from '@nestjs/common';
import { Title } from './entities/title.entity';
import { Chapter } from './entities/chapter.entity';

import { wrapInPagination } from '@/utils/pagination';

import type {
  RemangaChapter,
  RemangaChapterInfoResponse,
  RemangaChapterSimple,
  RemangaTitleInfoResponse,
} from '@/types/remanga';
import type { ChapterResponse } from '@/types/common';
import type { SourceName } from '@project-common/types/source';
import type { ChapterPublisher } from '@project-common/types/title';

import { SOURCES } from '@/constants';

@Injectable()
export class TitleService {
  mapTitleInfo(sourceResponseData: unknown, sourceName: SourceName) {
    let responseData: Title;
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
  }

  mapSourceChapters(
    chaptersListResponse: unknown,
    sourceName: SourceName,
    page: number,
    size: number,
  ) {
    let items: Chapter[];
    let isLast: boolean = false;
    switch (sourceName) {
      case 'remanga':
        const chaptersList = chaptersListResponse as {
          content: RemangaChapter[];
        };
        items = chaptersList.content.map<Chapter>(
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
        isLast = chaptersList.content.at(-1).index === 1;
        break;

      default:
        throw new NotFoundException(`The source with name ${sourceName} is not existing!`);
    }

    return wrapInPagination(items, page, size, undefined, isLast);
  }

  mapSourceSimpleChapters(chaptersListResponse: unknown, sourceName: SourceName) {
    let items: Chapter[];
    switch (sourceName) {
      case 'remanga':
        const chaptersList = chaptersListResponse as {
          content: RemangaChapterSimple[];
        };
        items = chaptersList.content.map<Chapter>(
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
        break;

      default:
        throw new NotFoundException(`The source with name ${sourceName} is not existing!`);
    }

    return items;
  }

  mapChapterFrames(chapterFramesResponse: unknown, sourceName: SourceName) {
    let response: ChapterResponse;
    switch (sourceName) {
      case 'remanga':
        const chapterInfo = chapterFramesResponse as RemangaChapterInfoResponse;
        response = {
          tome: chapterInfo.content.tome,
          chapter: chapterInfo.content.chapter,
          pages: chapterInfo.content.pages.flat().map(({ id, link, height, width }) => ({
            id,
            url: link,
            height,
            width,
          })),
        };
        break;

      default:
        throw new NotFoundException(`The source with name ${sourceName} is not existing!`);
    }

    return response;
  }
}
