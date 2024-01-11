import { Body, Controller, Get, HttpCode, Post, Req, Version } from "@nestjs/common";
import { DeviceService } from './device.service';
import { Request } from 'express';
import { DeviceGenerateDto } from './dto/device.generate.dto';
import { ResponseResult } from '../network/response.result';
import { Device } from './device.entity';
import Translate from '../utilities/locale/locale.translation';
import { HttpStatusCode } from "axios";

@Controller('api/device')
export class DeviceApiController {
  constructor(private readonly deviceService: DeviceService) {}

  @Version('1')
  @HttpCode(HttpStatusCode.Ok)
  @Post('/generate')
  async login(
    @Req() request: Request,
    @Body() payload: DeviceGenerateDto,
  ): Promise<ResponseResult<any>> {
    let device: Device;
    const isExist = await this.deviceService.isSecretExist(payload.secret);
    if (isExist) {
      device = await this.deviceService.findOneBySecret(payload.secret);
    } else {
      device = await this.deviceService.generate(payload);
    }
    return {
      message: Translate('success_response'),
      result: {
        device: {
          tag: device.tag,
        },
      },
    };
  }
}
