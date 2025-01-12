import { TitleInfo } from '@project-common/types/title';

export class Title {
  authors: string[];
  chapterListId: number;
  cover: string;
  description: string;
  id: number;
  sourceMediaLink: string;
  status: string;
  tags: string[];
  title: string;
  urlName: string;
  translators?: string[];

  constructor({
    authors,
    chapterListId,
    cover,
    description,
    id,
    sourceMediaLink,
    status,
    tags,
    title,
    urlName,
    translators,
  }: TitleInfo) {
    this.authors = authors;
    this.chapterListId = chapterListId;
    this.cover = cover;
    this.description = description;
    this.id = id;
    this.sourceMediaLink = sourceMediaLink;
    this.status = status;
    this.tags = tags;
    this.title = title;
    this.urlName = urlName;
    this.translators = translators;
  }
}
