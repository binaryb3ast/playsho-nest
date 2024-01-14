import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DeviceLoader } from './device/device.loader';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponsesExceptionFactory } from './network/responses.exception.factory';
import { LevelExpEnum } from './level/enum/level.exp.enum';

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
  console.log('You are level ' + findLevel(33560));
  await app.listen(3000);
}

function findLevel(exp: number): number | undefined {
  const levels = Object.keys(LevelExpEnum).reverse();

  for (const level of levels) {
    const levelValue = LevelExpEnum[level as keyof typeof LevelExpEnum];
    if (exp >= levelValue) {
      return parseInt(level.split('_')[1]);
    }
  }
  return undefined;
}

bootstrap();
