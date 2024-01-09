import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';

@Schema()
export class FieldOfStudy extends Document {
  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    unique: true,
    index: true,
    default: () => AppCryptography.generateUUID(),
  })
  tag: string;

  @Prop({
    trim: true,
  })
  name: string;

  @Prop({ default: null })
  locked_until: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const FieldOfStudySchema = SchemaFactory.createForClass(FieldOfStudy);

FieldOfStudySchema.pre<FieldOfStudy>('updateOne', async function (next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

FieldOfStudySchema.pre<FieldOfStudy>('save', async function (next) {
  next();
});
