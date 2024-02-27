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
import { DeviceService } from "./device/device.service";
import { TokenService } from "./token/token.service";
import { JwtService } from "@nestjs/jwt";
import AppCryptography from "./utilities/app.cryptography";
import { RoomService } from "./room/room.service";

@WebSocketGateway( { cors: { origin: "*" } })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger("AppGateway");
  @WebSocketServer() private server: Server;

  constructor(
    private readonly deviceService: DeviceService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly roomService: RoomService
  ) {
  }

  afterInit(server: any) {
    this.logger.log("Initialize ChatGateway!");
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    let tokenQuery = client.handshake.query.token || client.handshake.headers.query;
    let jwtParsed: JwtParseInterface;
    try {
      jwtParsed = await this.jwtService.verifyAsync(String(tokenQuery.toString().replace("token=", "")));
    } catch (e) {
      throw new WsException("Invalid credentials. T");
    }
    const token = await this.tokenService.findByIdentifier(
      jwtParsed.jti,
      "status tag locked_until device"
    );
    console.log(token);
    if (!token) {
      client.disconnect();
      throw new WsException("Invalid credentials. T");
    }
    if (token.tag !== jwtParsed.t) {
      client.disconnect();
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
    let tokenQuery = client.handshake.query.token || client.handshake.headers.query;
    let jwtParsed: JwtParseInterface;
    try {
      jwtParsed = await this.jwtService.verifyAsync(String(tokenQuery.toString().replace("token=", "")));
    } catch (e) {
      throw new WsException("Invalid credentials. T");
    }
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
    console.log(payload.message);
    let tokenQuery = socket.handshake.query.token || socket.handshake.headers.query;
    let jwtParsed: JwtParseInterface;
    try {
      jwtParsed = await this.jwtService.verifyAsync(String(tokenQuery.toString().replace("token=", "")));
    } catch (e) {
      throw new WsException("Invalid credentials. T");
    }
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    let room = await this.roomService.findByTag(payload.room , 'room_key');
    let packet = {
      tag: AppCryptography.generateUUID().toString(),
      type: "user",
      sender: device,
      room: payload.room,
      message: payload.message,
      created_at: Date.now()
    };
    this.server.to(payload.room).emit("new_message", packet);
  }

  @SubscribeMessage("trade")
  async handleTrade(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: {
      sender: {
        tag: string,
        public_key: string
      },
      receiver: { tag: string }
    }
  ) {
    let receiverDevice = await this.deviceService.findOneByTag(payload.receiver.tag )
    if (!receiverDevice) return
    socket.to(receiverDevice.socket_id).emit("exchange" , {
      sender: payload.sender
    })
  }

  @SubscribeMessage("join")
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { sender: object, room: string, message: string, public_key: string }
  ) {
    let tokenQuery = socket.handshake.query.token || socket.handshake.headers.query;
    let jwtParsed: JwtParseInterface;
    try {
      jwtParsed = await this.jwtService.verifyAsync(String(tokenQuery.toString().replace("token=", "")));
    } catch (e) {
      throw new WsException("Invalid credentials. T");
    }
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    this.logger.log(`client ${device.user_name} wants to join ${payload.room} 😍`);
    socket.join(payload.room);
    device.public_key = payload.public_key;
    let packet = {
      tag: AppCryptography.generateUUID().toString(),
      type: "system",
      sender: device,
      message: `${device.user_name} has join the room 😍`,
      room: payload.room,
      created_at: Date.now()
    };
    socket.broadcast.to(payload.room).emit("joined", packet);
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
  async handleLeftRoom(socket: Socket, payload: { room: string }) {
    let tokenQuery = socket.handshake.query.token || socket.handshake.headers.query;
    let jwtParsed: JwtParseInterface;
    try {
      jwtParsed = await this.jwtService.verifyAsync(String(tokenQuery.toString().replace("token=", "")));
    } catch (e) {
      throw new WsException("Invalid credentials. T");
    }
    const device = await this.deviceService.findOneByTag(
      jwtParsed.sub,
      "user_name tag"
    );
    socket.leave(payload.room);
    let packet = {
      tag: AppCryptography.generateUUID().toString(),
      type: "system",
      sender: device,
      message: `${device.user_name} has left the room 👋.`,
      room: payload.room,
      created_at: Date.now()
    };
    socket.broadcast.to(payload.room).emit("left", packet);
    this.logger.log(`client ${device.user_name} leave the room ${payload.room} 👋`);

  }

}