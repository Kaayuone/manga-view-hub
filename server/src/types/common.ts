import type { ChapterFrame } from '@project-common/types/title';

export type WorkType = 'Манга' | 'Новелла';

export interface ChapterResponse {
  tome: number;
  chapter: string;
  pages: ChapterFrame[];
}
