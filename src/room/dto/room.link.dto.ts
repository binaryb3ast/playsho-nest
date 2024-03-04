import {
  IsEnum,
  IsNotEmpty,
  IsNumber, IsNumberString,
  IsOptional,
  IsString
} from "class-validator";
import Translate from '../../utilities/locale/locale.translation';

export class RoomLinkDto {

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'device') })
  @IsString({ message: Translate('it_cant_be_empty', 'device') })
  stream_link: string;
}
