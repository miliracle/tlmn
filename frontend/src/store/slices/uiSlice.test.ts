import { describe, it, expect } from 'vitest';
import { uiSlice } from './uiSlice';

describe('uiSlice', () => {
  const initialState = uiSlice.getInitialState();

  describe('Navigation', () => {
    it('should toggle sidebar', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.toggleSidebar());
      expect(state.sidebarOpen).toBe(true);

      const newState = uiSlice.reducer(state, uiSlice.actions.toggleSidebar());
      expect(newState.sidebarOpen).toBe(false);
    });

    it('should set sidebar open state', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.setSidebarOpen(true));
      expect(state.sidebarOpen).toBe(true);
    });

    it('should set bottom menu active item', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.setBottomMenuActiveItem('home'));
      expect(state.bottomMenuActiveItem).toBe('home');
    });
  });

  describe('Modal management', () => {
    it('should open modal', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.openModal('settings'));
      expect(state.currentModal).toBe('settings');
      expect(state.modalStack).toEqual([]);
    });

    it('should stack modals', () => {
      let state = uiSlice.reducer(initialState, uiSlice.actions.openModal('first'));
      state = uiSlice.reducer(state, uiSlice.actions.openModal('second'));

      expect(state.currentModal).toBe('second');
      expect(state.modalStack).toEqual(['first']);
    });

    it('should close modal and restore previous', () => {
      let state = uiSlice.reducer(initialState, uiSlice.actions.openModal('first'));
      state = uiSlice.reducer(state, uiSlice.actions.openModal('second'));
      state = uiSlice.reducer(state, uiSlice.actions.closeModal());

      expect(state.currentModal).toBe('first');
      expect(state.modalStack).toEqual([]);
    });

    it('should close all modals', () => {
      let state = uiSlice.reducer(initialState, uiSlice.actions.openModal('first'));
      state = uiSlice.reducer(state, uiSlice.actions.openModal('second'));
      state = uiSlice.reducer(state, uiSlice.actions.closeAllModals());

      expect(state.currentModal).toBeNull();
      expect(state.modalStack).toEqual([]);
    });
  });

  describe('Theme', () => {
    it('should set theme', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.setTheme('light'));
      expect(state.theme).toBe('light');
    });

    it('should toggle theme', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.toggleTheme());
      expect(state.theme).toBe('light');

      const newState = uiSlice.reducer(state, uiSlice.actions.toggleTheme());
      expect(newState.theme).toBe('dark');
    });
  });

  describe('Notifications', () => {
    it('should add notification', () => {
      const state = uiSlice.reducer(
        initialState,
        uiSlice.actions.addNotification({
          message: 'Test notification',
          type: 'info',
        })
      );

      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].message).toBe('Test notification');
      expect(state.notifications[0].type).toBe('info');
      expect(state.notifications[0].id).toBeDefined();
      expect(state.notifications[0].timestamp).toBeDefined();
    });

    it('should remove notification', () => {
      let state = uiSlice.reducer(
        initialState,
        uiSlice.actions.addNotification({
          message: 'Test',
          type: 'info',
        })
      );

      const notificationId = state.notifications[0].id;
      state = uiSlice.reducer(state, uiSlice.actions.removeNotification(notificationId));

      expect(state.notifications).toHaveLength(0);
    });

    it('should clear all notifications', () => {
      let state = uiSlice.reducer(
        initialState,
        uiSlice.actions.addNotification({ message: 'Test 1', type: 'info' })
      );
      state = uiSlice.reducer(
        state,
        uiSlice.actions.addNotification({ message: 'Test 2', type: 'error' })
      );
      state = uiSlice.reducer(state, uiSlice.actions.clearNotifications());

      expect(state.notifications).toHaveLength(0);
    });
  });

  describe('Loading states', () => {
    it('should set page transitioning', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.setPageTransitioning(true));
      expect(state.pageTransitioning).toBe(true);
    });

    it('should set dragging state', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.setIsDragging(true));
      expect(state.isDragging).toBe(true);
    });

    it('should set loading state', () => {
      const state = uiSlice.reducer(
        initialState,
        uiSlice.actions.setLoadingState({ key: 'fetching', loading: true })
      );
      expect(state.loadingStates.fetching).toBe(true);
    });

    it('should remove loading state when set to false', () => {
      let state = uiSlice.reducer(
        initialState,
        uiSlice.actions.setLoadingState({ key: 'fetching', loading: true })
      );
      state = uiSlice.reducer(
        state,
        uiSlice.actions.setLoadingState({ key: 'fetching', loading: false })
      );
      expect(state.loadingStates.fetching).toBeUndefined();
    });
  });

  describe('Form drafts', () => {
    it('should save form draft', () => {
      const draft = { email: 'test@example.com', name: 'Test' };
      const state = uiSlice.reducer(
        initialState,
        uiSlice.actions.saveFormDraft({ formId: 'login', draft })
      );

      expect(state.formDrafts.login).toEqual(draft);
    });

    it('should clear form draft', () => {
      let state = uiSlice.reducer(
        initialState,
        uiSlice.actions.saveFormDraft({ formId: 'login', draft: { email: 'test' } })
      );
      state = uiSlice.reducer(state, uiSlice.actions.clearFormDraft('login'));

      expect(state.formDrafts.login).toBeUndefined();
    });

    it('should clear all form drafts', () => {
      let state = uiSlice.reducer(
        initialState,
        uiSlice.actions.saveFormDraft({ formId: 'login', draft: { email: 'test' } })
      );
      state = uiSlice.reducer(
        state,
        uiSlice.actions.saveFormDraft({ formId: 'register', draft: { name: 'test' } })
      );
      state = uiSlice.reducer(state, uiSlice.actions.clearAllFormDrafts());

      expect(state.formDrafts).toEqual({});
    });
  });

  describe('UI preferences', () => {
    it('should set sound enabled', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.setSoundEnabled(false));
      expect(state.soundEnabled).toBe(false);
    });

    it('should set animations enabled', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.setAnimationsEnabled(false));
      expect(state.animationsEnabled).toBe(false);
    });

    it('should set card display mode', () => {
      const state = uiSlice.reducer(initialState, uiSlice.actions.setCardDisplayMode('compact'));
      expect(state.cardDisplayMode).toBe('compact');
    });
  });
});
