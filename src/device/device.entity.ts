import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { DeviceLoader } from './device.loader';

@Schema()
export class Device extends Document {
  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    unique: true,
    index: true,
    default: () => AppCryptography.generateUUID(),
  })
  tag: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
  })
  name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
  })
  user_name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    unique: true,
  })
  secret: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    unique: true,
  })
  public_key: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
  })
  fcm_token: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
    set: (value: string) => value.toLowerCase().trim(),
  })
  brand: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
    set: (value: string) => value.toLowerCase().trim(),
  })
  model: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
    set: (value: string) => value.toLowerCase().trim(),
  })
  manufacturer: string;

  @Prop({ trim: true, default: null })
  os_version: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: 'unknown',
    set: (value: string) => value.toLowerCase().trim(),
  })
  os: string;

  @Prop({
    type: MongooseSchema.Types.Number,
    trim: true,
    default: 1,
  })
  app_version: number;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: 'unknown',
    set: (value: string) => value.toLowerCase().trim(),
  })
  app_version_name: string;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now,
  })
  last_update_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now,
  })
  first_install_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now,
  })
  updated_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
  })
  deleted_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now,
  })
  created_at: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.index({ tag: 1 });

DeviceSchema.pre<Device>('save', async function (next) {
  this.name = `${this.brand} ${this.model}`;
  if (this.brand !== 'apple') {
    this.name = DeviceLoader.getDeviceMarketingNameByModel(this.model);
    this.brand = DeviceLoader.getDeviceBrandByModel(this.model);
  }
  this.user_name = this.name;
  next();
});
