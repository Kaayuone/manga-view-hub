import { Injectable } from '@nestjs/common';
import type { TitleRepository } from './title.repository';

@Injectable()
export class TitleService {
  constructor(readonly titleRepository: TitleRepository) {}
}
