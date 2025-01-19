import type { SearchSource } from '@/features/search-source-item/types';
import remangaIcon from '@/assets/images/remanga.png';
import type { SourceName } from '@project-common/types/source';

export enum ContentSourceNames {
  REMANGA = 'REMANGA',
}

// TODO: replace all source info into server
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

export const SourcesTitleUseUrl: SourceName[] = ['remanga'];
