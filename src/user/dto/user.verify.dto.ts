import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import Translate from '../../utilities/locale/locale.translation';

export class UserVerifyDto {
  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'otp') })
  @IsString({ message: Translate('it_cant_be_empty', 'otp') })
  otp: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'passport') })
  @IsString({ message: Translate('it_cant_be_empty', 'passport') })
  passport: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'device') })
  @IsString({ message: Translate('it_cant_be_empty', 'device') })
  @IsUUID(4, { message: Translate('it_cant_be_empty', 'device') })
  device: string;
}
