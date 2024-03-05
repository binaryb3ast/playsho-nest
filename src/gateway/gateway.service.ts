import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { AppGatewayEventsEnum } from "../utilities/enum/app.gateway.events.enum";

@Injectable()
export class GatewayService {
  public server: Server = null;

  private logger: Logger = new Logger("GatewayService");

  sendToRoomExceptUser(socket: Socket, room: string, topic: AppGatewayEventsEnum, packet: any) {
    this.logger.log(`Send Packet To Room ${room} Except User ${socket.id} on event ${topic}`);
    socket.broadcast.to(room).emit(topic, packet);
  }

  sendToRoomForAllUser(room: string, topic: AppGatewayEventsEnum, packet: any) {
    this.logger.log(`Send Packet To Room ${room} for all members on event ${topic}`);
    this.server.to(room).emit(topic, packet);
  }
}