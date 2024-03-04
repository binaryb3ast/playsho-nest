import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards, Version } from "@nestjs/common";
import { RoomService } from "./room.service";
import { HttpStatusCode } from "axios";
import { Request } from "express";
import { DeviceGenerateDto } from "../device/dto/device.generate.dto";
import { ResponseResult } from "../network/response.result";
import { Device } from "../device/device.entity";
import AppCryptography from "../utilities/app.cryptography";
import Translate from "../utilities/locale/locale.translation";
import { TokenGuard } from "../token/token.gaurd";
import { ResponseException } from "../network/response.exception";
import { RoomLinkDto } from "./dto/room.link.dto";

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
    let room = await this.roomService.findByTag(tag , "stream_link tag status room_key");
    room.room_key = AppCryptography.encryptWithPublicKey(request["token"].public_key,room.room_key)
    return {
      message: Translate("success_response"),
      result: {
        room: room
      }
    };
  }

  @Version("1")
  @UseGuards(TokenGuard)
  @Get("/:tag/entrance")
  async checkEntrance(
    @Req() request: Request,
    @Param("tag") tag: string
  ): Promise<ResponseResult<any>> {
    let room = await this.roomService.findByTag(tag , "tag status");
    if (!room){
      throw new ResponseException(
        {
          errors: [
            {
              property: 'room',
              message: Translate('room_not_found'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return {
      message: Translate("success_response"),
      result: {
        room: room
      }
    };
  }

  @Version("1")
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(TokenGuard)
  @Post("/:tag/link")
  async addLink(
    @Req() request: Request,
    @Param("tag") tag: string,
    @Body()payload:RoomLinkDto
  ): Promise<ResponseResult<any>> {
    let room = await this.roomService.findByTag(tag , "tag status");
    if (!room){
      throw new ResponseException(
        {
          errors: [
            {
              property: 'room',
              message: Translate('room_not_found'),
            },
          ],
          message: Translate('fail_response'),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      message: Translate("success_response"),
      result: {
        room: room
      }
    };
  }

}
