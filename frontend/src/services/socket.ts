import { io, Socket } from 'socket.io-client';
import { CLIENT_EVENTS } from 'shared';
import type { AppDispatch } from '../store';
import { setConnected, setConnectionError } from '../store/slices/gameSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private dispatch: AppDispatch | null = null;
  private token: string | null = null;

  initialize(dispatch: AppDispatch, token: string | null) {
    this.dispatch = dispatch;
    this.token = token;

    if (this.socket) {
      this.disconnect();
    }

    if (!token) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.socket || !this.dispatch) return;

    this.socket.on('connect', () => {
      this.dispatch?.(setConnected(true));
      this.dispatch?.(setConnectionError(null));
    });

    this.socket.on('disconnect', () => {
      this.dispatch?.(setConnected(false));
    });

    this.socket.on('connect_error', (error) => {
      this.dispatch?.(setConnectionError(error.message));
      this.dispatch?.(setConnected(false));
    });

    this.socket.on('error', (error) => {
      this.dispatch?.(setConnectionError(error.message || 'Socket error'));
    });
  }

  connect() {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.dispatch) {
      this.dispatch(setConnected(false));
    }
  }

  joinTable(tableId: string | number) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(CLIENT_EVENTS.JOIN_TABLE, { tableId });
    }
  }

  leaveTable(tableId: string | number) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(CLIENT_EVENTS.LEAVE_TABLE, { tableId });
    }
  }

  playCards(data: unknown) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(CLIENT_EVENTS.PLAY_CARDS, data);
    }
  }

  passTurn(data: unknown) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(CLIENT_EVENTS.PASS_TURN, data);
    }
  }

  on(event: string, callback: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
