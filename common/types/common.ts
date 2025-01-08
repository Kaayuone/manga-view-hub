export type PaginationInfo = {
  isFirst: boolean;
  isLast: boolean;
};

export type Pagination = PaginationInfo & {
  page: number;
  size: number;
  totalItems: number;
};

export type PaginationResponse<T> = Pagination & {
  content: T[];
};

export type ChapterFrame = {
  id: number;
  url: string;
  height: number;
  width: number;
};
