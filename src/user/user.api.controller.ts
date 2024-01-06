import { Controller, Get, Req, Version } from '@nestjs/common';
import { Request } from 'express';

@Controller('api/user')
export class UserApiController {
  @Version('1')
  @Get('/')
  findAllV1(@Req() request: Request): string {
    return 'This action returns all cats for version 1';
  }
}
