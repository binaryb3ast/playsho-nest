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

  @Prop({ trim: true, default: null })
  name: string;

  @Prop({ trim: true, unique: true })
  secret: string;

  @Prop({ trim: true, default: null })
  fcm_token: string;

  @Prop({
    trim: true,
    default: null,
    set: (value) => value.toLowerCase(),
  })
  brand: string;

  @Prop({
    trim: true,
    default: null,
    set: (value) => value.toLowerCase(),
  })
  model: string;

  @Prop({
    trim: true,
    default: null,
    set: (value) => value.toLowerCase(),
  })
  manufacturer: string;

  @Prop({ trim: true, default: null })
  os_version: string;

  @Prop({
    trim: true,
    default: 'unknown',
    set: (value) => value.toLowerCase(),
  })
  store: string;

  @Prop({
    trim: true,
    default: 'unknown',
    set: (value) => value.toLowerCase(),
  })
  os: string;

  @Prop({ trim: true, default: 1 })
  app_version: number;

  @Prop({
    trim: true,
    default: 'unknown',
    set: (value) => value.toLowerCase(),
  })
  app_version_name: string;

  @Prop({ default: Date.now })
  last_update_at: Date;

  @Prop({ default: Date.now })
  first_install_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop({ default: Date.now })
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
  next();
});
