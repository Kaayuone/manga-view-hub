export type SourceName = "remanga";

export type Source = {
  name: SourceName;
  text: string;
  description: string;
  iconPath: string;
};

export type StoryListItem = {
  id: number;
  urlName: string;
  title: string;
  cover: string;
  sourceMediaLink: string;
};

export type StoryInfo = StoryListItem & {
  authors: string[];
  description: string;
  status: string;
  tags: string[];
  chapterListId: number;
  translators?: string[];
};

export type ChapterPublisher = {
  id: number;
  name: string;
};

export type StoryChapter = {
  id: number;
  tome: number;
  number: number;
  publishDate: string;
  publishers: ChapterPublisher[];
  isPaid: boolean;
};
