import {
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
import { DeviceService } from "./device/device.service";
import { TokenService } from "./token/token.service";
import { JwtService } from "@nestjs/jwt";
import AppCryptography from "./utilities/app.cryptography";

@WebSocketGateway(7777, { cors: { origin: "*" } })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger("AppGateway");
  @WebSocketServer() private server: Server;

  constructor(
    private deviceService: DeviceService,
    private readonly jwtService: JwtService,
    private tokenService: TokenService
  ) {
  }

  afterInit(server: any) {
    this.logger.log("Initialize ChatGateway!");
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const jwtParsed: JwtParseInterface = await this.jwtService.verifyAsync(String(client.handshake.query.token));
    const token = await this.tokenService.findByIdentifier(
      jwtParsed.jti,
      "status tag locked_until device"
    );
    if (!token) {
      client.disconnect()
      throw new WsException("Invalid credentials. T");
    }
    if (token.tag !== jwtParsed.t) {
      client.disconnect()
      throw new WsException("Invalid credentials. Tg");
    }

    let device = await this.deviceService.updateSocketId(
      token.device,
      client.id,
      "tag socket_id"
    );

  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const jwtParsed: JwtParseInterface = await this.jwtService.verifyAsync(String(client.handshake.query.token));
    await this.deviceService.updateSocketIdByTag(
      jwtParsed.sub,
      "",
      "tag socket_id"
    );
  }

  @SubscribeMessage("room_msg")
  async handleChatMessage(client: Socket, payload: { sender: object, room: string, message: string }) {
    const jwtParsed: JwtParseInterface = await this.jwtService.verifyAsync(String(client.handshake.query.token));
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    let packet = {
      tag:AppCryptography.generateUUID().toString(),
      type: "user",
      sender: device,
      room: payload.room,
      message: payload.message,
      created_at: Date.now()
    };
    this.server.to(payload.room).emit("new_message", packet);
  }

  @SubscribeMessage("join")
  async handleJoinRoom(client: Socket, payload: { sender: string, room: string }) {
    const jwtParsed: JwtParseInterface = await this.jwtService.verifyAsync(String(client.handshake.query.token));
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    this.logger.log(`client ${device.user_name} wants to join ${payload.room}`);
    client.join(payload.room);
    let packet = {
      tag:AppCryptography.generateUUID().toString(),
      type: "system",
      sender: device,
      message:`${device.user_name} has join the room`,
      room: payload.room,
      created_at: Date.now()
    };
    this.server.to(payload.room).emit("joined", packet);
  }

  @SubscribeMessage("link")
  handleChangeLink(client: Socket, room: string) {
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
  async handleLeftRoom(client: Socket, payload: { room: string }) {
    const jwtParsed: JwtParseInterface = await this.jwtService.verifyAsync(String(client.handshake.query.token));
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    client.leave(payload.room);
    let packet = {
      tag:AppCryptography.generateUUID().toString(),
      type: "system",
      sender: device,
      message:`${device.user_name} has left the room`,
      room: payload.room,
      created_at: Date.now()
    };
    client.emit("left", packet);
  }

}