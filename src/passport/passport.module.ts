import { Module } from '@nestjs/common';
import { PassportService } from './passport.service';
import { PassportController } from './passport.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.entity';
import { Passport, PassportSchema } from './passport.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Passport.name, schema: PassportSchema },
    ]),
  ],
  controllers: [PassportController],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}
