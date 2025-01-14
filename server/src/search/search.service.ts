import { Injectable } from '@nestjs/common';
import { SOURCES } from '@/constants';

@Injectable()
export class SearchService {
  findAllSources(name?: string) {
    return SOURCES.SOURCE_LIST.filter(source => source.text.includes(name ?? ''));
  }
}
