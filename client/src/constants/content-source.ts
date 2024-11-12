import type { SearchSource } from '@/features/search-source-item/types';
import remangaIcon from '@/assets/images/remanga.png';

export enum ContentSourceNames {
  REMANGA = 'REMANGA',
}

export const sourceItemsMap = new Map<ContentSourceNames, SearchSource>([
  [
    ContentSourceNames.REMANGA,
    {
      text: 'Remanga',
      name: 'remanga',
      description: 'Русский',
      iconPath: remangaIcon,
      type: 'mixed',
    },
  ],
]);
