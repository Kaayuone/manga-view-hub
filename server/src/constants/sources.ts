import { Source, SourceName } from '@project-common/types/source';

export const SOURCE_LIST: Source[] = [
  {
    name: 'remanga',
    text: 'Remanga',
    description: 'Русский',
    iconPath: 'remanga.png',
  },
];

export const SEARCH_LINKS_SOURCE_API_MAP = new Map<SourceName, string>([
  ['remanga', 'https://api.remanga.org/api/search/?query='],
]);

export enum MediaLinks {
  REMANGA = 'https://remanga.org/',
}
