import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from '../token/token.entity';
import { Model } from 'mongoose';
import { Room } from './room.entity';
import { DeviceGenerateDto } from '../device/dto/device.generate.dto';
import { Device } from '../device/device.entity';
import { RoomCreateDto } from './dto/room.create.dto';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private readonly model: Model<Room>) {}


  async create(payload: RoomCreateDto): Promise<Room> {
    return await new this.model(payload).save();
  }

  async findByTag(tag:string , projection:string = "") {
    return this.model.findOne({tag}).select(projection)
  }
}
