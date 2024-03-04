import { forwardRef, Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceApiController } from './device.api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './device.entity';
import { TokenModule } from "../token/token.module";
import { AppNameSanitizer } from "../utilities/app.namesanitizer";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    forwardRef(()=>TokenModule),
  ],
  controllers: [DeviceApiController],
  providers: [DeviceService,AppNameSanitizer],
  exports: [DeviceService],
})
export class DeviceModule {}
