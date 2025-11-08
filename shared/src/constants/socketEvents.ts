/**
 * WebSocket event names shared between frontend and backend
 * This ensures consistency in event naming across the application
 */

// Client → Server events
export const CLIENT_EVENTS = {
  CREATE_TABLE: 'create_table',
  JOIN_TABLE: 'join_table',
  LEAVE_TABLE: 'leave_table',
  PLAY_CARDS: 'play_cards',
  PASS_TURN: 'pass_turn',
} as const;

// Server → Client events
export const SERVER_EVENTS = {
  TABLE_CREATED: 'table_created',
  TABLE_UPDATED: 'table_updated',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  GAME_STATE_UPDATE: 'game_state_update',
  GAME_STARTED: 'game_started',
  GAME_ENDED: 'game_ended',
  TURN_STARTED: 'turn_started',
  TURN_TIMEOUT: 'turn_timeout',
} as const;

// All events (for type safety)
export const SOCKET_EVENTS = {
  ...CLIENT_EVENTS,
  ...SERVER_EVENTS,
} as const;

// Type helpers
export type ClientEvent = typeof CLIENT_EVENTS[keyof typeof CLIENT_EVENTS];
export type ServerEvent = typeof SERVER_EVENTS[keyof typeof SERVER_EVENTS];
export type SocketEvent = ClientEvent | ServerEvent;

