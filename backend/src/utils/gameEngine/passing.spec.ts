import {
  initializePassingState,
  passTurn,
  hasPassed,
  resetPassedPlayers,
  getPassedPlayersCount,
  getPassedPlayers,
  hasAllButOnePassed,
  hasConsecutivePasses,
  type PassingState,
} from './passing';

describe('Passing System', () => {
  describe('initializePassingState', () => {
    it('should initialize passing state for 2 players', () => {
      const state = initializePassingState(2);
      expect(state.passedPlayers).toEqual([]);
      expect(state.numPlayers).toBe(2);
    });

    it('should initialize passing state for 3 players', () => {
      const state = initializePassingState(3);
      expect(state.passedPlayers).toEqual([]);
      expect(state.numPlayers).toBe(3);
    });

    it('should initialize passing state for 4 players', () => {
      const state = initializePassingState(4);
      expect(state.passedPlayers).toEqual([]);
      expect(state.numPlayers).toBe(4);
    });

    it('should throw error for invalid number of players (< 2)', () => {
      expect(() => initializePassingState(1)).toThrow(
        'Invalid number of players: 1. Must be between 2 and 4.',
      );
    });

    it('should throw error for invalid number of players (> 4)', () => {
      expect(() => initializePassingState(5)).toThrow(
        'Invalid number of players: 5. Must be between 2 and 4.',
      );
    });
  });

  describe('passTurn', () => {
    describe('Subtask 2.4.3.1: Implement passTurn function', () => {
      it('should allow player 0 to pass in a 2-player game', () => {
        const state = initializePassingState(2);
        const result = passTurn(state, 0);

        expect(result.success).toBe(true);
        expect(result.passingState.passedPlayers).toEqual([0]);
        expect(result.passingState.numPlayers).toBe(2);
        expect(result.error).toBeUndefined();
      });

      it('should allow player 1 to pass in a 2-player game', () => {
        const state = initializePassingState(2);
        const result = passTurn(state, 1);

        expect(result.success).toBe(true);
        expect(result.passingState.passedPlayers).toEqual([1]);
      });

      it('should allow multiple players to pass in a 4-player game', () => {
        let state = initializePassingState(4);
        let result = passTurn(state, 0);
        expect(result.success).toBe(true);
        state = result.passingState;

        result = passTurn(state, 1);
        expect(result.success).toBe(true);
        state = result.passingState;

        result = passTurn(state, 2);
        expect(result.success).toBe(true);
        state = result.passingState;

        expect(state.passedPlayers).toEqual([0, 1, 2]);
      });

      it('should return error for invalid player index (negative)', () => {
        const state = initializePassingState(4);
        const result = passTurn(state, -1);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid player index');
        expect(result.passingState.passedPlayers).toEqual([]);
      });

      it('should return error for invalid player index (too high)', () => {
        const state = initializePassingState(4);
        const result = passTurn(state, 4);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid player index');
        expect(result.passingState.passedPlayers).toEqual([]);
      });

      it('should return error for invalid number of players', () => {
        const invalidState: PassingState = {
          passedPlayers: [],
          numPlayers: 5,
        };
        const result = passTurn(invalidState, 0);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid number of players');
      });
    });

    describe('Subtask 2.4.3.3: Enforce pass rule (cannot play again in same round)', () => {
      it('should prevent a player from passing twice in the same round', () => {
        let state = initializePassingState(4);
        let result = passTurn(state, 0);
        expect(result.success).toBe(true);
        state = result.passingState;

        // Try to pass again
        result = passTurn(state, 0);
        expect(result.success).toBe(false);
        expect(result.error).toContain('already passed');
        expect(state.passedPlayers).toEqual([0]); // Should not change
      });

      it('should allow different players to pass in the same round', () => {
        let state = initializePassingState(4);
        let result = passTurn(state, 0);
        expect(result.success).toBe(true);
        state = result.passingState;

        result = passTurn(state, 1);
        expect(result.success).toBe(true);
        state = result.passingState;

        result = passTurn(state, 2);
        expect(result.success).toBe(true);
        state = result.passingState;

        expect(state.passedPlayers).toEqual([0, 1, 2]);
      });
    });
  });

  describe('hasPassed', () => {
    describe('Subtask 2.4.3.2: Track passed players per round', () => {
      it('should return false for a player who has not passed', () => {
        const state = initializePassingState(4);
        expect(hasPassed(state, 0)).toBe(false);
        expect(hasPassed(state, 1)).toBe(false);
        expect(hasPassed(state, 2)).toBe(false);
        expect(hasPassed(state, 3)).toBe(false);
      });

      it('should return true for a player who has passed', () => {
        let state = initializePassingState(4);
        const result = passTurn(state, 1);
        state = result.passingState;

        expect(hasPassed(state, 1)).toBe(true);
        expect(hasPassed(state, 0)).toBe(false);
        expect(hasPassed(state, 2)).toBe(false);
        expect(hasPassed(state, 3)).toBe(false);
      });

      it('should correctly track multiple passed players', () => {
        let state = initializePassingState(4);
        let result = passTurn(state, 0);
        state = result.passingState;
        result = passTurn(state, 2);
        state = result.passingState;

        expect(hasPassed(state, 0)).toBe(true);
        expect(hasPassed(state, 2)).toBe(true);
        expect(hasPassed(state, 1)).toBe(false);
        expect(hasPassed(state, 3)).toBe(false);
      });

      it('should throw error for invalid player index', () => {
        const state = initializePassingState(4);
        expect(() => hasPassed(state, -1)).toThrow('Invalid player index');
        expect(() => hasPassed(state, 4)).toThrow('Invalid player index');
      });
    });
  });

  describe('resetPassedPlayers', () => {
    describe('Subtask 2.4.3.4: Reset passed status for new round', () => {
      it('should reset empty passed players list', () => {
        const state = initializePassingState(4);
        const resetState = resetPassedPlayers(state);

        expect(resetState.passedPlayers).toEqual([]);
        expect(resetState.numPlayers).toBe(4);
      });

      it('should reset passed players list with one player', () => {
        let state = initializePassingState(4);
        const result = passTurn(state, 0);
        state = result.passingState;

        const resetState = resetPassedPlayers(state);
        expect(resetState.passedPlayers).toEqual([]);
        expect(resetState.numPlayers).toBe(4);
        expect(hasPassed(resetState, 0)).toBe(false);
      });

      it('should reset passed players list with multiple players', () => {
        let state = initializePassingState(4);
        let result = passTurn(state, 0);
        state = result.passingState;
        result = passTurn(state, 1);
        state = result.passingState;
        result = passTurn(state, 2);
        state = result.passingState;

        expect(state.passedPlayers).toEqual([0, 1, 2]);

        const resetState = resetPassedPlayers(state);
        expect(resetState.passedPlayers).toEqual([]);
        expect(resetState.numPlayers).toBe(4);
        expect(hasPassed(resetState, 0)).toBe(false);
        expect(hasPassed(resetState, 1)).toBe(false);
        expect(hasPassed(resetState, 2)).toBe(false);
      });

      it('should allow players to pass again after reset', () => {
        let state = initializePassingState(4);
        let result = passTurn(state, 0);
        state = result.passingState;

        // Reset for new round
        state = resetPassedPlayers(state);

        // Player 0 should be able to pass again
        result = passTurn(state, 0);
        expect(result.success).toBe(true);
        expect(result.passingState.passedPlayers).toEqual([0]);
      });
    });
  });

  describe('getPassedPlayersCount', () => {
    it('should return 0 when no players have passed', () => {
      const state = initializePassingState(4);
      expect(getPassedPlayersCount(state)).toBe(0);
    });

    it('should return correct count for passed players', () => {
      let state = initializePassingState(4);
      let result = passTurn(state, 0);
      state = result.passingState;
      expect(getPassedPlayersCount(state)).toBe(1);

      result = passTurn(state, 1);
      state = result.passingState;
      expect(getPassedPlayersCount(state)).toBe(2);

      result = passTurn(state, 2);
      state = result.passingState;
      expect(getPassedPlayersCount(state)).toBe(3);
    });
  });

  describe('getPassedPlayers', () => {
    it('should return empty array when no players have passed', () => {
      const state = initializePassingState(4);
      const passed = getPassedPlayers(state);
      expect(passed).toEqual([]);
      // Should be a copy, not the original array
      expect(passed).not.toBe(state.passedPlayers);
    });

    it('should return array of passed player indices', () => {
      let state = initializePassingState(4);
      let result = passTurn(state, 0);
      state = result.passingState;
      result = passTurn(state, 2);
      state = result.passingState;

      const passed = getPassedPlayers(state);
      expect(passed).toEqual([0, 2]);
      // Should be a copy
      expect(passed).not.toBe(state.passedPlayers);
    });
  });

  describe('hasAllButOnePassed', () => {
    it('should return false when no players have passed', () => {
      const state = initializePassingState(4);
      expect(hasAllButOnePassed(state)).toBe(false);
    });

    it('should return false when not all but one have passed (2 players)', () => {
      let state = initializePassingState(2);
      const result = passTurn(state, 0);
      state = result.passingState;

      // In 2-player game, 1 passed means all but one have passed
      expect(hasAllButOnePassed(state)).toBe(true);
    });

    it('should return false when not all but one have passed (4 players)', () => {
      let state = initializePassingState(4);
      let result = passTurn(state, 0);
      state = result.passingState;
      result = passTurn(state, 1);
      state = result.passingState;

      // 2 passed, but need 3 for "all but one"
      expect(hasAllButOnePassed(state)).toBe(false);
    });

    it('should return true when all but one have passed (3 players)', () => {
      let state = initializePassingState(3);
      let result = passTurn(state, 0);
      state = result.passingState;
      result = passTurn(state, 1);
      state = result.passingState;

      // 2 passed out of 3 = all but one
      expect(hasAllButOnePassed(state)).toBe(true);
    });

    it('should return true when all but one have passed (4 players)', () => {
      let state = initializePassingState(4);
      let result = passTurn(state, 0);
      state = result.passingState;
      result = passTurn(state, 1);
      state = result.passingState;
      result = passTurn(state, 2);
      state = result.passingState;

      // 3 passed out of 4 = all but one
      expect(hasAllButOnePassed(state)).toBe(true);
    });
  });

  describe('hasConsecutivePasses', () => {
    it('should return false when not enough players have passed', () => {
      const state = initializePassingState(4);
      expect(hasConsecutivePasses(state, 3)).toBe(false);

      let updatedState = state;
      let result = passTurn(updatedState, 0);
      updatedState = result.passingState;
      expect(hasConsecutivePasses(updatedState, 3)).toBe(false);

      result = passTurn(updatedState, 1);
      updatedState = result.passingState;
      expect(hasConsecutivePasses(updatedState, 3)).toBe(false);
    });

    it('should return true when enough players have passed (default 3)', () => {
      let state = initializePassingState(4);
      let result = passTurn(state, 0);
      state = result.passingState;
      result = passTurn(state, 1);
      state = result.passingState;
      result = passTurn(state, 2);
      state = result.passingState;

      expect(hasConsecutivePasses(state)).toBe(true);
    });

    it('should return true when all but one have passed', () => {
      let state = initializePassingState(4);
      let result = passTurn(state, 0);
      state = result.passingState;
      result = passTurn(state, 1);
      state = result.passingState;
      result = passTurn(state, 2);
      state = result.passingState;

      // All but one passed should count as consecutive
      expect(hasConsecutivePasses(state, 3)).toBe(true);
    });

    it('should respect custom consecutive count', () => {
      let state = initializePassingState(4);
      let result = passTurn(state, 0);
      state = result.passingState;
      result = passTurn(state, 1);
      state = result.passingState;

      expect(hasConsecutivePasses(state, 2)).toBe(true);
      expect(hasConsecutivePasses(state, 3)).toBe(false);
    });
  });

  describe('Integration: Complete passing flow', () => {
    it('should handle full round of passing and reset', () => {
      // Initialize
      let state = initializePassingState(4);

      // Player 0 passes
      let result = passTurn(state, 0);
      expect(result.success).toBe(true);
      state = result.passingState;
      expect(hasPassed(state, 0)).toBe(true);

      // Player 1 passes
      result = passTurn(state, 1);
      expect(result.success).toBe(true);
      state = result.passingState;
      expect(hasPassed(state, 1)).toBe(true);

      // Player 0 tries to pass again (should fail)
      result = passTurn(state, 0);
      expect(result.success).toBe(false);

      // Player 2 passes
      result = passTurn(state, 2);
      expect(result.success).toBe(true);
      state = result.passingState;

      // Check all passed players
      expect(getPassedPlayersCount(state)).toBe(3);
      expect(hasAllButOnePassed(state)).toBe(true);
      expect(hasConsecutivePasses(state, 3)).toBe(true);

      // Reset for new round
      state = resetPassedPlayers(state);
      expect(getPassedPlayersCount(state)).toBe(0);
      expect(hasPassed(state, 0)).toBe(false);
      expect(hasPassed(state, 1)).toBe(false);
      expect(hasPassed(state, 2)).toBe(false);

      // Players can pass again
      result = passTurn(state, 0);
      expect(result.success).toBe(true);
    });
  });
});
