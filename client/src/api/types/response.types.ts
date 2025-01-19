import type { ChapterFrame } from '@project-common/types/title';

export interface ChapterInfoResponse {
  tome: number;
  chapter: string;
  pages: ChapterFrame[];
}
