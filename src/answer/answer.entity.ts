import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { User } from '../user/user.entity';

@Schema()
export class Answer extends Document {
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
    type: MongooseSchema.Types.Boolean,
    default: false,
  })
  is_correct: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    default: null,
  })
  author: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: '',
  })
  explanation: string;

  @Prop({
    type: MongooseSchema.Types.Number,
    default: 0,
  })
  selection_count: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Answer.name,
    default: null,
  })
  question: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now,
  })
  updated_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now,
  })
  created_at: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

AnswerSchema.pre<Answer>('updateOne', async function (next) {
  this.set({ updated_at: new Date() });
  next();
});

AnswerSchema.pre<Answer>('save', async function (next) {
  this.updated_at = new Date();
  this.created_at = new Date();
  next();
});
