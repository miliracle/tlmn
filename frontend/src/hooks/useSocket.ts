import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { SERVER_EVENTS } from 'shared';
import { socketService } from '../services/socket';
import { queryKeys } from '../lib/queryKeys';
import type { RootState, AppDispatch } from '../store';

// WebSocket event data types
interface TableUpdatedData {
  tableId?: string | number;
  [key: string]: unknown;
}

interface PlayerEventData {
  tableId?: string | number;
  [key: string]: unknown;
}

interface GameStateUpdateData {
  gameId?: string | number;
  [key: string]: unknown;
}

export function useSocket() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const token = useSelector((state: RootState) => state.auth.token);
  const currentTableId = useSelector((state: RootState) => state.game.currentTableId);
  const isConnected = useSelector((state: RootState) => state.game.isConnected);
  const handlersRef = useRef<Map<string, (...args: unknown[]) => void>>(new Map());

  // Initialize socket connection
  useEffect(() => {
    if (token) {
      socketService.initialize(dispatch, token);
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [token, dispatch]);

  // Join/leave table when currentTableId changes
  useEffect(() => {
    if (isConnected && currentTableId) {
      socketService.joinTable(currentTableId);
    }

    return () => {
      if (currentTableId) {
        socketService.leaveTable(currentTableId);
      }
    };
  }, [isConnected, currentTableId]);

  // Set up WebSocket event handlers
  useEffect(() => {
    // Clean up previous handlers
    const currentHandlers = handlersRef.current;
    currentHandlers.forEach((handler, event) => {
      socketService.off(event, handler);
    });
    currentHandlers.clear();

    // Handler for table_updated event
    const handleTableUpdated = (...args: unknown[]) => {
      const data = args[0] as TableUpdatedData;
      if (data?.tableId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tables.detail(data.tableId) });
        // Invalidate all table list queries regardless of filters
        queryClient.invalidateQueries({ queryKey: ['tables', 'list'] });
      }
    };

    // Handler for player_joined/player_left events
    const handlePlayerJoined = (...args: unknown[]) => {
      const data = args[0] as PlayerEventData;
      if (data?.tableId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tables.players(data.tableId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.tables.detail(data.tableId) });
      }
    };

    // Handler for game_state_update event
    const handleGameStateUpdate = (...args: unknown[]) => {
      const data = args[0] as GameStateUpdateData;
      // Update Redux gameSlice with optimistic update
      // The actual game state will be synced from the server
      if (data?.gameId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.games.detail(data.gameId) });
      }
    };

    // Type for socket event handlers
    type SocketEventHandler = (...args: unknown[]) => void;

    // Register handlers using shared event constants
    socketService.on(SERVER_EVENTS.TABLE_UPDATED, handleTableUpdated);
    socketService.on(SERVER_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socketService.on(SERVER_EVENTS.PLAYER_LEFT, handlePlayerJoined);
    socketService.on(SERVER_EVENTS.GAME_STATE_UPDATE, handleGameStateUpdate);
    socketService.on(SERVER_EVENTS.TABLE_CREATED, handleTableUpdated);

    // Store handlers for cleanup (explicitly typed to match Map signature)
    currentHandlers.set(SERVER_EVENTS.TABLE_UPDATED, handleTableUpdated as SocketEventHandler);
    currentHandlers.set(SERVER_EVENTS.PLAYER_JOINED, handlePlayerJoined as SocketEventHandler);
    currentHandlers.set(SERVER_EVENTS.PLAYER_LEFT, handlePlayerJoined as SocketEventHandler);
    currentHandlers.set(SERVER_EVENTS.GAME_STATE_UPDATE, handleGameStateUpdate as SocketEventHandler);
    currentHandlers.set(SERVER_EVENTS.TABLE_CREATED, handleTableUpdated as SocketEventHandler);

    return () => {
      currentHandlers.forEach((handler, event) => {
        socketService.off(event, handler);
      });
      currentHandlers.clear();
    };
  }, [queryClient]);

  return {
    isConnected,
    socketService,
    playCards: socketService.playCards.bind(socketService),
    passTurn: socketService.passTurn.bind(socketService),
  };
}

