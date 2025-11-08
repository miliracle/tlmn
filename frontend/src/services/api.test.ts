import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from './api';

// Mock fetch globally
global.fetch = vi.fn();

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('auth', () => {
    it('should register user', async () => {
      const mockResponse = { access_token: 'token', user: { id: 1 } };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await api.auth.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
          }),
        })
      );
    });

    it('should login user', async () => {
      const mockResponse = { access_token: 'token', user: { id: 1 } };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await api.auth.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should get current user', async () => {
      const mockResponse = { id: 1, email: 'test@example.com' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await api.auth.me('token');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer token',
          }),
        })
      );
    });

    it('should logout', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Logged out successfully' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await api.auth.logout('token');

      expect(result.message).toBe('Logged out successfully');
    });
  });

  describe('tables', () => {
    it('should get all tables', async () => {
      const mockResponse = [{ id: 1, name: 'Table 1' }];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await api.tables.getAll('token');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tables'),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should get one table', async () => {
      const mockResponse = { id: 1, name: 'Table 1' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await api.tables.getOne(1, 'token');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tables/1'),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should create table', async () => {
      const mockResponse = { id: 1, name: 'New Table' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await api.tables.create({ name: 'New Table' }, 'token');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tables'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should join table', async () => {
      const mockResponse = { id: 1, players: [1, 2] };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await api.tables.join(1, 'token');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tables/1/join'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should leave table', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await api.tables.leave(1, 'token');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tables/1/leave'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('error handling', () => {
    it('should throw error on failed request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Resource not found' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await expect(api.tables.getOne(1, 'token')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(api.tables.getAll('token')).rejects.toThrow('Network error');
    });
  });
});

