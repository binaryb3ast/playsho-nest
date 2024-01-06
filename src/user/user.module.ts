import { Module } from '@nestjs/common';
import { UserApiController } from './user.api.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserApiController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
