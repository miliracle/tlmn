/**
 * Query keys factory pattern for TanStack Query
 * Provides type-safe query key generation
 */

export const queryKeys = {
  // User queries
  users: {
    all: ['users'] as const,
    detail: (id: string | number) => ['users', id] as const,
    me: () => ['users', 'me'] as const,
    stats: (id: string | number) => ['users', id, 'stats'] as const,
    games: (id: string | number) => ['users', id, 'games'] as const,
  },

  // Table queries
  tables: {
    all: (params?: Record<string, unknown>): readonly unknown[] => {
      if (!params || Object.keys(params).length === 0) {
        return ['tables', 'list'] as const;
      }
      // Create a stable key by sorting keys and stringifying
      const sortedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
          if (params[key] !== undefined && params[key] !== null) {
            acc[key] = params[key];
          }
          return acc;
        }, {} as Record<string, unknown>);
      return ['tables', 'list', sortedParams] as const;
    },
    detail: (id: string | number) => ['tables', id] as const,
    players: (id: string | number) => ['tables', id, 'players'] as const,
  },

  // Game queries
  games: {
    all: ['games'] as const,
    detail: (id: string | number) => ['games', id] as const,
    history: (id: string | number) => ['games', id, 'history'] as const,
  },

  // Bot queries
  bots: {
    all: ['bots'] as const,
    detail: (id: string | number) => ['bots', id] as const,
    myBots: () => ['bots', 'my'] as const,
  },

  // Session queries
  sessions: {
    all: ['sessions'] as const,
    detail: (id: string | number) => ['sessions', id] as const,
    summary: (id: string | number) => ['sessions', id, 'summary'] as const,
  },
};

