import {
  initializeVongState,
  markPlayerPlayed,
  hasVong,
  resetVongState,
  hasAnyPlayerPlayed,
  getFirstPlayerIndex,
} from './vongDetection';

describe('Vòng Detection', () => {
  describe('initializeVongState', () => {
    it('should initialize vòng state for 2 players', () => {
      const state = initializeVongState(2, 0);
      expect(state.hasAnyPlayerPlayed).toBe(false);
      expect(state.firstPlayerIndex).toBe(0);
      expect(state.numPlayers).toBe(2);
    });

    it('should initialize vòng state for 3 players', () => {
      const state = initializeVongState(3, 1);
      expect(state.hasAnyPlayerPlayed).toBe(false);
      expect(state.firstPlayerIndex).toBe(1);
      expect(state.numPlayers).toBe(3);
    });

    it('should initialize vòng state for 4 players', () => {
      const state = initializeVongState(4, 2);
      expect(state.hasAnyPlayerPlayed).toBe(false);
      expect(state.firstPlayerIndex).toBe(2);
      expect(state.numPlayers).toBe(4);
    });

    it('should throw error for invalid number of players (< 2)', () => {
      expect(() => initializeVongState(1, 0)).toThrow(
        'Invalid number of players: 1. Must be between 2 and 4.',
      );
    });

    it('should throw error for invalid number of players (> 4)', () => {
      expect(() => initializeVongState(5, 0)).toThrow(
        'Invalid number of players: 5. Must be between 2 and 4.',
      );
    });

    it('should throw error for invalid first player index (negative)', () => {
      expect(() => initializeVongState(4, -1)).toThrow(
        'Invalid first player index: -1. Must be between 0 and 3.',
      );
    });

    it('should throw error for invalid first player index (too high)', () => {
      expect(() => initializeVongState(4, 4)).toThrow(
        'Invalid first player index: 4. Must be between 0 and 3.',
      );
    });
  });

  describe('markPlayerPlayed', () => {
    it('should mark that a player has played', () => {
      let state = initializeVongState(4, 0);
      expect(state.hasAnyPlayerPlayed).toBe(false);

      state = markPlayerPlayed(state, 0);
      expect(state.hasAnyPlayerPlayed).toBe(true);
      expect(state.firstPlayerIndex).toBe(0);
    });

    it('should mark player played for any player index', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 2);
      expect(state.hasAnyPlayerPlayed).toBe(true);
    });

    it('should maintain hasAnyPlayerPlayed as true after multiple plays', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 0);
      expect(state.hasAnyPlayerPlayed).toBe(true);

      state = markPlayerPlayed(state, 1);
      expect(state.hasAnyPlayerPlayed).toBe(true);

      state = markPlayerPlayed(state, 2);
      expect(state.hasAnyPlayerPlayed).toBe(true);
    });

    it('should throw error for invalid player index (negative)', () => {
      const state = initializeVongState(4, 0);
      expect(() => markPlayerPlayed(state, -1)).toThrow(
        'Invalid player index: -1. Must be between 0 and 3.',
      );
    });

    it('should throw error for invalid player index (too high)', () => {
      const state = initializeVongState(4, 0);
      expect(() => markPlayerPlayed(state, 4)).toThrow(
        'Invalid player index: 4. Must be between 0 and 3.',
      );
    });
  });

  describe('hasVong', () => {
    describe('Subtask 2.5.1.3: Handle first player exception (no vòng)', () => {
      it('should return false for first player when no one has played', () => {
        const state = initializeVongState(4, 0);
        expect(hasVong(state, 0)).toBe(false);
      });

      it('should return false for first player even after they play', () => {
        let state = initializeVongState(4, 0);
        state = markPlayerPlayed(state, 0);
        // First player still cannot have vòng
        expect(hasVong(state, 0)).toBe(false);
      });

      it('should return false for first player when other players have played', () => {
        let state = initializeVongState(4, 0);
        state = markPlayerPlayed(state, 1);
        state = markPlayerPlayed(state, 2);
        // First player still cannot have vòng
        expect(hasVong(state, 0)).toBe(false);
      });
    });

    describe('Subtask 2.5.1.2: Create hasVong function', () => {
      it('should return false when no player has played yet', () => {
        const state = initializeVongState(4, 0);
        // No one has played, so no vòng for any player (except first player which is handled separately)
        expect(hasVong(state, 1)).toBe(false);
        expect(hasVong(state, 2)).toBe(false);
        expect(hasVong(state, 3)).toBe(false);
      });

      it('should return true for second player after first player plays', () => {
        let state = initializeVongState(4, 0);
        state = markPlayerPlayed(state, 0);
        // Now vòng exists for subsequent players
        expect(hasVong(state, 1)).toBe(true);
        expect(hasVong(state, 2)).toBe(true);
        expect(hasVong(state, 3)).toBe(true);
      });

      it('should return true for third player after second player plays', () => {
        let state = initializeVongState(4, 0);
        state = markPlayerPlayed(state, 0);
        state = markPlayerPlayed(state, 1);
        // Vòng exists for subsequent players
        expect(hasVong(state, 2)).toBe(true);
        expect(hasVong(state, 3)).toBe(true);
      });

      it('should return true for any player after any player has played', () => {
        let state = initializeVongState(4, 1);
        state = markPlayerPlayed(state, 1);
        // Vòng exists for all other players
        expect(hasVong(state, 0)).toBe(true);
        expect(hasVong(state, 2)).toBe(true);
        expect(hasVong(state, 3)).toBe(true);
        // But not for first player
        expect(hasVong(state, 1)).toBe(false);
      });

      it('should work correctly for 2-player game', () => {
        let state = initializeVongState(2, 0);
        expect(hasVong(state, 0)).toBe(false);
        expect(hasVong(state, 1)).toBe(false);

        state = markPlayerPlayed(state, 0);
        expect(hasVong(state, 0)).toBe(false); // First player
        expect(hasVong(state, 1)).toBe(true); // Second player has vòng
      });

      it('should work correctly for 3-player game', () => {
        let state = initializeVongState(3, 1);
        expect(hasVong(state, 1)).toBe(false); // First player
        expect(hasVong(state, 2)).toBe(false);
        expect(hasVong(state, 0)).toBe(false);

        state = markPlayerPlayed(state, 1);
        expect(hasVong(state, 1)).toBe(false); // First player
        expect(hasVong(state, 2)).toBe(true);
        expect(hasVong(state, 0)).toBe(true);
      });
    });

    it('should throw error for invalid player index (negative)', () => {
      const state = initializeVongState(4, 0);
      expect(() => hasVong(state, -1)).toThrow(
        'Invalid current player index: -1. Must be between 0 and 3.',
      );
    });

    it('should throw error for invalid player index (too high)', () => {
      const state = initializeVongState(4, 0);
      expect(() => hasVong(state, 4)).toThrow(
        'Invalid current player index: 4. Must be between 0 and 3.',
      );
    });
  });

  describe('resetVongState', () => {
    it('should reset vòng state for new round', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 0);
      state = markPlayerPlayed(state, 1);
      expect(state.hasAnyPlayerPlayed).toBe(true);
      expect(state.firstPlayerIndex).toBe(0);

      state = resetVongState(state, 2);
      expect(state.hasAnyPlayerPlayed).toBe(false);
      expect(state.firstPlayerIndex).toBe(2);
      expect(state.numPlayers).toBe(4);
    });

    it('should reset state with different first player', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 0);
      state = resetVongState(state, 3);
      expect(state.hasAnyPlayerPlayed).toBe(false);
      expect(state.firstPlayerIndex).toBe(3);
    });

    it('should throw error for invalid first player index (negative)', () => {
      const state = initializeVongState(4, 0);
      expect(() => resetVongState(state, -1)).toThrow(
        'Invalid first player index: -1. Must be between 0 and 3.',
      );
    });

    it('should throw error for invalid first player index (too high)', () => {
      const state = initializeVongState(4, 0);
      expect(() => resetVongState(state, 4)).toThrow(
        'Invalid first player index: 4. Must be between 0 and 3.',
      );
    });
  });

  describe('hasAnyPlayerPlayed', () => {
    it('should return false initially', () => {
      const state = initializeVongState(4, 0);
      expect(hasAnyPlayerPlayed(state)).toBe(false);
    });

    it('should return true after a player plays', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 0);
      expect(hasAnyPlayerPlayed(state)).toBe(true);
    });

    it('should return true after multiple players play', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 0);
      state = markPlayerPlayed(state, 1);
      expect(hasAnyPlayerPlayed(state)).toBe(true);
    });

    it('should return false after reset', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 0);
      expect(hasAnyPlayerPlayed(state)).toBe(true);

      state = resetVongState(state, 1);
      expect(hasAnyPlayerPlayed(state)).toBe(false);
    });
  });

  describe('getFirstPlayerIndex', () => {
    it('should return first player index', () => {
      const state = initializeVongState(4, 2);
      expect(getFirstPlayerIndex(state)).toBe(2);
    });

    it('should return first player index after reset', () => {
      let state = initializeVongState(4, 0);
      state = resetVongState(state, 3);
      expect(getFirstPlayerIndex(state)).toBe(3);
    });
  });

  describe('Subtask 2.5.1.1: Track if any player has played in current round', () => {
    it('should track that a player has played', () => {
      let state = initializeVongState(4, 0);
      expect(hasAnyPlayerPlayed(state)).toBe(false);

      state = markPlayerPlayed(state, 0);
      expect(hasAnyPlayerPlayed(state)).toBe(true);
    });

    it('should track multiple players playing', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 0);
      state = markPlayerPlayed(state, 1);
      state = markPlayerPlayed(state, 2);
      expect(hasAnyPlayerPlayed(state)).toBe(true);
    });

    it('should reset tracking for new round', () => {
      let state = initializeVongState(4, 0);
      state = markPlayerPlayed(state, 0);
      state = markPlayerPlayed(state, 1);
      expect(hasAnyPlayerPlayed(state)).toBe(true);

      state = resetVongState(state, 2);
      expect(hasAnyPlayerPlayed(state)).toBe(false);
    });
  });
});
