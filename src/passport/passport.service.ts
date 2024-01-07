import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Passport } from './passport.entity';
import { PassportCreateDto } from './dto/passport.create.dto';

@Injectable()
export class PassportService {
  constructor(
    @InjectModel(Passport.name) private readonly model: Model<Passport>,
  ) {}

  async create(dto: PassportCreateDto): Promise<Passport> {
    return await new this.model(dto).save();
  }

  async findByDeviceAndReceptor(
    device: string,
    receptor: string,
    projection = '',
  ): Promise<Passport> {
    return this.model.findOne({ device, receptor }).select(projection);
  }

  async findOneByTag(
    tag: string,
    projection = '',
  ): Promise<Passport> {
    return this.model.findOne({tag }).select(projection);
  }
}
