import { Body, Controller, Get, HttpCode, Post, Req, Version } from "@nestjs/common";
import { DeviceService } from './device.service';
import { Request } from 'express';
import { DeviceGenerateDto } from './dto/device.generate.dto';
import { ResponseResult } from '../network/response.result';
import { Device } from './device.entity';
import Translate from '../utilities/locale/locale.translation';
import { HttpStatusCode } from "axios";
import { TokenService } from "../token/token.service";
import AppCryptography from "../utilities/app.cryptography";
import { JwtService } from "@nestjs/jwt";

@Controller('api/device')
export class DeviceApiController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

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
    let token = await this.tokenService.findOneByDevice(
      device._id
    );
    if (!token) {
      token = await this.tokenService.create({
        device: device._id,
        identifier: AppCryptography.createHash(
           device.tag + Date.now(),
        ),
      });
    } else {
      token = await this.tokenService.updateIdentifier(
        token._id,
        AppCryptography.createHash( device.tag + Date.now()),
      );
    }
    const jwtToken = await this.jwtService.signAsync(
      {
        t: token.tag,
      },
      {
        jwtid: token.identifier,
        subject: device.tag,
      },
    );
    return {
      message: Translate('success_response'),
      result: {
        device: {
          tag: device.tag,
          token:jwtToken,
          user_name:device.user_name
        },
      },
    };
  }
}
