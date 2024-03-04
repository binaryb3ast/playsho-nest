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

export class DeviceUsernameDto {
  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'brand') })
  @IsString({ message: Translate('it_cant_be_empty', 'brand') })
  user_name: string;

}
