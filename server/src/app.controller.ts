// TODO: delete controller
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHtml(@Res() res: Response) {
    console.log(__dirname);
    console.log('got request', __dirname + '../../../../client/dist');
    // res.sendFile('index.html', { root: __dirname + '../../../../client/dist' });
    res.send('hello');
  }
}
