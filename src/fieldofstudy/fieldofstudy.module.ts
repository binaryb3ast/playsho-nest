import { Module } from '@nestjs/common';
import { FieldofstudyService } from './fieldofstudy.service';
import { FieldofstudyController } from './fieldofstudy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldOfStudy, FieldOfStudySchema } from './fieldofstudy.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldOfStudy.name, schema: FieldOfStudySchema },
    ]),
  ],
  controllers: [FieldofstudyController],
  providers: [FieldofstudyService],
  exports: [FieldofstudyService],
})
export class FieldofstudyModule {}
