import type { ChapterFrame } from '@project-common/types/common';

export type WorkType = 'Манга' | 'Новелла';

export interface ChapterResponse {
  tome: number;
  chapter: string;
  pages: ChapterFrame[];
}
