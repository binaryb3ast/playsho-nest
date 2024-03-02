import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "../room/room.entity";
import { Member, MemberSchema } from "./member.entity";

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }])
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports:[MemberService]
})
export class MemberModule {}
