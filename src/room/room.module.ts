import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomApiController } from './room.api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.entity';
import { DeviceModule } from '../device/device.module';
import { TokenModule } from '../token/token.module';
import { MemberModule } from "../member/member.module";
import { GatewayServer } from "../gateway/gateway.server";
import { GatewayModule } from "../gateway/gateway.module";

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    DeviceModule,
    TokenModule,
    MemberModule,
    GatewayModule
  ],
  controllers: [RoomApiController],
  providers: [RoomService],
  exports:[RoomService]
})
export class RoomModule {}
