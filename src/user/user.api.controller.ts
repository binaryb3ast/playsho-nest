import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
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
import { TokenService } from '../token/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/user.register.dto';
import { TokenGuard } from '../token/token.gaurd';
import { UserStatusEnum } from './enum/user.status.enum';

@Controller('api/user')
export class UserApiController {
  constructor(
    private readonly userService: UserService,
    private readonly deviceService: DeviceService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
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
        '_id status phone_number',
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
      receptor: user.phone_number,
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
    const device = await this.deviceService.findOneByTag(
      payload.device,
      'tag _id',
    );
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
    if (
      String(passport.secret) !== String(payload.otp) ||
      passport.device !== payload.device
    ) {
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
    const user = await this.userService.findByPhoneNumber(
      passport.receptor,
      '_id tag first_name last_name status',
    );
    if (!user) {
      throw new ResponseException(
        {
          errors: [
            {
              property: 'user',
              message: Translate('not_found'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.NOT_FOUND,
      );
    }
    let token = await this.tokenService.findOneByUserDevice(
      device._id,
      user._id,
    );
    if (!token) {
      token = await this.tokenService.create({
        user: user._id,
        device: device._id,
        identifier: AppCryptography.createHash(
          user.tag + device.tag + Date.now(),
        ),
      });
    } else {
      token = await this.tokenService.updateIdentifier(
        token._id,
        AppCryptography.createHash(user.tag + device.tag + Date.now()),
      );
    }
    const jwtToken = await this.jwtService.signAsync(
      {
        t: token.tag,
      },
      {
        jwtid: token.identifier,
        subject: user.tag,
      },
    );
    await this.passportService.deleteById(passport._id);
    return {
      message: Translate('success_response'),
      result: {
        token: jwtToken,
        user: {
          tag: user.tag,
          status: user.status,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      },
    };
  }

  @Version('1')
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  @UseGuards(TokenGuard)
  async register(
    @Req() request: Request,
    @Body() payload: UserRegisterDto,
  ): Promise<ResponseResult<any>> {
    console.log(request['user']);
    const user = await this.userService.updateNameById(
      request['user']._id,
      payload.first_name,
      payload.last_name,
      'first_name last_name',
    );
    await this.userService.updateStatusById(
      request['user']._id,
      UserStatusEnum.ACTIVE,
      'tag',
    );
    return {
      message: Translate('success_response'),
      result: {
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
        },
      },
    };
  }

  @Version('1')
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(TokenGuard)
  async getMe(@Req() request: Request): Promise<ResponseResult<any>> {
    return {
      message: Translate('success_response'),
      result: {
        user: request['user'],
      },
    };
  }
}
