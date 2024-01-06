import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { Device } from '../device/device.entity';
import { User } from '../user/user.entity';
import { TokenStatusEnum } from './enum/token.status.enum';

@Schema()
export class Token extends Document {
  @Prop({
    type: MongooseSchema.Types.UUID,
    trim: true,
    unique: true,
    index: true,
    default: () => AppCryptography.generateUUID(),
  })
  tag: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    default: null,
    required: true,
  })
  user: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Device.name,
    default: null,
    required: true,
  })
  device: MongooseSchema.Types.ObjectId;

  @Prop({
    trim: true,
    default: TokenStatusEnum.ACTIVE,
    enum: TokenStatusEnum,
  })
  status: TokenStatusEnum;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
  })
  terminate_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
  })
  locked_until: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now(),
  })
  updated_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
  })
  deleted_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now(),
  })
  created_at: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.pre<Token>('updateOne', async function (next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

TokenSchema.pre<Token>('save', async function (next) {
  next();
});
