import type { ChapterFrame } from '@project-common/types/common';

export interface ChapterInfoResponse {
  tome: number;
  chapter: string;
  pages: ChapterFrame[];
}
