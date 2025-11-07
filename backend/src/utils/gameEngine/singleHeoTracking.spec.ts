import {
  initializeSingleHeoTracking,
  recordPlay,
  isSingleHeo,
  isDoiHeo,
  isBaConHeo,
  getConsecutiveSingleHeoCount,
  getConsecutiveSingleHeos,
  resetSingleHeoTracking,
  type SingleHeoTrackingState,
} from './singleHeoTracking';
import { detectCombination } from './combinations';
import { createCard } from './testHelpers';

describe('Single Heo Tracking', () => {
  describe('initializeSingleHeoTracking', () => {
    it('should initialize tracking state for 2 players', () => {
      const state = initializeSingleHeoTracking(2);
      expect(state.consecutiveSingleHeos).toEqual([]);
      expect(state.numPlayers).toBe(2);
    });

    it('should initialize tracking state for 4 players', () => {
      const state = initializeSingleHeoTracking(4);
      expect(state.consecutiveSingleHeos).toEqual([]);
      expect(state.numPlayers).toBe(4);
    });

    it('should throw error for invalid number of players', () => {
      expect(() => initializeSingleHeoTracking(1)).toThrow(
        'Invalid number of players: 1. Must be between 2 and 4.',
      );
      expect(() => initializeSingleHeoTracking(5)).toThrow(
        'Invalid number of players: 5. Must be between 2 and 4.',
      );
    });
  });

  describe('isSingleHeo', () => {
    it('should return true for single heo', () => {
      const card = createCard('2', 'Spades');
      const combination = detectCombination([card]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isSingleHeo(combination)).toBe(true);
      }
    });

    it('should return false for single non-heo', () => {
      const card = createCard('A', 'Hearts');
      const combination = detectCombination([card]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isSingleHeo(combination)).toBe(false);
      }
    });

    it('should return false for đôi heo', () => {
      const card1 = createCard('2', 'Spades');
      const card2 = createCard('2', 'Clubs');
      const combination = detectCombination([card1, card2]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isSingleHeo(combination)).toBe(false);
      }
    });
  });

  describe('isDoiHeo', () => {
    it('should return true for đôi heo', () => {
      const card1 = createCard('2', 'Spades');
      const card2 = createCard('2', 'Clubs');
      const combination = detectCombination([card1, card2]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isDoiHeo(combination)).toBe(true);
      }
    });

    it('should return false for single heo', () => {
      const card = createCard('2', 'Spades');
      const combination = detectCombination([card]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isDoiHeo(combination)).toBe(false);
      }
    });

    it('should return false for regular pair', () => {
      const card1 = createCard('A', 'Hearts');
      const card2 = createCard('A', 'Diamonds');
      const combination = detectCombination([card1, card2]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isDoiHeo(combination)).toBe(false);
      }
    });
  });

  describe('isBaConHeo', () => {
    it('should return true for 3 con heo', () => {
      const card1 = createCard('2', 'Spades');
      const card2 = createCard('2', 'Clubs');
      const card3 = createCard('2', 'Diamonds');
      const combination = detectCombination([card1, card2, card3]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isBaConHeo(combination)).toBe(true);
      }
    });

    it('should return false for single heo', () => {
      const card = createCard('2', 'Spades');
      const combination = detectCombination([card]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isBaConHeo(combination)).toBe(false);
      }
    });

    it('should return false for regular triple', () => {
      const card1 = createCard('A', 'Hearts');
      const card2 = createCard('A', 'Diamonds');
      const card3 = createCard('A', 'Clubs');
      const combination = detectCombination([card1, card2, card3]);
      expect(combination).not.toBeNull();
      if (combination) {
        expect(isBaConHeo(combination)).toBe(false);
      }
    });
  });

  describe('recordPlay', () => {
    describe('Subtask 2.5.2.1: Track consecutive single heo plays', () => {
      it('should track single heo play', () => {
        let state = initializeSingleHeoTracking(4);
        const card = createCard('2', 'Spades');
        const combination = detectCombination([card]);
        expect(combination).not.toBeNull();
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(1);
        }
      });

      it('should track multiple consecutive single heos', () => {
        let state = initializeSingleHeoTracking(4);
        const card1 = createCard('2', 'Spades');
        const card2 = createCard('2', 'Clubs');
        const card3 = createCard('2', 'Diamonds');

        let combination = detectCombination([card1]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(1);
        }

        combination = detectCombination([card2]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(2);
        }

        combination = detectCombination([card3]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(3);
        }
      });
    });

    describe('Subtask 2.5.2.2: Distinguish between single heo vs đôi heo', () => {
      it('should reset when đôi heo is played', () => {
        let state = initializeSingleHeoTracking(4);
        const card1 = createCard('2', 'Spades');
        const card2 = createCard('2', 'Clubs');

        // Play single heo
        let combination = detectCombination([card1]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(1);
        }

        // Play đôi heo - should reset
        combination = detectCombination([card1, card2]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(0);
        }
      });

      it('should reset when 3 con heo is played', () => {
        let state = initializeSingleHeoTracking(4);
        const card1 = createCard('2', 'Spades');
        const card2 = createCard('2', 'Clubs');
        const card3 = createCard('2', 'Diamonds');

        // Play single heo
        let combination = detectCombination([card1]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(1);
        }

        // Play 3 con heo - should reset
        combination = detectCombination([card1, card2, card3]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(0);
        }
      });
    });

    describe('Subtask 2.5.2.3: Reset tracking on new round or non-heo play', () => {
      it('should reset when non-heo is played', () => {
        let state = initializeSingleHeoTracking(4);
        const heo = createCard('2', 'Spades');
        const ace = createCard('A', 'Hearts');

        // Play single heo
        let combination = detectCombination([heo]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(1);
        }

        // Play non-heo - should reset
        combination = detectCombination([ace]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(0);
        }
      });

      it('should reset when pair is played', () => {
        let state = initializeSingleHeoTracking(4);
        const heo = createCard('2', 'Spades');
        const ace1 = createCard('A', 'Hearts');
        const ace2 = createCard('A', 'Diamonds');

        // Play single heo
        let combination = detectCombination([heo]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(1);
        }

        // Play pair - should reset
        combination = detectCombination([ace1, ace2]);
        if (combination) {
          state = recordPlay(state, combination);
          expect(getConsecutiveSingleHeoCount(state)).toBe(0);
        }
      });
    });

    describe('Subtask 2.5.2.4: Count how many single heo in sequence', () => {
      it('should count up to 4 single heos', () => {
        let state = initializeSingleHeoTracking(4);
        const heos = [
          createCard('2', 'Spades'),
          createCard('2', 'Clubs'),
          createCard('2', 'Diamonds'),
          createCard('2', 'Hearts'),
        ];

        for (let i = 0; i < heos.length; i++) {
          const combination = detectCombination([heos[i]]);
          if (combination) {
            state = recordPlay(state, combination);
            expect(getConsecutiveSingleHeoCount(state)).toBe(i + 1);
          }
        }
      });
    });
  });

  describe('resetSingleHeoTracking', () => {
    it('should reset tracking state', () => {
      let state = initializeSingleHeoTracking(4);
      const card = createCard('2', 'Spades');
      const combination = detectCombination([card]);
      if (combination) {
        state = recordPlay(state, combination);
        expect(getConsecutiveSingleHeoCount(state)).toBe(1);

        state = resetSingleHeoTracking(state);
        expect(getConsecutiveSingleHeoCount(state)).toBe(0);
      }
    });
  });
});

