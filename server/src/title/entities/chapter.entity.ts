import type { ChapterPublisher, TitleChapter } from '@project-common/types/title';

export class Chapter {
  id: number;
  tome: number;
  number: number;
  publishDate: string;
  publishers: ChapterPublisher[];
  isPaid: boolean;

  constructor({ id, isPaid, number, publishDate, publishers, tome }: TitleChapter) {
    this.id = id;
    this.isPaid = isPaid;
    this.number = number;
    this.publishDate = publishDate;
    this.publishers = publishers;
    this.tome = tome;
  }
}
