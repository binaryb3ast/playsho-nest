import { Body, Controller, HttpCode, Post, Req, UseGuards, Version } from '@nestjs/common';
import { RoomService } from './room.service';
import { HttpStatusCode } from 'axios';
import { Request } from 'express';
import { DeviceGenerateDto } from '../device/dto/device.generate.dto';
import { ResponseResult } from '../network/response.result';
import { Device } from '../device/device.entity';
import AppCryptography from '../utilities/app.cryptography';
import Translate from '../utilities/locale/locale.translation';
import { TokenGuard } from '../token/token.gaurd';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {
  }

  @Version('1')
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(TokenGuard)
  @Post('/')
  async create(
    @Req() request: Request,
  ): Promise<ResponseResult<any>> {
    let room = await this.roomService.create({
      device: request['device']._id,
    });

    return {
      message: Translate('success_response'),
      result: {},
    };
  }
}
