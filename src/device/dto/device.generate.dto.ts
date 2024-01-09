import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import Translate from '../../utilities/locale/locale.translation';
import { Optional } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { DeviceStoreEnum } from '../enum/device.store.enum';

export class DeviceGenerateDto {
  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @IsString({ message: Translate('it_cant_be_empty', 'userCapacity') })
  secret: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @IsString({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  brand: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @IsString({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  model: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @IsString({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  manufacturer: string;

  @IsNotEmpty({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @IsEnum(DeviceStoreEnum, {
    message: Translate('it_cant_be_empty', 'userCapacity'),
  })
  store: DeviceStoreEnum;

  @IsOptional()
  @IsString({ message: Translate('it_cant_be_empty', 'userCapacity') })
  os_version: string;

  @IsOptional()
  @IsString({ message: Translate('it_cant_be_empty', 'userCapacity') })
  @Transform(({ value }: TransformFnParams) => value.toLowerCase().trim())
  os: string;

  @IsOptional()
  @IsNumber(null, { message: Translate('it_cant_be_empty', 'userCapacity') })
  app_version: number;

  @IsOptional()
  @IsString({ message: Translate('it_cant_be_empty', 'userCapacity') })
  app_version_name: string;

  @IsOptional()
  @IsNumber(null, { message: Translate('it_cant_be_empty', 'userCapacity') })
  last_update_at: number;

  @IsOptional()
  @IsNumber(null, { message: Translate('it_cant_be_empty', 'userCapacity') })
  first_install_at: number;
}
