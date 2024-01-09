import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FieldOfStudy } from './fieldofstudy.entity';

@Injectable()
export class FieldofstudyService {
  constructor(
    @InjectModel(FieldOfStudy.name) private readonly model: Model<FieldOfStudy>,
  ) {}
}
