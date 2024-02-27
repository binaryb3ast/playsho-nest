import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards, Version } from "@nestjs/common";
import { RoomService } from "./room.service";
import { HttpStatusCode } from "axios";
import { Request } from "express";
import { DeviceGenerateDto } from "../device/dto/device.generate.dto";
import { ResponseResult } from "../network/response.result";
import { Device } from "../device/device.entity";
import AppCryptography from "../utilities/app.cryptography";
import Translate from "../utilities/locale/locale.translation";
import { TokenGuard } from "../token/token.gaurd";

@Controller("api/room")
export class RoomApiController {
  constructor(private readonly roomService: RoomService) {
  }

  @Version("1")
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(TokenGuard)
  @Post("/")
  async create(
    @Req() request: Request
  ): Promise<ResponseResult<any>> {
    let room = await this.roomService.create({
      owner: request["device"]._id
    });

    return {
      message: Translate("success_response"),
      result: {
        room: room
      }
    };
  }

  @Version("1")
  @UseGuards(TokenGuard)
  @Get("/:tag")
  async getRoom(
    @Req() request: Request,
    @Param("tag") tag: string
  ): Promise<ResponseResult<any>> {
    let room = await this.roomService.findByTag(tag , "stream_link tag status members room_key");
    room.room_key = AppCryptography.encryptWithPublicKey(request["device"].public_key,room.room_key)
    return {
      message: Translate("success_response"),
      result: {
        room: room
      }
    };
  }

}
