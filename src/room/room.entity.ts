import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import AppCryptography from '../utilities/app.cryptography';
import { RoomStatusEnum } from './enum/room.status.enum';
import { Device } from '../device/device.entity';

@Schema()
export class Room extends Document {
  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    unique: true,
    index: true,
    default: () => AppCryptography.generateNanoID(5),
  })
  tag: string;

  @Prop({
    trim: true,
    default: RoomStatusEnum.ACTIVE,
    enum: RoomStatusEnum,
  })
  status: RoomStatusEnum;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Device.name,
    default: null,
    required: true,
  })
  owner: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
  })
  stream_link: string;

  @Prop({
    type: MongooseSchema.Types.String,
    trim: true,
    default: null,
  })
  room_key: string;

  @Prop({
    type:  MongooseSchema.Types.Array,
    trim: true,
    default: null,
  })
  members:  string[];

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now(),
  })
  updated_at: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    default: Date.now(),
  })
  created_at: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.pre<Room>('updateOne', async function (next) {
  // this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

RoomSchema.pre<Room>('save', async function (next) {
  this.room_key = AppCryptography.generateRandomByte(32);
  next();
});
