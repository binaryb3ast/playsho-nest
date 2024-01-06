import { HttpException, HttpStatus } from '@nestjs/common';

export const ResponsesExceptionFactory = (errors) => {
  const errorResponse = [];
  errors.forEach((error) => {
    const constraints = error.constraints;
    for (const key in constraints) {
      errorResponse.push({
        property: error.property,
        value: error.value,
        message: constraints[key],
      });
    }
  });
  return new HttpException(
    {
      code: 0,
      message: 'خطایی پیش آمده است.',
      errors: errorResponse,
    },
    HttpStatus.UNPROCESSABLE_ENTITY,
  );
};
