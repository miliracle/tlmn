import {
  getNextPlayerIndex,
  getPreviousPlayerIndex,
  initializeTurnOrder,
  advanceTurn,
  isTurnTimedOut,
  getRemainingTurnTime,
  updateTurnStartTime,
  setCurrentPlayer,
  TURN_TIMEOUT_MS,
  type TurnOrderState,
} from './turnOrder';
import { ValidationException } from '../../common/exceptions';

describe('Turn Order Management', () => {
  describe('getNextPlayerIndex', () => {
    describe('Counter-clockwise turn order (2 players)', () => {
      it('should advance from player 0 to player 1', () => {
        expect(getNextPlayerIndex(0, 2)).toBe(1);
      });

      it('should wrap around from player 1 to player 0', () => {
        expect(getNextPlayerIndex(1, 2)).toBe(0);
      });
    });

    describe('Counter-clockwise turn order (3 players)', () => {
      it('should advance from player 0 to player 1', () => {
        expect(getNextPlayerIndex(0, 3)).toBe(1);
      });

      it('should advance from player 1 to player 2', () => {
        expect(getNextPlayerIndex(1, 3)).toBe(2);
      });

      it('should wrap around from player 2 to player 0', () => {
        expect(getNextPlayerIndex(2, 3)).toBe(0);
      });
    });

    describe('Counter-clockwise turn order (4 players)', () => {
      it('should advance from player 0 to player 1', () => {
        expect(getNextPlayerIndex(0, 4)).toBe(1);
      });

      it('should advance from player 1 to player 2', () => {
        expect(getNextPlayerIndex(1, 4)).toBe(2);
      });

      it('should advance from player 2 to player 3', () => {
        expect(getNextPlayerIndex(2, 4)).toBe(3);
      });

      it('should wrap around from player 3 to player 0', () => {
        expect(getNextPlayerIndex(3, 4)).toBe(0);
      });
    });

    describe('Error handling', () => {
      it('should throw ValidationException for invalid number of players (< 2)', () => {
        expect(() => getNextPlayerIndex(0, 1)).toThrow(ValidationException);
      });

      it('should throw ValidationException for invalid number of players (> 4)', () => {
        expect(() => getNextPlayerIndex(0, 5)).toThrow(ValidationException);
      });

      it('should throw ValidationException for invalid player index (negative)', () => {
        expect(() => getNextPlayerIndex(-1, 4)).toThrow(ValidationException);
      });

      it('should throw ValidationException for invalid player index (too high)', () => {
        expect(() => getNextPlayerIndex(4, 4)).toThrow(ValidationException);
      });
    });
  });

  describe('getPreviousPlayerIndex', () => {
    describe('Counter-clockwise previous (2 players)', () => {
      it('should go back from player 1 to player 0', () => {
        expect(getPreviousPlayerIndex(1, 2)).toBe(0);
      });

      it('should wrap around from player 0 to player 1', () => {
        expect(getPreviousPlayerIndex(0, 2)).toBe(1);
      });
    });

    describe('Counter-clockwise previous (3 players)', () => {
      it('should go back from player 1 to player 0', () => {
        expect(getPreviousPlayerIndex(1, 3)).toBe(0);
      });

      it('should go back from player 2 to player 1', () => {
        expect(getPreviousPlayerIndex(2, 3)).toBe(1);
      });

      it('should wrap around from player 0 to player 2', () => {
        expect(getPreviousPlayerIndex(0, 3)).toBe(2);
      });
    });

    describe('Counter-clockwise previous (4 players)', () => {
      it('should go back from player 1 to player 0', () => {
        expect(getPreviousPlayerIndex(1, 4)).toBe(0);
      });

      it('should go back from player 2 to player 1', () => {
        expect(getPreviousPlayerIndex(2, 4)).toBe(1);
      });

      it('should go back from player 3 to player 2', () => {
        expect(getPreviousPlayerIndex(3, 4)).toBe(2);
      });

      it('should wrap around from player 0 to player 3', () => {
        expect(getPreviousPlayerIndex(0, 4)).toBe(3);
      });
    });
  });

  describe('initializeTurnOrder', () => {
    it('should initialize turn order with starting player', () => {
      const state = initializeTurnOrder(0, 4);
      expect(state.currentPlayerIndex).toBe(0);
      expect(state.numPlayers).toBe(4);
      expect(state.turnStartTime).toBeDefined();
      expect(typeof state.turnStartTime).toBe('number');
    });

    it('should use provided turn start time', () => {
      const startTime = 1000000;
      const state = initializeTurnOrder(2, 3, startTime);
      expect(state.currentPlayerIndex).toBe(2);
      expect(state.turnStartTime).toBe(startTime);
    });

    it('should throw ValidationException for invalid number of players', () => {
      expect(() => initializeTurnOrder(0, 1)).toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid starting player index', () => {
      expect(() => initializeTurnOrder(5, 4)).toThrow(ValidationException);
    });
  });

  describe('advanceTurn', () => {
    describe('Basic turn advancement (no skipped players)', () => {
      it('should advance from player 0 to player 1 (4 players)', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 0,
          numPlayers: 4,
        };
        const result = advanceTurn(state);
        expect(result.success).toBe(true);
        expect(result.newPlayerIndex).toBe(1);
      });

      it('should wrap around from player 3 to player 0 (4 players)', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 3,
          numPlayers: 4,
        };
        const result = advanceTurn(state);
        expect(result.success).toBe(true);
        expect(result.newPlayerIndex).toBe(0);
      });

      it('should advance correctly for 2 players', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 0,
          numPlayers: 2,
        };
        const result = advanceTurn(state);
        expect(result.success).toBe(true);
        expect(result.newPlayerIndex).toBe(1);
      });

      it('should advance correctly for 3 players', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 1,
          numPlayers: 3,
        };
        const result = advanceTurn(state);
        expect(result.success).toBe(true);
        expect(result.newPlayerIndex).toBe(2);
      });
    });

    describe('Turn advancement with skipped players', () => {
      it('should skip passed player and advance to next available player', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 0,
          numPlayers: 4,
        };
        const result = advanceTurn(state, [1]); // Skip player 1
        expect(result.success).toBe(true);
        expect(result.newPlayerIndex).toBe(2); // Should skip to player 2
      });

      it('should skip multiple passed players', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 0,
          numPlayers: 4,
        };
        const result = advanceTurn(state, [1, 2]); // Skip players 1 and 2
        expect(result.success).toBe(true);
        expect(result.newPlayerIndex).toBe(3); // Should skip to player 3
      });

      it('should wrap around when skipping players at end', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 2,
          numPlayers: 4,
        };
        const result = advanceTurn(state, [3]); // Skip player 3
        expect(result.success).toBe(true);
        expect(result.newPlayerIndex).toBe(0); // Should wrap to player 0
      });

      it('should handle skipping current player (should not happen but test edge case)', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 1,
          numPlayers: 4,
        };
        // Skip player 2, advance should go to player 3
        const result = advanceTurn(state, [2]);
        expect(result.success).toBe(true);
        expect(result.newPlayerIndex).toBe(3);
      });
    });

    describe('Error handling', () => {
      it('should return error if all players are skipped', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 0,
          numPlayers: 4,
        };
        const result = advanceTurn(state, [0, 1, 2, 3]);
        expect(result.success).toBe(false);
        expect(result.error).toContain('all players are skipped');
      });

      it('should return error for invalid number of players', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 0,
          numPlayers: 5,
        };
        const result = advanceTurn(state);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid number of players');
      });

      it('should return error for invalid current player index', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 5,
          numPlayers: 4,
        };
        const result = advanceTurn(state);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid current player index');
      });

      it('should return error for invalid skip player indices', () => {
        const state: TurnOrderState = {
          currentPlayerIndex: 0,
          numPlayers: 4,
        };
        const result = advanceTurn(state, [5, -1]);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid skip player indices');
      });
    });
  });

  describe('isTurnTimedOut', () => {
    it('should return false if turn has not timed out', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: Date.now() - 1000, // 1 second ago
      };
      expect(isTurnTimedOut(state, TURN_TIMEOUT_MS)).toBe(false);
    });

    it('should return true if turn has timed out', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: Date.now() - TURN_TIMEOUT_MS - 1000, // Over timeout
      };
      expect(isTurnTimedOut(state, TURN_TIMEOUT_MS)).toBe(true);
    });

    it('should return false if no turn start time is set', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
      };
      expect(isTurnTimedOut(state, TURN_TIMEOUT_MS)).toBe(false);
    });

    it('should use custom timeout value', () => {
      const customTimeout = 5000; // 5 seconds
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: Date.now() - 6000, // 6 seconds ago
      };
      expect(isTurnTimedOut(state, customTimeout)).toBe(true);
    });
  });

  describe('getRemainingTurnTime', () => {
    it('should return remaining time correctly', () => {
      const elapsed = 10000; // 10 seconds
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: Date.now() - elapsed,
      };
      const remaining = getRemainingTurnTime(state, TURN_TIMEOUT_MS);
      expect(remaining).toBeCloseTo(TURN_TIMEOUT_MS - elapsed, -2); // Within 100ms
    });

    it('should return 0 if turn has timed out', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: Date.now() - TURN_TIMEOUT_MS - 1000,
      };
      const remaining = getRemainingTurnTime(state, TURN_TIMEOUT_MS);
      expect(remaining).toBe(0);
    });

    it('should return 0 if no turn start time is set', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
      };
      const remaining = getRemainingTurnTime(state, TURN_TIMEOUT_MS);
      expect(remaining).toBe(0);
    });

    it('should use custom timeout value', () => {
      const customTimeout = 5000;
      const elapsed = 2000;
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: Date.now() - elapsed,
      };
      const remaining = getRemainingTurnTime(state, customTimeout);
      expect(remaining).toBeCloseTo(customTimeout - elapsed, -2);
    });
  });

  describe('updateTurnStartTime', () => {
    it('should update turn start time to current time by default', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: 1000000,
      };
      const updated = updateTurnStartTime(state);
      expect(updated.turnStartTime).toBeGreaterThan(1000000);
      expect(updated.currentPlayerIndex).toBe(0);
      expect(updated.numPlayers).toBe(4);
    });

    it('should use provided turn start time', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 1,
        numPlayers: 3,
      };
      const newTime = 2000000;
      const updated = updateTurnStartTime(state, newTime);
      expect(updated.turnStartTime).toBe(newTime);
    });
  });

  describe('setCurrentPlayer', () => {
    it('should set current player index and reset turn time by default', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: 1000000,
      };
      const updated = setCurrentPlayer(state, 2);
      expect(updated.currentPlayerIndex).toBe(2);
      expect(updated.turnStartTime).toBeGreaterThan(1000000);
      expect(updated.numPlayers).toBe(4);
    });

    it('should set current player without resetting turn time if requested', () => {
      const originalTime = 1000000;
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
        turnStartTime: originalTime,
      };
      const updated = setCurrentPlayer(state, 2, false);
      expect(updated.currentPlayerIndex).toBe(2);
      expect(updated.turnStartTime).toBe(originalTime);
    });

    it('should throw error for invalid player index', () => {
      const state: TurnOrderState = {
        currentPlayerIndex: 0,
        numPlayers: 4,
      };
      expect(() => setCurrentPlayer(state, 5)).toThrow(ValidationException);
    });
  });

  describe('Integration: Full turn cycle', () => {
    it('should complete a full turn cycle for 4 players', () => {
      let state = initializeTurnOrder(0, 4);

      // Player 0 -> Player 1
      let result = advanceTurn(state);
      expect(result.success).toBe(true);
      expect(result.newPlayerIndex).toBe(1);
      state = { ...state, currentPlayerIndex: result.newPlayerIndex };

      // Player 1 -> Player 2
      result = advanceTurn(state);
      expect(result.success).toBe(true);
      expect(result.newPlayerIndex).toBe(2);
      state = { ...state, currentPlayerIndex: result.newPlayerIndex };

      // Player 2 -> Player 3
      result = advanceTurn(state);
      expect(result.success).toBe(true);
      expect(result.newPlayerIndex).toBe(3);
      state = { ...state, currentPlayerIndex: result.newPlayerIndex };

      // Player 3 -> Player 0 (wrap around)
      result = advanceTurn(state);
      expect(result.success).toBe(true);
      expect(result.newPlayerIndex).toBe(0);
    });

    it('should handle turn cycle with passed players', () => {
      let state = initializeTurnOrder(0, 4);
      const passedPlayers: number[] = [];

      // Player 0 plays, advance to player 1
      let result = advanceTurn(state, passedPlayers);
      state = { ...state, currentPlayerIndex: result.newPlayerIndex };
      expect(state.currentPlayerIndex).toBe(1);

      // Player 1 passes, add to passed players
      passedPlayers.push(1);

      // Advance from player 1, should skip to player 2
      result = advanceTurn(state, passedPlayers);
      state = { ...state, currentPlayerIndex: result.newPlayerIndex };
      expect(state.currentPlayerIndex).toBe(2);

      // Player 2 plays, advance to player 3
      result = advanceTurn(state, passedPlayers);
      state = { ...state, currentPlayerIndex: result.newPlayerIndex };
      expect(state.currentPlayerIndex).toBe(3);

      // Player 3 passes, add to passed players
      passedPlayers.push(3);

      // Advance from player 3, should wrap to player 0 (skipping player 1)
      result = advanceTurn(state, passedPlayers);
      state = { ...state, currentPlayerIndex: result.newPlayerIndex };
      expect(state.currentPlayerIndex).toBe(0);
    });
  });
});
