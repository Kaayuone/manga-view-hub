import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleController } from './title.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [TitleController],
  providers: [TitleService, PrismaService],
})
export class TitleModule {}
