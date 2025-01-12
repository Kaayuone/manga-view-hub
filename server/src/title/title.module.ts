import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleController } from './title.controller';

@Module({
  imports: [HttpModule],
  controllers: [TitleController],
  providers: [TitleService],
})
export class TitleModule {}
