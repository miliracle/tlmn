import { describe, it, expect } from 'vitest';
import { queryKeys } from './queryKeys';

describe('queryKeys', () => {
  describe('users', () => {
    it('should generate user query keys', () => {
      expect(queryKeys.users.all).toEqual(['users']);
      expect(queryKeys.users.detail(1)).toEqual(['users', 1]);
      expect(queryKeys.users.detail('user-123')).toEqual(['users', 'user-123']);
      expect(queryKeys.users.me()).toEqual(['users', 'me']);
      expect(queryKeys.users.stats(1)).toEqual(['users', 1, 'stats']);
      expect(queryKeys.users.games(1)).toEqual(['users', 1, 'games']);
    });
  });

  describe('tables', () => {
    it('should generate table query keys', () => {
      expect(queryKeys.tables.all).toEqual(['tables']);
      expect(queryKeys.tables.detail(1)).toEqual(['tables', 1]);
      expect(queryKeys.tables.detail('table-123')).toEqual(['tables', 'table-123']);
      expect(queryKeys.tables.players(1)).toEqual(['tables', 1, 'players']);
    });
  });

  describe('games', () => {
    it('should generate game query keys', () => {
      expect(queryKeys.games.all).toEqual(['games']);
      expect(queryKeys.games.detail(1)).toEqual(['games', 1]);
      expect(queryKeys.games.history(1)).toEqual(['games', 1, 'history']);
    });
  });

  describe('bots', () => {
    it('should generate bot query keys', () => {
      expect(queryKeys.bots.all).toEqual(['bots']);
      expect(queryKeys.bots.detail(1)).toEqual(['bots', 1]);
      expect(queryKeys.bots.myBots()).toEqual(['bots', 'my']);
    });
  });

  describe('sessions', () => {
    it('should generate session query keys', () => {
      expect(queryKeys.sessions.all).toEqual(['sessions']);
      expect(queryKeys.sessions.detail(1)).toEqual(['sessions', 1]);
      expect(queryKeys.sessions.summary(1)).toEqual(['sessions', 1, 'summary']);
    });
  });
});

