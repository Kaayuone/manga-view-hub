import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from './search/search.module';

@Module({
  imports: [HttpModule, SearchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
