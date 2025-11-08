const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  token?: string | null;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
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
      request<{ access_token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      request<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: (token: string) =>
      request<any>('/auth/me', {
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
      request<any>('/users/profile', {
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
      if (params?.playerCount !== undefined) queryParams.append('playerCount', params.playerCount.toString());
      if (params?.minPlayers !== undefined) queryParams.append('minPlayers', params.minPlayers.toString());
      if (params?.maxPlayers !== undefined) queryParams.append('maxPlayers', params.maxPlayers.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const queryString = queryParams.toString();
      const url = queryString ? `/tables?${queryString}` : '/tables';

      return request<any[] | { data: any[]; pagination: any }>(url, {
        method: 'GET',
        token,
      });
    },
    getOne: (id: string | number, token: string) =>
      request<any>(`/tables/${id}`, {
        method: 'GET',
        token,
      }),
    create: (data: any, token: string) =>
      request<any>('/tables', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    join: (id: string | number, token: string) =>
      request<any>(`/tables/${id}/join`, {
        method: 'POST',
        token,
      }),
    leave: (id: string | number, token: string) =>
      request<any>(`/tables/${id}/leave`, {
        method: 'DELETE',
        token,
      }),
  },

  // Game endpoints
  games: {
    getAll: (token: string) =>
      request<any[]>('/games', {
        method: 'GET',
        token,
      }),
    getOne: (id: string | number, token: string) =>
      request<any>(`/games/${id}`, {
        method: 'GET',
        token,
      }),
  },

  // Session endpoints
  sessions: {
    getOne: (id: string | number, token: string) =>
      request<any>(`/sessions/${id}`, {
        method: 'GET',
        token,
      }),
  },

  // Bot endpoints
  bots: {
    getAll: (token: string) =>
      request<any[]>('/bots', {
        method: 'GET',
        token,
      }),
    getOne: (id: string | number, token: string) =>
      request<any>(`/bots/${id}`, {
        method: 'GET',
        token,
      }),
    create: (data: any, token: string) =>
      request<any>('/bots', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    update: (id: string | number, data: any, token: string) =>
      request<any>(`/bots/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    delete: (id: string | number, token: string) =>
      request<any>(`/bots/${id}`, {
        method: 'DELETE',
        token,
      }),
    test: (id: string | number, data: any, token: string) =>
      request<any>(`/bots/${id}/test`, {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
  },
};
