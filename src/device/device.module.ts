import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceApiController } from './device.api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.entity';
import { Device, DeviceSchema } from './device.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [DeviceApiController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
