export interface Table {
  id: number;
  config?: {
    playerCount?: number;
    gameCount?: number;
    [key: string]: unknown;
  };
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
  startedAt?: string | null;
  endedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  games?: unknown[];
  [key: string]: unknown;
}

export interface TableFilters {
  status?: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
  playerCount?: number;
  minPlayers?: number;
  maxPlayers?: number;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface TableListParams extends PaginationParams {
  filters?: TableFilters;
  sortBy?: 'createdAt' | 'updatedAt' | 'startedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface InfiniteQueryResponse<T> {
  data: T[];
  nextPage: number | null;
  hasMore: boolean;
}

