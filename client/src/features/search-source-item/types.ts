import type { ContentType } from '@/types';

export type SearchSource = {
  text: string;
  name: string;
  description: string;
  iconPath: string;
  type: ContentType;
};
