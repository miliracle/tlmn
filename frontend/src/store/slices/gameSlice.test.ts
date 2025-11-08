import { describe, it, expect } from 'vitest';
import { gameSlice } from './gameSlice';

describe('gameSlice', () => {
  const initialState = gameSlice.getInitialState();

  describe('Context management', () => {
    it('should set current table', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setCurrentTable('table-123')
      );
      expect(state.currentTableId).toBe('table-123');
    });

    it('should reset game state when table is cleared', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setCurrentTable('table-123')
      );
      state = gameSlice.reducer(state, gameSlice.actions.setCurrentGame('game-456'));
      state = gameSlice.reducer(state, gameSlice.actions.setIsMyTurn(true));
      state = gameSlice.reducer(state, gameSlice.actions.setCurrentTable(null));
      
      expect(state.currentTableId).toBeNull();
      expect(state.currentGameId).toBeNull();
      expect(state.isMyTurn).toBe(false);
      expect(state.selectedCards).toEqual([]);
    });

    it('should set current game', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setCurrentGame('game-123')
      );
      expect(state.currentGameId).toBe('game-123');
    });
  });

  describe('WebSocket connection', () => {
    it('should set connected state', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setConnected(true)
      );
      expect(state.isConnected).toBe(true);
      expect(state.connectionError).toBeNull();
    });

    it('should clear error when connected', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setConnectionError('Error')
      );
      state = gameSlice.reducer(state, gameSlice.actions.setConnected(true));
      
      expect(state.isConnected).toBe(true);
      expect(state.connectionError).toBeNull();
    });

    it('should set connection error', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setConnectionError('Connection failed')
      );
      expect(state.connectionError).toBe('Connection failed');
      expect(state.isConnected).toBe(false);
    });
  });

  describe('Game UI state', () => {
    it('should set selected cards', () => {
      const cards = ['card-1', 'card-2', 'card-3'];
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setSelectedCards(cards)
      );
      expect(state.selectedCards).toEqual(cards);
    });

    it('should toggle card selection', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.toggleCardSelection('card-1')
      );
      expect(state.selectedCards).toContain('card-1');
      
      state = gameSlice.reducer(state, gameSlice.actions.toggleCardSelection('card-1'));
      expect(state.selectedCards).not.toContain('card-1');
    });

    it('should clear selected cards', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setSelectedCards(['card-1', 'card-2'])
      );
      state = gameSlice.reducer(state, gameSlice.actions.clearSelectedCards());
      
      expect(state.selectedCards).toEqual([]);
    });

    it('should set sorting hand state', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setIsSortingHand(true)
      );
      expect(state.isSortingHand).toBe(true);
    });

    it('should set show suggestions', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setShowSuggestions(true)
      );
      expect(state.showSuggestions).toBe(true);
    });
  });

  describe('Turn UI state', () => {
    it('should set turn timer', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setTurnTimer(30)
      );
      expect(state.turnTimer).toBe(30);
    });

    it('should set is my turn', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setIsMyTurn(true)
      );
      expect(state.isMyTurn).toBe(true);
    });

    it('should set can play', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setCanPlay(true)
      );
      expect(state.canPlay).toBe(true);
    });

    it('should set can pass', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setCanPass(true)
      );
      expect(state.canPass).toBe(true);
    });

    it('should set turn state with partial update', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setTurnState({
          isMyTurn: true,
          canPlay: true,
          turnTimer: 30,
        })
      );
      
      expect(state.isMyTurn).toBe(true);
      expect(state.canPlay).toBe(true);
      expect(state.turnTimer).toBe(30);
      expect(state.canPass).toBe(false); // Unchanged
    });
  });

  describe('Game board UI', () => {
    it('should set animation', () => {
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setAnimation({ key: 'card-play', active: true })
      );
      expect(state.animations['card-play']).toBe(true);
    });

    it('should clear animation', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setAnimation({ key: 'card-play', active: true })
      );
      state = gameSlice.reducer(state, gameSlice.actions.clearAnimation('card-play'));
      
      expect(state.animations['card-play']).toBeUndefined();
    });

    it('should clear all animations', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setAnimation({ key: 'anim1', active: true })
      );
      state = gameSlice.reducer(
        state,
        gameSlice.actions.setAnimation({ key: 'anim2', active: true })
      );
      state = gameSlice.reducer(state, gameSlice.actions.clearAllAnimations());
      
      expect(state.animations).toEqual({});
    });

    it('should set optimistic update', () => {
      const update = { cards: ['card-1'], player: 'player-1' };
      const state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setOptimisticUpdate({ key: 'play', data: update })
      );
      expect(state.optimisticUpdates['play']).toEqual(update);
    });

    it('should clear optimistic update', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setOptimisticUpdate({ key: 'play', data: {} })
      );
      state = gameSlice.reducer(state, gameSlice.actions.clearOptimisticUpdate('play'));
      
      expect(state.optimisticUpdates['play']).toBeUndefined();
    });

    it('should clear all optimistic updates', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setOptimisticUpdate({ key: 'update1', data: {} })
      );
      state = gameSlice.reducer(
        state,
        gameSlice.actions.setOptimisticUpdate({ key: 'update2', data: {} })
      );
      state = gameSlice.reducer(state, gameSlice.actions.clearAllOptimisticUpdates());
      
      expect(state.optimisticUpdates).toEqual({});
    });
  });

  describe('Reset game state', () => {
    it('should reset all game UI state', () => {
      let state = gameSlice.reducer(
        initialState,
        gameSlice.actions.setSelectedCards(['card-1'])
      );
      state = gameSlice.reducer(state, gameSlice.actions.setIsSortingHand(true));
      state = gameSlice.reducer(state, gameSlice.actions.setIsMyTurn(true));
      state = gameSlice.reducer(state, gameSlice.actions.setCanPlay(true));
      state = gameSlice.reducer(state, gameSlice.actions.setTurnTimer(30));
      state = gameSlice.reducer(state, gameSlice.actions.resetGameState());
      
      expect(state.selectedCards).toEqual([]);
      expect(state.isSortingHand).toBe(false);
      expect(state.showSuggestions).toBe(false);
      expect(state.turnTimer).toBeNull();
      expect(state.isMyTurn).toBe(false);
      expect(state.canPlay).toBe(false);
      expect(state.canPass).toBe(false);
      expect(state.animations).toEqual({});
      expect(state.optimisticUpdates).toEqual({});
    });
  });
});

