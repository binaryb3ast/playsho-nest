import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from './device.entity';
import { DeviceGenerateDto } from './dto/device.generate.dto';
import { Token } from "../token/token.entity";

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private readonly model: Model<Device>,
  ) {}

  async generate(dto: DeviceGenerateDto): Promise<Device> {
    return await new this.model(dto).save();
  }

  async isSecretExist(secret: string): Promise<boolean> {
    const existingDevice = await this.model.findOne({ secret: secret });
    return !!existingDevice;
  }

  async findOneByTag(tag: string, projection = ''): Promise<Device> {
    return this.model.findOne({ tag }).select(projection);
  }

  async findById(id: any, projection = ''): Promise<Device> {
    return this.model.findById(id).select(projection);
  }

  async updateSocketId(id: any,socket_id:string, projection = ''): Promise<Device> {
    return this.model.findByIdAndUpdate(id , {socket_id} , {new:true}).select(projection);
  }

  async updateSocketIdByTag(tag: any,socket_id:string, projection = ''): Promise<Device> {
    return this.model.findOneAndUpdate({tag:tag} , {socket_id} , {new:true}).select(projection);
  }

  async findOneBySecret(secret: string, projection = ''): Promise<Device> {
    return this.model.findOne({ secret }).select(projection);
  }
  async updateName(id: any, name: string): Promise<Device> {
    return this.model.findByIdAndUpdate(
      id,
      {
        user_name: name,
      },
      { new: true },
    );
  }
}
