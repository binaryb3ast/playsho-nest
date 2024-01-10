import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { UserStatusEnum } from './enum/user.status.enum';
import Translate from '../utilities/locale/locale.translation';
import { UserGenderEnum } from './enum/user.gender.enum';

@Schema()
export class User extends Document {
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
    default: function () {
      return Translate('user');
    },
  })
  first_name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: function () {
      return Translate('alpha');
    },
  })
  last_name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: 'user',
  })
  role: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: UserGenderEnum.PREFER_NOT_TO_SAY,
  })
  sex: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    unique: true,
  })
  referral_code: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: '',
  })
  bio: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'File', default: null })
  avatar: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, default: null })
  referrer: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
  })
  password: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
  })
  salt: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
  })
  membership: string;

  @Prop({
    type: UserStatusEnum,
    trim: true,
    default: UserStatusEnum.NEED_REGISTER,
  })
  status: string;

  @Prop({
    type: MongooseSchema.Types.String,
    default: null,
    index: {
      unique: true,
      partialFilterExpression: { phoneNumber: { $type: 'string' } },
    },
    trim: true,
  })
  phone_number: string;

  @Prop({
    type: MongooseSchema.Types.String,
    default: null,
    set: (value: string) => value.toLowerCase().trim(),
    index: {
      unique: true,
      partialFilterExpression: { username: { $type: 'string' } },
    },
    trim: true,
  })
  username: string;

  @Prop({
    type: MongooseSchema.Types.String,
    default: null,
    set: (value: string) => value.toLowerCase().trim(),
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
    trim: true,
  })
  email: string;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
  })
  last_login: Date;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  failed_login_attempts: number;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
  })
  locked_until: Date;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  credit: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: -1,
  })
  last_seen_at: number;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
  })
  birthday_at: Date;

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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('updateOne', async function (next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

UserSchema.pre<User>('save', async function (next) {
  const mod = <Model<User>>this.constructor;
  this.referral_code = String((await mod.countDocuments({})) + 1000);
  this.tag = AppCryptography.generateUUID();
  this.salt = AppCryptography.createSalt(32);
  if (this.email) {
    this.email = this.email.toLocaleLowerCase().trim();
  }
  this.password = AppCryptography.createHmac(
    AppCryptography.DIGEST_SHA256,
    this.salt,
    this.password ? this.password : AppCryptography.generateNanoID(10),
  );
  next();
});
