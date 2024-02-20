import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceApiController } from './device.api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './device.entity';
import { TokenModule } from "../token/token.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    TokenModule
  ],
  controllers: [DeviceApiController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
