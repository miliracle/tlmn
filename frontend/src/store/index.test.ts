import { describe, it, expect } from 'vitest';
import { store } from './index';
import { toggleSidebar } from './slices/uiSlice';
import type { RootState } from './index';

describe('store', () => {
  it('should have correct initial state structure', () => {
    const state = store.getState();

    expect(state).toHaveProperty('ui');
    expect(state).toHaveProperty('game');
    expect(state).toHaveProperty('auth');
  });

  it('should have ui slice with correct initial state', () => {
    const state: RootState = store.getState();

    expect(state.ui.sidebarOpen).toBe(false);
    expect(state.ui.theme).toBe('dark');
    expect(state.ui.notifications).toEqual([]);
    expect(state.ui.currentModal).toBeNull();
  });

  it('should have game slice with correct initial state', () => {
    const state: RootState = store.getState();

    expect(state.game.currentTableId).toBeNull();
    expect(state.game.currentGameId).toBeNull();
    expect(state.game.isConnected).toBe(false);
    expect(state.game.selectedCards).toEqual([]);
  });

  it('should have auth slice with correct initial state', () => {
    const state: RootState = store.getState();

    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.token).toBeNull();
    expect(state.auth.loginForm).toEqual({});
    expect(state.auth.registerForm).toEqual({});
  });

  it('should dispatch actions correctly', () => {
    const initialState = store.getState();

    store.dispatch(toggleSidebar());
    const afterToggle = store.getState();

    expect(afterToggle.ui.sidebarOpen).toBe(!initialState.ui.sidebarOpen);
  });
});
