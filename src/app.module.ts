import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TokenModule } from './token/token.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';
import { DeviceModule } from './device/device.module';
import { RoomModule } from './room/room.module';
import { AppGateway } from "./app.gateway";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
     process.env.MONGO_URL_LOCAL
    ),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
    }),
    HealthModule,
    TokenModule,
    DeviceModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
