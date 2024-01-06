import { HttpException, HttpStatus } from '@nestjs/common';
import { Result } from './response.result';

export class ResponseException extends HttpException {
  constructor(response: Result<any>, code: HttpStatus) {
    super(response, code);
  }
}
