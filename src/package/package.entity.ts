import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { Subject } from '../subject/subject.entity';
import { MembershipTypeEnum } from '../membership/enum/membership.type.enum';

@Schema()
export class Package extends Document {
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
    default: null,
  })
  title: string;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: MembershipTypeEnum,
    default: MembershipTypeEnum.BASIC,
  })
  required_membership: MembershipTypeEnum;

  @Prop({
    type: MongooseSchema.Types.Array,
    default: [],
    ref: Package.name,
  })
  prerequisites: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Subject.name,
    default: null,
  })
  subject: MongooseSchema.Types.ObjectId;

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

export const PackageSchema = SchemaFactory.createForClass(Package);

PackageSchema.pre<Package>('updateOne', async function (next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

PackageSchema.pre<Package>('save', async function (next) {
  next();
});
