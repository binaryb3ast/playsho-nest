import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TokenModule } from './token/token.module';
import { TerminusModule } from "@nestjs/terminus";
import { HealthModule } from "./health/health.module";
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.NODE_ENV == 'development'
        ? process.env.MONGO_URL_LOCAL
        : process.env.MONGO_URL_REMOTE,
    ),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
    }),
    HealthModule,
    UserModule,
    TokenModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
