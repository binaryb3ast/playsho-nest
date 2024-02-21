import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger('ChatGateway');
  @WebSocketServer() wss: Server;

  afterInit(server: any) {
    this.logger.log('Initialize ChatGateway!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat')
  handleChatMessage(client: Socket, payload: { sender: string, room: string, message: string }) {
    this.logger.log(payload);
    this.wss.to(payload.room).emit('chatToClient', payload);
  }

  @SubscribeMessage('join')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('link')
  handleChangeLink(client: Socket, room: string) {
  }

  @SubscribeMessage('player_error')
  handlePlayerError(client: Socket, room: string) {
  }

  @SubscribeMessage('player_loading')
  handleLoading(client: Socket, room: string) {
  }

  @SubscribeMessage('player_playing')
  handlePlaying(client: Socket, room: string) {
  }
  @SubscribeMessage('player_state_changed')
  handlePlayerStateChanged(client: Socket, room: string) {
  }

  @SubscribeMessage('player_position_changed')
  handlePlayerPositionChanged(client: Socket, room: string) {
  }

  @SubscribeMessage('reaction')
  handleReaction(client: Socket, room: string) {
  }

  @SubscribeMessage('leave')
  handleLeftRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

}