import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Major } from './major.entity';

@Injectable()
export class MajorService {
  constructor(@InjectModel(Major.name) private readonly model: Model<Major>) {}
}
