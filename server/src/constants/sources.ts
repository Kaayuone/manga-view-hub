import { Source, SourceName } from '@project-common/types/source';

export const SOURCE_LIST: Source[] = [
  {
    name: 'remanga',
    text: 'Remanga',
    description: 'Русский',
    // TODO: create path for static images
    iconPath: 'remanga.png',
  },
];

export const SEARCH_LINKS_SOURCE_API_MAP = new Map<SourceName, string>([
  ['remanga', 'https://api.remanga.org/api/search/?query='],
]);

export enum MediaLinks {
  REMANGA = 'https://remanga.org',
}

export const SEARCH_TITLE_LINK = new Map<SourceName, string>([
  ['remanga', 'https://api.remanga.org/api/titles/'],
]);

export const SEARCH_CHAPTERS_LINK = new Map<SourceName, string>([
  ['remanga', 'https://api.remanga.org/api/titles/chapters'],
]);
