import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import Translate from '../../utilities/locale/locale.translation';

export class UserRegisterDto {
  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'phone_number') })
  @IsString({ message: Translate('it_cant_be_empty', 'phone_number') })
  first_name: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'device') })
  @IsString({ message: Translate('it_cant_be_empty', 'device') })
  last_name: string;
}
