import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private readonly model: Model<Subject>,
  ) {}
}
