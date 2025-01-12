import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from './search/search.module';
import { TitleModule } from './title/title.module';

@Module({
  imports: [HttpModule, SearchModule, TitleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
