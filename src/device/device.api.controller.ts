import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, Version } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { Request } from "express";
import { DeviceGenerateDto } from "./dto/device.generate.dto";
import { ResponseResult } from "../network/response.result";
import { Device } from "./device.entity";
import Translate from "../utilities/locale/locale.translation";
import { HttpStatusCode } from "axios";
import { TokenService } from "../token/token.service";
import AppCryptography from "../utilities/app.cryptography";
import { JwtService } from "@nestjs/jwt";
import { DeviceKeypairRegenerateDto } from "./dto/device.keypair.regenerate.dto";
import { TokenGuard } from "../token/token.gaurd";
import { DeviceUsernameDto } from "./dto/device.username.dto";
import { AppNameSanitizer } from "../utilities/app.namesanitizer";
import { ResponseException } from "../network/response.exception";

@Controller("api/device")
export class DeviceApiController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly tokenService: TokenService,
    private readonly nameSanitizer: AppNameSanitizer,
    private readonly jwtService: JwtService
  ) {
  }

  @Version("1")
  @HttpCode(HttpStatusCode.Ok)
  @Post("/generate")
  async login(
    @Req() request: Request,
    @Body() payload: DeviceGenerateDto
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
        public_key: payload.public_key,
        identifier: AppCryptography.createHash(
          device.tag + Date.now()
        )
      });
    } else {
      token = await this.tokenService.updateIdentifier(
        token._id,
        AppCryptography.createHash(device.tag + Date.now())
      );
      token = await this.tokenService.updatePublicKey(
        token._id,
        payload.public_key
      );
    }
    const jwtToken = await this.jwtService.signAsync(
      {
        t: token.tag
      },
      {
        jwtid: token.identifier,
        subject: device.tag
      }
    );
    return {
      message: Translate("success_response"),
      result: {
        device: {
          tag: device.tag,
          token: jwtToken,
          user_name: device.user_name
        }
      }
    };
  }

  @Version("1")
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(TokenGuard)
  @Post("/keypair/regenerate")
  async regenerateKeypair(
    @Req() request: Request,
    @Body() payload: DeviceKeypairRegenerateDto
  ): Promise<ResponseResult<any>> {
    let token = await this.tokenService.updatePublicKey(
      request["token"]._id,
      payload.public_key
    );
    return {
      message: Translate("rsa_change_successfully")
    };
  }

  @Version("1")
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(TokenGuard)
  @Post("/name")
  async updateName(
    @Req() request: Request,
    @Body() payload: DeviceUsernameDto
  ): Promise<ResponseResult<any>> {
    if (this.nameSanitizer.hasForbiddenTerm(payload.user_name)){
      throw new ResponseException(
        {
          errors: [
            {
              property: 'user_name',
              message: Translate('room_not_found'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.FORBIDDEN,
      );
    }
    let device = await this.deviceService.updateName(request["device"]._id, payload.user_name);
    return {
      message: Translate("user_name_change_successfully"),
      result:{
        device:{
          user_name: device.user_name
        }
      }
    };
  }
}
