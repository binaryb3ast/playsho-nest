import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.entity';
import { UserCreateDto } from './dto/user.create.dto';
import { Device } from '../device/device.entity';
import { UserStatusEnum } from './enum/user.status.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async create(dto: UserCreateDto): Promise<User> {
    return await new this.model(dto).save();
  }

  async isPhoneNumberExist(phone_number: string): Promise<boolean> {
    const exist = await this.model.findOne({ phone_number: phone_number });
    return !!exist;
  }

  async findByPhoneNumber(
    phone_number: string,
    projection = '',
  ): Promise<User> {
    return this.model.findOne({ phone_number }).select(projection);
  }

  async findOneByTag(tag: string, projection = ''): Promise<User> {
    return this.model.findOne({ tag }).select(projection);
  }

  async findById(id: any, projection = ''): Promise<User> {
    return this.model.findById(id).select(projection);
  }

  async updateNameById(
    id: any,
    first_name: string,
    last_name: string,
    projection = '',
  ): Promise<User> {
    return this.model
      .findByIdAndUpdate(id, { first_name, last_name }, { new: true })
      .select(projection);
  }

  async updateStatusById(
    id: any,
    status: UserStatusEnum,
    projection = '',
  ): Promise<User> {
    return this.model
      .findByIdAndUpdate(id, { status }, { new: true })
      .select(projection);
  }
}
