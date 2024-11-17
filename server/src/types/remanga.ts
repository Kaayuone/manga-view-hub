import { WorkType } from './common';

export interface StoryRemanga {
  id: number;
  main_name: string;
  secondary_name: string;
  translate_status: number;
  dir: string;
  issue_year: number;
  avg_rating: string;
  total_votes: number;
  total_views: number;
  is_licensed: boolean;
  is_legal: boolean;
  cover: {
    low: string;
    mid: string;
    high: string;
  };
  type: WorkType;
  status: {
    id: number;
    name: string;
  };
  count_chapters: number;
  is_yaoi: boolean;
  is_erotic: boolean;
  count_bookmarks: number;
  bookmark_type: unknown | null;
  rus_name: string;
  en_name: string;
  img: {
    low: string;
    mid: string;
    high: string;
  };
}

export interface RemangaResponse {
  msg: string;
  content: StoryRemanga[];
  props: {
    total_items: number;
    total_pages: number;
    page: number;
  };
}
