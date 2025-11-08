import { describe, it, expect } from 'vitest';
import { authSlice } from './authSlice';

describe('authSlice', () => {
  const initialState = authSlice.getInitialState();

  describe('Authentication status', () => {
    it('should set authenticated state', () => {
      const state = authSlice.reducer(initialState, authSlice.actions.setAuthenticated(true));
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear token when setting authenticated to false', () => {
      let state = authSlice.reducer(
        initialState,
        authSlice.actions.setToken({ token: 'test-token', expiry: 123456 })
      );
      state = authSlice.reducer(state, authSlice.actions.setAuthenticated(false));

      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.tokenExpiry).toBeNull();
    });

    it('should set token', () => {
      const state = authSlice.reducer(
        initialState,
        authSlice.actions.setToken({ token: 'test-token', expiry: 123456 })
      );

      expect(state.token).toBe('test-token');
      expect(state.tokenExpiry).toBe(123456);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set token without expiry', () => {
      const state = authSlice.reducer(
        initialState,
        authSlice.actions.setToken({ token: 'test-token' })
      );

      expect(state.token).toBe('test-token');
      expect(state.tokenExpiry).toBeNull();
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear token', () => {
      let state = authSlice.reducer(
        initialState,
        authSlice.actions.setToken({ token: 'test-token' })
      );
      state = authSlice.reducer(state, authSlice.actions.clearToken());

      expect(state.token).toBeNull();
      expect(state.tokenExpiry).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Auth form drafts', () => {
    it('should update login form', () => {
      const state = authSlice.reducer(
        initialState,
        authSlice.actions.updateLoginForm({ email: 'test@example.com' })
      );

      expect(state.loginForm.email).toBe('test@example.com');
    });

    it('should merge login form updates', () => {
      let state = authSlice.reducer(
        initialState,
        authSlice.actions.updateLoginForm({ email: 'test@example.com' })
      );
      state = authSlice.reducer(
        state,
        authSlice.actions.updateLoginForm({ password: 'password123' })
      );

      expect(state.loginForm.email).toBe('test@example.com');
      expect(state.loginForm.password).toBe('password123');
    });

    it('should clear login form', () => {
      let state = authSlice.reducer(
        initialState,
        authSlice.actions.updateLoginForm({ email: 'test@example.com' })
      );
      state = authSlice.reducer(state, authSlice.actions.clearLoginForm());

      expect(state.loginForm).toEqual({});
    });

    it('should update register form', () => {
      const state = authSlice.reducer(
        initialState,
        authSlice.actions.updateRegisterForm({ username: 'testuser' })
      );

      expect(state.registerForm.username).toBe('testuser');
    });

    it('should clear register form', () => {
      let state = authSlice.reducer(
        initialState,
        authSlice.actions.updateRegisterForm({ username: 'testuser' })
      );
      state = authSlice.reducer(state, authSlice.actions.clearRegisterForm());

      expect(state.registerForm).toEqual({});
    });
  });

  describe('Auth flow state', () => {
    it('should set is logging in', () => {
      const state = authSlice.reducer(initialState, authSlice.actions.setIsLoggingIn(true));
      expect(state.isLoggingIn).toBe(true);
    });

    it('should clear auth error when starting login', () => {
      let state = authSlice.reducer(initialState, authSlice.actions.setAuthError('Previous error'));
      state = authSlice.reducer(state, authSlice.actions.setIsLoggingIn(true));

      expect(state.isLoggingIn).toBe(true);
      expect(state.authError).toBeNull();
    });

    it('should set is registering', () => {
      const state = authSlice.reducer(initialState, authSlice.actions.setIsRegistering(true));
      expect(state.isRegistering).toBe(true);
    });

    it('should clear auth error when starting registration', () => {
      let state = authSlice.reducer(initialState, authSlice.actions.setAuthError('Previous error'));
      state = authSlice.reducer(state, authSlice.actions.setIsRegistering(true));

      expect(state.isRegistering).toBe(true);
      expect(state.authError).toBeNull();
    });

    it('should set auth error', () => {
      const state = authSlice.reducer(
        initialState,
        authSlice.actions.setAuthError('Invalid credentials')
      );
      expect(state.authError).toBe('Invalid credentials');
    });
  });

  describe('Logout', () => {
    it('should reset all auth state on logout', () => {
      let state = authSlice.reducer(
        initialState,
        authSlice.actions.setToken({ token: 'test-token' })
      );
      state = authSlice.reducer(
        state,
        authSlice.actions.updateLoginForm({ email: 'test@example.com' })
      );
      state = authSlice.reducer(state, authSlice.actions.setAuthError('Some error'));
      state = authSlice.reducer(state, authSlice.actions.logout());

      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.tokenExpiry).toBeNull();
      expect(state.authError).toBeNull();
      expect(state.loginForm).toEqual({});
      expect(state.registerForm).toEqual({});
    });
  });
});
