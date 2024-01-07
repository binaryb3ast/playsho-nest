import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Version,
} from '@nestjs/common';
import { Request } from 'express';
import { ResponseResult } from '../network/response.result';
import Translate from '../utilities/locale/locale.translation';
import { UserCreateDto } from './dto/user.create.dto';
import { DeviceService } from '../device/device.service';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ResponseException } from '../network/response.exception';
import { PassportService } from '../passport/passport.service';
import AppCryptography from '../utilities/app.cryptography';
import { AppUtils } from '../utilities/app.utils';
import { UserVerifyDto } from './dto/user.verify.dto';

@Controller('api/user')
export class UserApiController {
  constructor(
    private readonly userService: UserService,
    private readonly deviceService: DeviceService,
    private readonly passportService: PassportService,
  ) {}

  @Version('1')
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() request: Request,
    @Body() payload: UserCreateDto,
  ): Promise<ResponseResult<any>> {
    const isUserExist = await this.userService.isPhoneNumberExist(
      payload.phone_number,
    );
    let user: User;
    if (isUserExist) {
      user = await this.userService.findByPhoneNumber(
        payload.phone_number,
        '_id status',
      );
    } else {
      user = await this.userService.create(payload);
    }
    const device = await this.deviceService.findOneByTag(payload.device, 'tag');
    if (!device) {
      throw new ResponseException(
        {
          errors: [
            {
              property: 'device',
              value: payload.device,
              message: Translate('not_found'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const lastPassport = await this.passportService.findByDeviceAndReceptor(
      payload.device,
      payload.phone_number,
    );

    if (
      lastPassport &&
      !AppUtils.hasNMinutesPassed(1, lastPassport.created_at)
    ) {
      throw new ResponseException(
        {
          errors: [
            {
              property: 'passport',
              message: Translate('must_wait_couple_minute'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const passport = await this.passportService.create({
      receptor: payload.phone_number,
      device: device.tag,
      secret: String(AppCryptography.generateSecureNumber(1000, 9999)),
      expire_at: new Date(),
    });
    return {
      message: Translate('success_response'),
      result: {
        passport: passport.tag,
      },
    };
  }

  @Version('1')
  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Req() request: Request,
    @Body() payload: UserVerifyDto,
  ): Promise<ResponseResult<any>> {
    const device = await this.deviceService.findOneByTag(payload.device, 'tag');
    if (!device) {
      throw new ResponseException(
        {
          errors: [
            {
              property: 'device',
              value: payload.device,
              message: Translate('not_found'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const passport = await this.passportService.findOneByTag(payload.passport);
    if (!passport) {
      throw new ResponseException(
        {
          errors: [
            {
              property: 'passport',
              value: payload.passport,
              message: Translate('otp_expired'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (passport.secret !== payload.otp && passport.device !== payload.device) {
      throw new ResponseException(
        {
          errors: [
            {
              property: 'passport',
              value: payload.passport,
              message: Translate('otp_incorrect'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: Translate('success_response'),
      result: {
        passport: passport.tag,
      },
    };
  }
}
