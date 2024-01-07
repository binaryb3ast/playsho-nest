import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.entity';
import { UserCreateDto } from './dto/user.create.dto';
import { Device } from '../device/device.entity';

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
}
