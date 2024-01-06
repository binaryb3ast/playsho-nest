import { ErrorResponse } from './response.error';

export interface Result<T> {
  code?: number;
  message: string;
  errors?: [ErrorResponse];
  result?: T;
  meta?: {
    page?: number;
    limit?: number;
    totalPage?: number;
    count?: number;
  };
}
