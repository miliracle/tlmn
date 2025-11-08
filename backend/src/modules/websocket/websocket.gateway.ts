import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  @SubscribeMessage('create_table')
  handleCreateTable(client: Socket, payload: any) {
    // Handle table creation
    this.server.emit('table_created', payload);
  }

  @SubscribeMessage('join_table')
  handleJoinTable(client: Socket, payload: any) {
    client.join(`table:${payload.tableId}`);
    this.server.to(`table:${payload.tableId}`).emit('player_joined', payload);
  }

  @SubscribeMessage('play_cards')
  handlePlayCards(client: Socket, payload: any) {
    // Handle card play
    this.server.emit('game_state_update', payload);
  }

  @SubscribeMessage('pass_turn')
  handlePassTurn(client: Socket, payload: any) {
    // Handle pass turn
    this.server.emit('game_state_update', payload);
  }
}
