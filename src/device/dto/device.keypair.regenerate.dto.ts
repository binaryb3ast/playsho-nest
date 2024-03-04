import {
  IsEnum,
  IsNotEmpty,
  IsNumber, IsNumberString,
  IsOptional,
  IsString
} from "class-validator";
import Translate from '../../utilities/locale/locale.translation';
import { Optional } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { DeviceStoreEnum } from '../enum/device.store.enum';

export class DeviceKeypairRegenerateDto {

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'public_key') })
  @IsString({ message: Translate('it_cant_be_empty', 'public_key') })
  public_key: string;

}
