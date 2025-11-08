import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CLIENT_EVENTS, SERVER_EVENTS } from 'shared';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class AppWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(CLIENT_EVENTS.CREATE_TABLE)
  handleCreateTable(client: Socket, payload: unknown) {
    // Handle table creation
    this.server.emit(SERVER_EVENTS.TABLE_CREATED, payload);
  }

  @SubscribeMessage(CLIENT_EVENTS.JOIN_TABLE)
  handleJoinTable(client: Socket, payload: { tableId: string | number }) {
    client.join(`table:${payload.tableId}`);
    this.server.to(`table:${payload.tableId}`).emit(SERVER_EVENTS.PLAYER_JOINED, payload);
  }

  @SubscribeMessage(CLIENT_EVENTS.PLAY_CARDS)
  handlePlayCards(client: Socket, payload: unknown) {
    // Handle card play
    this.server.emit(SERVER_EVENTS.GAME_STATE_UPDATE, payload);
  }

  @SubscribeMessage(CLIENT_EVENTS.PASS_TURN)
  handlePassTurn(client: Socket, payload: unknown) {
    // Handle pass turn
    this.server.emit(SERVER_EVENTS.GAME_STATE_UPDATE, payload);
  }
}
