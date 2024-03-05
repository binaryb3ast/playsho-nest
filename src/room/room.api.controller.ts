import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards, Version } from "@nestjs/common";
import { RoomService } from "./room.service";
import { HttpStatusCode } from "axios";
import { Request } from "express";
import { ResponseResult } from "../network/response.result";
import AppCryptography from "../utilities/app.cryptography";
import Translate from "../utilities/locale/locale.translation";
import { TokenGuard } from "../token/token.gaurd";
import { ResponseException } from "../network/response.exception";
import { RoomLinkDto } from "./dto/room.link.dto";
import { GatewayService } from "../gateway/gateway.service";
import { AppGatewayEventsEnum } from "../utilities/enum/app.gateway.events.enum";
import { AppGatewayMsgEnum } from "../utilities/enum/app.gateway.msg.enum";

@Controller("api/room")
export class RoomApiController {
  constructor(
    private readonly roomService: RoomService,
    private readonly gatewayService: GatewayService
  ) {
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
    let room = await this.roomService.findByTag(tag, "stream_link tag status room_key");
    room.room_key = AppCryptography.encryptWithPublicKey(request["token"].public_key, room.room_key);
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
    let room = await this.roomService.findByTag(tag, "tag status");
    if (!room) {
      throw new ResponseException(
        {
          errors: [
            {
              property: "room",
              message: Translate("room_not_found")
            }
          ],
          message: Translate("fail_response")
        },
        HttpStatus.FORBIDDEN
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
    @Body() payload: RoomLinkDto
  ): Promise<ResponseResult<any>> {
    console.log(payload);
    let room = await this.roomService.findByTag(tag, "tag status");
    if (!room) {
      throw new ResponseException(
        {
          errors: [
            {
              property: "room",
              message: Translate("room_not_found")
            }
          ],
          message: Translate("fail_response")
        },
        HttpStatus.FORBIDDEN
      );
    }
    await this.roomService.updateLinkById(room._id, payload.stream_link, "code");
    this.gatewayService.sendToRoomForAllUser(room.tag, AppGatewayEventsEnum.NEW_LINK, {
      tag: AppCryptography.generateUUID().toString(),
      type: AppGatewayMsgEnum.SYSTEM,
      sender: request["device"],
      room: room.tag,
      payload:payload.stream_link,
      message: `${request["device"].user_name} strikes again! Link successfully added. Lights, camera, action! 🌟🎥`,
      created_at: Date.now()
    });
    return {
      message: Translate("stream_link_added"),
      result: {
        room: {
          tag: room.tag,
          stream_link: payload.stream_link
        }
      }
    };
  }

}
