import { Module } from '@nestjs/common';
import { MajorService } from './major.service';
import { MajorController } from './major.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Major, MajorSchema } from './major.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Major.name, schema: MajorSchema }]),
  ],
  controllers: [MajorController],
  providers: [MajorService],
  exports: [MajorService],
})
export class MajorModule {}
