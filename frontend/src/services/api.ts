import type {
  User,
  AuthResponse,
  Bot,
  Game,
  TableJoinResponse,
  TableLeaveResponse,
  BotTestResponse,
  CreateTableData,
  CreateBotData,
  UpdateBotData,
  BotTestData,
} from '../types/api';
import type { Table, PaginatedResponse } from '../types/table';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  token?: string | null;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return {} as T;
}

export const api = {
  // Auth endpoints
  auth: {
    register: (data: { email: string; username: string; password: string }) =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { username: string; password: string }) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: (token: string) =>
      request<User>('/auth/me', {
        method: 'GET',
        token,
      }),
    logout: (token: string) =>
      request<{ message: string }>('/auth/logout', {
        method: 'POST',
        token,
      }),
  },

  // User endpoints
  users: {
    getProfile: (token: string) =>
      request<{ message: string }>('/users/profile', {
        method: 'GET',
        token,
      }),
  },

  // Table endpoints
  tables: {
    getAll: (
      token: string,
      params?: {
        page?: number;
        limit?: number;
        offset?: number;
        status?: string;
        playerCount?: number;
        minPlayers?: number;
        maxPlayers?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
      }
    ) => {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params?.offset !== undefined) queryParams.append('offset', params.offset.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.playerCount !== undefined)
        queryParams.append('playerCount', params.playerCount.toString());
      if (params?.minPlayers !== undefined)
        queryParams.append('minPlayers', params.minPlayers.toString());
      if (params?.maxPlayers !== undefined)
        queryParams.append('maxPlayers', params.maxPlayers.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const queryString = queryParams.toString();
      const url = queryString ? `/tables?${queryString}` : '/tables';

      return request<PaginatedResponse<Table>>(url, {
        method: 'GET',
        token,
      });
    },
    getOne: (id: string | number, token: string) =>
      request<Table>(`/tables/${id}`, {
        method: 'GET',
        token,
      }),
    create: (data: CreateTableData, token: string) =>
      request<Table>('/tables', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    join: (id: string | number, token: string) =>
      request<TableJoinResponse>(`/tables/${id}/join`, {
        method: 'POST',
        token,
      }),
    leave: (id: string | number, token: string) =>
      request<TableLeaveResponse>(`/tables/${id}/leave`, {
        method: 'DELETE',
        token,
      }),
  },

  // Game endpoints
  games: {
    getAll: (token: string) =>
      request<Game[]>('/games', {
        method: 'GET',
        token,
      }),
    getOne: (id: string | number, token: string) =>
      request<Game>(`/games/${id}`, {
        method: 'GET',
        token,
      }),
  },

  // Session endpoints
  sessions: {
    getOne: (id: string | number, token: string) =>
      request<Table>(`/sessions/${id}`, {
        method: 'GET',
        token,
      }),
  },

  // Bot endpoints
  bots: {
    getAll: (token: string) =>
      request<Omit<Bot, 'code'>[]>('/bots', {
        method: 'GET',
        token,
      }),
    getOne: (id: string | number, token: string) =>
      request<Bot>(`/bots/${id}`, {
        method: 'GET',
        token,
      }),
    create: (data: CreateBotData, token: string) =>
      request<Bot>('/bots', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    update: (id: string | number, data: UpdateBotData, token: string) =>
      request<Bot>(`/bots/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    delete: (id: string | number, token: string) =>
      request<Bot>(`/bots/${id}`, {
        method: 'DELETE',
        token,
      }),
    test: (id: string | number, data: BotTestData, token: string) =>
      request<BotTestResponse>(`/bots/${id}/test`, {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
  },
};
