import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EntityTypeEnum } from './enum/entity.type.enum';
@Schema({ _id: false })
export class Entity {
  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  offset: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  length: number;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: EntityTypeEnum,
    required: true,
  })
  type: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  value: string;
}
