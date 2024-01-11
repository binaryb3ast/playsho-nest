import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { CurrencyTypeEnum } from './enum/currency.type.enum';
import { User } from '../user/user.entity';

@Schema()
export class Currency extends Document {
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
    enum: CurrencyTypeEnum,
    default: CurrencyTypeEnum.COIN,
  })
  type: CurrencyTypeEnum;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  amount: number;

  @Prop({
    type: MongooseSchema.Types.String,
    default: null,
  })
  source: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    default: null,
  })
  user: MongooseSchema.Types.ObjectId;

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

export const CurrencySchema = SchemaFactory.createForClass(Currency);

CurrencySchema.pre<Currency>('updateOne', async function (next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

CurrencySchema.pre<Currency>('save', async function (next) {
  next();
});
