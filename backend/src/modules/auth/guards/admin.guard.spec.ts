import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminGuard],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access for admin user', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@example.com',
              role: 'admin',
            },
          }),
        }),
      } as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should throw ForbiddenException for non-admin user', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 1,
              username: 'user',
              email: 'user@example.com',
              role: 'user',
            },
          }),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow('Admin access required');
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: null,
          }),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow('Authentication required');
    });

    it('should throw ForbiddenException when user object is missing', () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });
  });
});
