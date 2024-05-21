import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { DeviceService } from "../device/device.service";
import { TokenService } from "../token/token.service";
import { JwtService } from "@nestjs/jwt";
import AppCryptography from "../utilities/app.cryptography";
import { RoomService } from "../room/room.service";
import { MemberService } from "../member/member.service";
import { AppGatewayEventsEnum } from "../utilities/enum/app.gateway.events.enum";
import { AppGatewayMsgEnum } from "../utilities/enum/app.gateway.msg.enum";
import { GatewayService } from "./gateway.service";

@WebSocketGateway(7777, { cors: { origin: "*" } })
export class GatewayServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger("GatewayServer");
  @WebSocketServer() private server: Server;

  constructor(
    private readonly deviceService: DeviceService,
    private readonly jwtService: JwtService,
    private readonly memberService: MemberService,
    private readonly tokenService: TokenService,
    private readonly roomService: RoomService,
    private gatewayService: GatewayService
  ) {
  }

  afterInit(server: any) {
    this.logger.log("Initialize ChatGateway!");
    this.gatewayService.server = server;
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${socket.id}`);
    let jwtParsed = await this.authUserHandshake(socket);
    const token = await this.tokenService.findByIdentifier(
      jwtParsed.jti,
      "status tag locked_until device"
    );
    if (!token) {
      socket.disconnect();
      return new WsException("Invalid credentials. T");
    }
    if (token.tag !== jwtParsed.t) {
      socket.disconnect();
      return new WsException("Invalid credentials. Tg");
    }

    let device = await this.deviceService.updateSocketId(
      token.device,
      socket.id,
      "tag socket_id"
    );

  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
    let jwtParsed = await this.authUserHandshake(socket);
    await this.deviceService.updateSocketIdByTag(
      jwtParsed.sub,
      "",
      "tag socket_id"
    );
  }

  @SubscribeMessage("room_msg")
  async handleChatMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { room: string, message: string }
  ) {
    let jwtParsed = await this.authUserHandshake(socket);
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    let room = await this.roomService.findByTag(payload.room, "room_key");
    if (!room) return;
    this.gatewayService.sendToRoomForAllUser(payload.room, AppGatewayEventsEnum.NEW_MESSAGE, {
      tag: AppCryptography.generateUUID().toString(),
      type: AppGatewayMsgEnum.USER,
      sender: device,
      room: payload.room,
      message: payload.message,
      created_at: Date.now()
    });

  }

  @SubscribeMessage("join")
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { sender: object, room: string, message: string, public_key: string }
  ) {
    let jwtParsed = await this.authUserHandshake(socket);
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    this.logger.log(`client ${device.user_name} wants to join ${payload.room} 😍`);
    socket.join(payload.room);
    let packet = {
      tag: AppCryptography.generateUUID().toString(),
      type: AppGatewayMsgEnum.SYSTEM,
      sender: device,
      message: `${device.user_name} has joined😍`,
      room: payload.room,
      created_at: Date.now()
    };
    let member = await this.memberService.create({
      room: packet.room,
      device: device._id
    });
    let packetJson = JSON.parse(JSON.stringify(packet));
    packetJson.sender["color"] = member.color;
    this.gatewayService.sendToRoomForAllUser(payload.room, AppGatewayEventsEnum.JOINED, packetJson);
  }

  @SubscribeMessage("pause")
  async handleChangePause(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { sender: object, room: string, message: string, public_key: string }
  ) {
    let jwtParsed = await this.authUserHandshake(socket);
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    this.logger.log(`client ${device.user_name} ${payload.message} 😍`);
    let room = await this.roomService.findByTag(payload.room, "room_key");
    if (!room) return;
    this.gatewayService.sendToRoomForAllUser(payload.room, AppGatewayEventsEnum.NEW_MESSAGE, {
      tag: AppCryptography.generateUUID().toString(),
      type: AppGatewayMsgEnum.SYSTEM,
      sender: device,
      room: payload.room,
      message: payload.message == "pause" ? `${device.user_name} hit pause! 🍿`: `${device.user_name} resumed the movie. 🎬`,
      created_at: Date.now()
    });

  }

  @SubscribeMessage("player_error")
  handlePlayerError(client: Socket, room: string) {
  }

  @SubscribeMessage("player_loading")
  handleLoading(client: Socket, room: string) {
  }

  @SubscribeMessage("player_playing")
  handlePlaying(client: Socket, room: string) {
  }

  @SubscribeMessage("player_state_changed")
  handlePlayerStateChanged(client: Socket, room: string) {
  }

  @SubscribeMessage("player_position_changed")
  handlePlayerPositionChanged(client: Socket, room: string) {
  }

  @SubscribeMessage("reaction")
  handleReaction(client: Socket, room: string) {
  }

  @SubscribeMessage("leave")
  async handleLeftRoom(socket: Socket, payload: { room: string }) {
    let jwtParsed = await this.authUserHandshake(socket);
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    socket.leave(payload.room);
    this.gatewayService.sendToRoomExceptUser(socket, payload.room, AppGatewayEventsEnum.LEFT, {
      tag: AppCryptography.generateUUID().toString(),
      type: AppGatewayMsgEnum.SYSTEM,
      sender: device,
      message: `${device.user_name} has left the room 👋.`,
      room: payload.room,
      created_at: Date.now()
    });
    await this.memberService.deleteFromRoom({
      room: payload.room,
      device: device._id
    });
    this.logger.log(`client ${device.user_name} leave the room ${payload.room} 👋`);
  }

  async authUserHandshake(socket: Socket): Promise<JwtParseInterface> {
    let tokenQuery = socket.handshake.query.token || socket.handshake.headers.query;
    try {
      return await this.jwtService.verifyAsync(String(tokenQuery.toString().replace("token=", "")));
    } catch (e) {
      throw new WsException("Invalid credentials. T");
    }
  }


}