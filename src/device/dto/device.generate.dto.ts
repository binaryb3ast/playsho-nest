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

export class DeviceGenerateDto {
  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'secret') })
  @IsString({ message: Translate('it_cant_be_empty', 'secret') })
  secret: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'public_key') })
  @IsString({ message: Translate('it_cant_be_empty', 'public_key') })
  public_key: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'brand') })
  @IsString({ message: Translate('it_cant_be_empty', 'brand') })
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  brand: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'model') })
  @IsString({ message: Translate('it_cant_be_empty', 'model') })
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  model: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'manufacturer') })
  @IsString({ message: Translate('it_cant_be_empty', 'manufacturer') })
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  manufacturer: string;

  @IsOptional()
  @IsString({ message: Translate('it_cant_be_empty', 'os_version') })
  os_version: string;

  @IsOptional()
  @IsString({ message: Translate('it_cant_be_empty', 'os') })
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  os: string;

  @IsOptional()
  @IsNumberString(null, { message: Translate('it_cant_be_empty', 'app_version') })
  app_version: number;

  @IsOptional()
  @IsString({ message: Translate('it_cant_be_empty', 'app_version_name') })
  app_version_name: string;

  @IsOptional()
  @IsNumberString(null, { message: Translate('it_cant_be_empty', 'last_update_at') })
  last_update_at: number;

  @IsOptional()
  @IsNumberString(null, { message: Translate('it_cant_be_empty', 'first_install_at') })
  first_install_at: number;
}
