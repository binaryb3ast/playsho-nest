import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { MembershipTypeEnum } from '../membership/enum/membership.type.enum';
import { Subject } from '../subject/subject.entity';
import { QuestionTypeEnum } from './enum/question.type.enum';

@Schema()
export class Question extends Document {
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
  content: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: '',
  })
  image_path: string;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 1,
  })
  difficulty_level: number;

  @Prop({
    type: MongooseSchema.Types.Number, // Add a coin bonus field
    default: 1,
  })
  coin_reward: number;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: QuestionTypeEnum,
    default: QuestionTypeEnum.MULTIPLE_CHOICE,
  })
  type: QuestionTypeEnum;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Subject.name,
    default: null,
  })
  subject: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Subject.name,
    default: null,
  })
  answer: MongooseSchema.Types.ObjectId;

  @Prop({ default: null })
  locked_until: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.pre<Subject>('updateOne', async function (next) {
  next();
});

QuestionSchema.pre<Subject>('save', async function (next) {
  next();
});
