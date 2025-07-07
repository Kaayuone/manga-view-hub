import type { SourceName } from '@project-common/types/source';

export type LibraryItem = {
  idInSource: number;
  sourceName: SourceName;
  urlName: string;
  title: string;
  cover: string;
  id: number;
  sourceMediaLink: string;
};
