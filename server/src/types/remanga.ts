import { WorkType } from './common';

type RemangaObject<T = string> = {
  id: number;
  name: T;
};

type StoryImages = {
  low: string;
  mid: string;
  high: string;
};

type RemangaCreator = {
  id: number;
  name: string;
  cover: {
    mid: string;
    high: string;
  };
  type?: number; // number type of creator: издатель/художник и т.п.
};

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
  cover: StoryImages;
  type: WorkType;
  status: {
    id: number;
    name: string;
  };
  count_chapters: number;
  is_yaoi: boolean;
  is_erotic: boolean;
  count_bookmarks: number;
  bookmark_type: unknown;
  rus_name: string;
  en_name: string;
  img: StoryImages;
}

type ChapterInStoryInfo = {
  id: number;
  tome: number;
  chapter: string;
};

type StoryPublisher = {
  id: number;
  img: string;
  name: string;
  cover: {
    mid: string;
    high: string;
  };
  dir: string;
  tagline: string;
  type: string;
};

type RemangaBranch = {
  id: number; // id to get chapters
  img: {
    mid: string;
    high: string;
  };
  subscribed: boolean;
  total_votes: number;
  count_chapters: number;
  publishers: unknown; // array of publishers
  immune_date: string;
};

export interface RemangaStoryInfo {
  id: number;
  secondary_name: string;
  main_name: string;
  another_name: string;
  dir: string;
  description: string;
  issue_year: number;
  avg_rating: string;
  cover: StoryImages;
  count_rating: number;
  age_limit: number;
  status: RemangaObject;
  translate_status: RemangaObject;
  type: RemangaObject<WorkType>;
  creators: {
    [key: string]: RemangaCreator[]; // string is number which is type of the creator
  };
  genres: RemangaObject[];
  categories: RemangaObject[];
  branches: RemangaBranch[];
  first_chapter: ChapterInStoryInfo;
  continue_reading: unknown;
  current_reading: unknown;
  start_reading: ChapterInStoryInfo;
  is_licensed: boolean;
  is_legal: boolean;
  uploaded: number;
  can_post_comments: boolean;
  adaptation: unknown;
  publishers: StoryPublisher[];
  is_yaoi: boolean;
  is_erotic: boolean;
  rus_name: string;
  en_name: string;
  has_anime: boolean;
  has_voiceover: boolean;
  wallpaper: unknown; // probably page wallpaper
  forbidden_fields: unknown;
  new_season_date: unknown;
  note: string;
  total_votes: number;
  total_views: number;
  count_bookmarks: number;
  count_chapters: number;
  count_comments: number;
  count_cards: number;
  count_characters: number;
  count_posts: number;
  img: StoryImages;
  bookmark_type: unknown;
  has_cards: boolean;
  has_characters: boolean;
  has_posts: boolean;
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

export interface RemangaTitleInfoResponse {
  content: RemangaStoryInfo;
  msg: string;
  props: {
    age_limit: RemangaObject[];
    can_upload_chapters: boolean;
    can_update: boolean;
    can_pin_comment: boolean;
    promotion: unknown;
    admin_link: unknown;
    is_forbidden_by_country: boolean;
  };
}

interface RemangaChapterPublisher extends RemangaObject {
  dir: string;
}

export interface RemangaChapter {
  chapter: string;
  id: number;
  index: number;
  is_bought: boolean;
  is_free_today: boolean;
  is_paid: boolean;
  name: string;
  price: string;
  pub_date: string;
  publishers: RemangaChapterPublisher[];
  rated: boolean;
  score: number;
  tome: number;
  upload_date: string;
  viewed: unknown;
}
