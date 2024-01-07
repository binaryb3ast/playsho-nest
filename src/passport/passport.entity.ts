import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Schema as MongooseSchema,
  Schema as mongooseSchema,
} from 'mongoose';
import CryptographyUtils from '../utilities/app.cryptography';
import { Device } from '../device/device.entity';
import AppCryptography from '../utilities/app.cryptography';

@Schema()
export class Passport extends Document {
  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    unique: true,
    index: true,
    default: () => AppCryptography.generateUUID(),
  })
  tag: string;

  @Prop({ trim: true, default: null })
  device: string;

  @Prop({ trim: true, default: null })
  receptor: string;

  @Prop({ trim: true, default: null })
  secret: string;

  @Prop({ trim: true, default: 0 })
  fail_attempt: number;

  @Prop({ trim: true, default: 3 })
  max_fail_attempt: number;

  @Prop({ default: null })
  expire_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const PassportSchema = SchemaFactory.createForClass(Passport);

PassportSchema.pre<Passport>('updateOne', async function (next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

PassportSchema.pre<Passport>('save', async function (next) {
  next();
});

PassportSchema.index({ expire_at: 1 }, { expires: '5m' });
