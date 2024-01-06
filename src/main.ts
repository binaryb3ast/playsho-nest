import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DeviceLoader } from './device/device.loader';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponsesExceptionFactory } from './network/responses.exception.factory';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  DeviceLoader.init();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ResponsesExceptionFactory,
    }),
  );
  await app.listen(3000);
}

bootstrap();
