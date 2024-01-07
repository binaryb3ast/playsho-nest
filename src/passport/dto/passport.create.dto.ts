import { IsDate, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import Translate from '../../utilities/locale/locale.translation';

export class PassportCreateDto {
  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'phone_number') })
  @IsString({ message: Translate('it_cant_be_empty', 'phone_number') })
  receptor: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'device') })
  @IsString({ message: Translate('it_cant_be_empty', 'device') })
  @IsUUID(4, { message: Translate('it_cant_be_empty', 'device') })
  device: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'secret') })
  @IsString({ message: Translate('it_cant_be_empty', 'secret') })
  secret: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'expire_at') })
  @IsDate({ message: Translate('it_cant_be_empty', 'expire_at') })
  expire_at: Date;
}
