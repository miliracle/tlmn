import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should return user when authentication succeeds', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };

      const result = guard.handleRequest(null, mockUser, null);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when token is expired', () => {
      const errorInfo = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
      };

      expect(() => guard.handleRequest(null, null, errorInfo)).toThrow(UnauthorizedException);
      try {
        guard.handleRequest(null, null, errorInfo);
      } catch (error) {
        expect(error.message).toContain('Token has expired');
      }
    });

    it('should throw UnauthorizedException when token is invalid', () => {
      const errorInfo = {
        name: 'JsonWebTokenError',
        message: 'invalid token',
      };

      expect(() => guard.handleRequest(null, null, errorInfo)).toThrow(UnauthorizedException);
      try {
        guard.handleRequest(null, null, errorInfo);
      } catch (error) {
        expect(error.message).toContain('Invalid token');
      }
    });

    it('should throw UnauthorizedException when user is missing', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(UnauthorizedException);
      try {
        guard.handleRequest(null, null, null);
      } catch (error) {
        expect(error.message).toContain('Authentication required');
      }
    });

    it('should throw error when err is provided', () => {
      const error = new Error('Some error');
      expect(() => guard.handleRequest(error, null, null)).toThrow(error);
    });
  });
});
