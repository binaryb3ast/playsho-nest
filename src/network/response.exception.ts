import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseResult } from './response.result';

export class ResponseException extends HttpException {
  constructor(response: ResponseResult<any>, code: HttpStatus) {
    super(response, code);
  }
}
