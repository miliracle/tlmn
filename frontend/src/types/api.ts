// API Response Types

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Bot {
  id: number;
  name: string;
  code?: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GamePlayer {
  userId: number;
  position: number;
  finalScore?: number | null;
  user?: {
    id: number;
    username: string;
  };
}

export interface Game {
  id: number;
  tableId: string;
  winnerId?: number | null;
  scores?: unknown;
  totalRounds: number;
  startedAt: string;
  endedAt?: string | null;
  sessionId?: number | null;
  gamePlayers?: GamePlayer[];
}

export interface TableJoinResponse {
  message: string;
  tableId: number;
  gameId?: number;
  position?: number;
  status?: string;
}

export interface TableLeaveResponse {
  message: string;
  tableId: number;
}

export interface BotTestResponse {
  message: string;
  botId: number;
  botName: string;
}

export interface CreateTableData {
  config?: {
    playerCount?: number;
    gameCount?: number;
    [key: string]: unknown;
  };
  playerCount?: number;
  gameCount?: number;
}

export interface CreateBotData {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateBotData {
  name?: string;
  code?: string;
  description?: string;
}

export interface BotTestData {
  [key: string]: unknown;
}

