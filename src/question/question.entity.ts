import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { MembershipTypeEnum } from '../membership/enum/membership.type.enum';
import { Subject } from '../subject/subject.entity';
import { QuestionTypeEnum } from './enum/question.type.enum';
import { Answer } from '../answer/answer.entity';
import { User } from '../user/user.entity';
import { Entity } from '../entities/entity.entity';
import { QuestionCreationSourceEnum } from "./enum/question.creationsource.enum";

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
    ref: Answer.name,
    default: null,
  })
  correct_answer: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  up_votes: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  down_votes: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  views: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  attempts: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  correct_attempts: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  user_ratings: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: null, // Null indicates no time limit
  })
  time_limit: number;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: QuestionCreationSourceEnum,
    default: QuestionCreationSourceEnum.ADMIN_AUTHORED, // Default source
  })
  creation_source: QuestionCreationSourceEnum;

  @Prop({
    type: [MongooseSchema.Types.String],
    default: [],
  })
  tags: string[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    default: null,
  })
  author: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [MongooseSchema.Types.Mixed],
    default: [],
  })
  content_entities: Entity[];

  @Prop({ default: null })
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

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.pre<Subject>('updateOne', async function (next) {
  this.set({ updated_at: new Date() });
  next();
});

QuestionSchema.pre<Subject>('save', async function (next) {
  this.updated_at = new Date();
  this.created_at = new Date();
  next();
});
