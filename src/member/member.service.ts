import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Room } from "../room/room.entity";
import { Model } from "mongoose";
import { Member } from "./member.entity";
import { RoomCreateDto } from "../room/dto/room.create.dto";
import { MemberCreateDto } from "./dto/member.create.dto";

@Injectable()
export class MemberService {

  constructor(@InjectModel(Member.name) private readonly model: Model<Member>) {
  }

  async create(payload: MemberCreateDto ): Promise<Member> {
    return await new this.model(payload).save();
  }

  async deleteFromRoom(payload: MemberCreateDto ): Promise<void> {
    await this.model.deleteOne(payload)
  }

}
