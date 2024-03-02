import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import AppCryptography from "../utilities/app.cryptography";
import { Device } from "../device/device.entity";
import { MemberStatusEnum } from "./enum/member.status.enum";

@Schema()
export class Member extends Document {
  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    unique: true,
    index: true,
    default: () => AppCryptography.generateUUID()
  })
  tag: string;

  @Prop({
    trim: true,
    default: MemberStatusEnum.ONLINE,
    enum: MemberStatusEnum
  })
  status: MemberStatusEnum.ONLINE;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Device.name,
    default: null,
    required: true
  })
  device: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.String,
    default: null,
    required: true
  })
  room: MongooseSchema.Types.String;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null
  })
  color: string;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now()
  })
  updated_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now()
  })
  created_at: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.pre<Member>("updateOne", async function(next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

MemberSchema.pre<Member>("save", async function(next) {
  const colorArray = ["#f46c7d", "#be6cf4", "#6c77f4", "#6cf46e", "#6c77f4", "#6c77f4"];
  const randomIndex = Math.floor(Math.random() * colorArray.length);
  this.color = colorArray[randomIndex];
  next();
});
