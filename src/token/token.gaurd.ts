import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import { ResponseException } from '../network/response.exception';
import Translate from '../utilities/locale/locale.translation';
import { JwtService } from '@nestjs/jwt';
import { TokenStatusEnum } from './enum/token.status.enum';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let authorizationHeader = request.headers["authorization"];
    if (!authorizationHeader) {
      throw new ResponseException({
        errors: [
          {
            property: "authorization",
            message: Translate('auth_fail')
          }
        ],
        message:  Translate('fail_response')
      }, HttpStatus.UNAUTHORIZED);
    }
    const parts = authorizationHeader.split(' ');
    const jwtToken = parts[1];
    if (!jwtToken || jwtToken.length < 1){
      throw new ResponseException({
        errors: [
          {
            property: "authorization",
            message: Translate('auth_fail')
          }
        ],
        message:  Translate('fail_response')
      }, HttpStatus.UNAUTHORIZED);
    }

    const jwtParsed = await this.jwtService.verifyAsync(jwtToken )

    let token = await this.tokenService.findByIdentifier(jwtParsed.jti , 'status tag locked_until user');
    if (!token){
      throw new ResponseException({
        errors: [
          {
            property: "authorization",
            message: Translate('auth_fail')
          }
        ],
        message:  Translate('fail_response')
      }, HttpStatus.UNAUTHORIZED);
    }
    if (token.status != TokenStatusEnum.ACTIVE){
      throw new ResponseException({
        errors: [
          {
            property: "authorization",
            message: Translate('auth_fail')
          }
        ],
        message:  Translate('fail_response')
      }, HttpStatus.UNAUTHORIZED);
    }
    if (token.tag !== jwtParsed.t){
      throw new ResponseException({
        errors: [
          {
            property: "authorization",
            message: Translate('auth_fail')
          }
        ],
        message:  Translate('fail_response')
      }, HttpStatus.UNAUTHORIZED);
    }
    request.user = await this.userService.findById(token.user , 'first_name last_name phone_number tag _id')
    return true;
  }
}