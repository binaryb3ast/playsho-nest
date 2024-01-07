import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import Translate from '../../utilities/locale/locale.translation';

export class UserCreateDto {
  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'phone_number') })
  @IsString({ message: Translate('it_cant_be_empty', 'phone_number') })
  @Matches(/^(0)?9\d{9}$/, {
    message: Translate('it_cant_be_empty', 'phone_number'),
  })
  phone_number: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'device') })
  @IsString({ message: Translate('it_cant_be_empty', 'device') })
  @IsUUID(4, { message: Translate('it_cant_be_empty', 'device') })
  device: string;
}
