import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from './search/search.module';
import { TitleModule } from './title/title.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    HttpModule,
    SearchModule,
    TitleModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../client/dist'),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
