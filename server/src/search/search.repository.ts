import type { Source } from '@project-common/types/source';

export interface SearchRepository {
  findAllSources(name?: string): Source[];
}
