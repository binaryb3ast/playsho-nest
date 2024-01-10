import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { MembershipTypeEnum } from '../membership/enum/membership.type.enum';
import { Subject } from '../subject/subject.entity';

@Schema()
export class Chapter extends Document {
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
    default: '',
  })
  title: string;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  unlock_cost: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 1,
  })
  importance: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  sort: number;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: MembershipTypeEnum,
    default: MembershipTypeEnum.BASIC,
  })
  membership_type: MembershipTypeEnum;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Subject.name,
    default: null,
  })
  subject: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: null,
  })
  locked_until: Date;

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

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

ChapterSchema.pre<Subject>('updateOne', async function (next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

ChapterSchema.pre<Subject>('save', async function (next) {
  next();
});
