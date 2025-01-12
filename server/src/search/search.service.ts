import { Injectable } from '@nestjs/common';
import type { SearchRepository } from './search.repository';
import { SOURCES } from '@/constants';

@Injectable()
export class SearchService {
  constructor(readonly searchRepository: SearchRepository) {}

  findAllSources(name?: string) {
    return SOURCES.SOURCE_LIST.filter(source => source.text.includes(name ?? ''));
  }
}
