import type { TitleListItem } from "./source";

export type ChapterFrame = {
  id: number;
  url: string;
  height: number;
  width: number;
};

export type TitleInfo = TitleListItem & {
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

export type TitleChapter = {
  id: number;
  tome: number;
  number: number;
  publishDate: string;
  publishers: ChapterPublisher[];
  isPaid: boolean;
};
