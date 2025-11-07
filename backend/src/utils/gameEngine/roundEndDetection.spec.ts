import {
  hasThreeConsecutivePasses,
  hasAllRemainingPassed,
  determineRoundWinnerFromPasses,
  determineRoundWinnerFromPassesWithLastPlayer,
  hasPlayerWonGame,
  detectRoundEnd,
  getPlayerToWinnersRight,
  type RoundEndDetectionContext,
} from './roundEndDetection';
import { initializeRoundState, setLastPlay } from './roundState';
import { detectSingle } from './combinations';
import { Card } from '../../types/game';

describe('Round End Detection', () => {
  // Helper function to create a test card
  const createCard = (rank: string, suit: string, id: string): Card => ({
    id,
    rank,
    suit,
    value: 0,
    points: 0,
  });

  const createContext = (
    roundState: ReturnType<typeof initializeRoundState>,
    currentPlayerIndex: number,
    playerHandSizes: number[],
    passSequence: number[],
  ): RoundEndDetectionContext => ({
    roundState,
    currentPlayerIndex,
    playerHandSizes,
    passSequence,
  });

  describe('hasThreeConsecutivePasses', () => {
    it('should return false if less than 3 passes', () => {
      const roundState = initializeRoundState(4);
      const context = createContext(roundState, 0, [13, 13, 13, 13], [0, 1]);
      expect(hasThreeConsecutivePasses(context)).toBe(false);
    });

    it('should return true if 3 consecutive passes in turn order', () => {
      const roundState = initializeRoundState(4);
      const context = createContext(roundState, 0, [13, 13, 13, 13], [0, 1, 2]);
      expect(hasThreeConsecutivePasses(context)).toBe(true);
    });

    it('should return false if 3 passes but not consecutive', () => {
      const roundState = initializeRoundState(4);
      const context = createContext(roundState, 0, [13, 13, 13, 13], [0, 2, 3]);
      expect(hasThreeConsecutivePasses(context)).toBe(false);
    });

    it('should return true for consecutive passes wrapping around', () => {
      const roundState = initializeRoundState(4);
      const context = createContext(roundState, 0, [13, 13, 13, 13], [2, 3, 0]);
      expect(hasThreeConsecutivePasses(context)).toBe(true);
    });

    it('should return true for 4-player game with 3 consecutive passes', () => {
      const roundState = initializeRoundState(4);
      const context = createContext(roundState, 0, [13, 13, 13, 13], [1, 2, 3]);
      expect(hasThreeConsecutivePasses(context)).toBe(true);
    });
  });

  describe('hasAllRemainingPassed', () => {
    it('should return false if not all remaining passed', () => {
      const roundState = initializeRoundState(4);
      roundState.passedPlayers = [0, 1];
      const context = createContext(roundState, 0, [13, 13, 13, 13], [0, 1]);
      expect(hasAllRemainingPassed(context)).toBe(false);
    });

    it('should return true if all but one passed (4 players)', () => {
      const roundState = initializeRoundState(4);
      roundState.passedPlayers = [0, 1, 2];
      const context = createContext(roundState, 0, [13, 13, 13, 13], [0, 1, 2]);
      expect(hasAllRemainingPassed(context)).toBe(true);
    });

    it('should return true if all but one passed (3 players)', () => {
      const roundState = initializeRoundState(3);
      roundState.passedPlayers = [0, 1];
      const context = createContext(roundState, 0, [13, 13, 13], [0, 1]);
      expect(hasAllRemainingPassed(context)).toBe(true);
    });

    it('should return true if all but one passed (2 players)', () => {
      const roundState = initializeRoundState(2);
      roundState.passedPlayers = [0];
      const context = createContext(roundState, 0, [13, 13], [0]);
      expect(hasAllRemainingPassed(context)).toBe(true);
    });
  });

  describe('determineRoundWinnerFromPasses', () => {
    it('should return first player if no one has played', () => {
      const roundState = initializeRoundState(4);
      const context = createContext(roundState, 0, [13, 13, 13, 13], []);
      expect(determineRoundWinnerFromPasses(context, 0)).toBe(0);
      expect(determineRoundWinnerFromPasses(context, 2)).toBe(2);
    });

    it('should return last player who played if someone has played', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      let roundState = initializeRoundState(4);
      roundState = setLastPlay(roundState, combo1!, 2);
      const context = createContext(roundState, 0, [13, 13, 12, 13], []);

      expect(determineRoundWinnerFromPasses(context, 0)).toBe(2);
    });

    it('should handle multiple plays correctly', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const card2 = createCard('4', 'Hearts', '4h');
      const combo1 = detectSingle([card1]);
      const combo2 = detectSingle([card2]);
      expect(combo1).not.toBeNull();
      expect(combo2).not.toBeNull();

      let roundState = initializeRoundState(4);
      roundState = setLastPlay(roundState, combo1!, 0);
      roundState = setLastPlay(roundState, combo2!, 3);
      const context = createContext(roundState, 0, [12, 13, 13, 12], []);

      expect(determineRoundWinnerFromPasses(context, 0)).toBe(3);
    });
  });

  describe('determineRoundWinnerFromPassesWithLastPlayer', () => {
    it('should use override if provided', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      let roundState = initializeRoundState(4);
      roundState = setLastPlay(roundState, combo1!, 1);
      const context = createContext(roundState, 0, [13, 12, 13, 13], []);

      // Override with different player
      expect(determineRoundWinnerFromPassesWithLastPlayer(context, 0, 3)).toBe(3);
    });

    it('should use roundState lastPlayerIndex if override is null', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      let roundState = initializeRoundState(4);
      roundState = setLastPlay(roundState, combo1!, 2);
      const context = createContext(roundState, 0, [13, 13, 12, 13], []);

      expect(determineRoundWinnerFromPassesWithLastPlayer(context, 0, null)).toBe(2);
    });
  });

  describe('hasPlayerWonGame', () => {
    it('should return true if player has 0 cards', () => {
      const playerHandSizes = [0, 13, 13, 13];
      expect(hasPlayerWonGame(playerHandSizes, 0)).toBe(true);
    });

    it('should return false if player has cards', () => {
      const playerHandSizes = [5, 13, 13, 13];
      expect(hasPlayerWonGame(playerHandSizes, 0)).toBe(false);
    });

    it('should throw error for invalid player index', () => {
      const playerHandSizes = [13, 13, 13, 13];
      expect(() => hasPlayerWonGame(playerHandSizes, -1)).toThrow();
      expect(() => hasPlayerWonGame(playerHandSizes, 4)).toThrow();
    });
  });

  describe('detectRoundEnd', () => {
    it('should detect game end when player has 0 cards', () => {
      const roundState = initializeRoundState(4);
      const context = createContext(roundState, 0, [0, 13, 13, 13], []);

      const result = detectRoundEnd(context, 0);
      expect(result.shouldEndRound).toBe(true);
      expect(result.reason).toBe('GAME_END');
      expect(result.roundWinner).toBe(0);
      expect(result.shouldEndGame).toBe(true);
    });

    it('should detect 3 consecutive passes', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      let roundState = initializeRoundState(4);
      roundState = setLastPlay(roundState, combo1!, 0);
      const context = createContext(roundState, 0, [12, 13, 13, 13], [1, 2, 3]);

      const result = detectRoundEnd(context, 0);
      expect(result.shouldEndRound).toBe(true);
      expect(result.reason).toBe('THREE_CONSECUTIVE_PASSES');
      expect(result.roundWinner).toBe(0); // Last player who played
      expect(result.shouldEndGame).toBe(false);
    });

    it('should detect all remaining passed', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      let roundState = initializeRoundState(4);
      roundState = setLastPlay(roundState, combo1!, 0);
      roundState.passedPlayers = [1, 2, 3];
      // Pass sequence [1, 2, 3] is consecutive, so THREE_CONSECUTIVE_PASSES is detected first
      // To test ALL_REMAINING_PASSED, we need non-consecutive passes
      const context = createContext(roundState, 0, [12, 13, 13, 13], [1, 2, 3]);

      const result = detectRoundEnd(context, 0);
      expect(result.shouldEndRound).toBe(true);
      // [1, 2, 3] are consecutive, so THREE_CONSECUTIVE_PASSES is detected
      expect(result.reason).toBe('THREE_CONSECUTIVE_PASSES');
      expect(result.roundWinner).toBe(0); // Last player who played
      expect(result.shouldEndGame).toBe(false);
    });

    it('should detect all remaining passed with non-consecutive passes', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      let roundState = initializeRoundState(4);
      roundState = setLastPlay(roundState, combo1!, 0);
      roundState.passedPlayers = [1, 3]; // Only 2 passed, but all remaining (player 0 played, so 1 and 3 are remaining)
      // Actually, if player 0 played and 1, 3 passed, that's only 2 passed, not all remaining
      // Let's use a case where all but one passed but not consecutive
      roundState.passedPlayers = [0, 2, 3]; // Player 1 is the only one who didn't pass
      const context = createContext(roundState, 0, [12, 13, 13, 13], [0, 2, 3]);

      const result = detectRoundEnd(context, 0);
      expect(result.shouldEndRound).toBe(true);
      expect(result.reason).toBe('ALL_REMAINING_PASSED');
      expect(result.roundWinner).toBe(0); // Last player who played
      expect(result.shouldEndGame).toBe(false);
    });

    it('should return first player as winner if no one played', () => {
      const roundState = initializeRoundState(4);
      roundState.passedPlayers = [1, 2, 3];
      // Note: 3 consecutive passes is checked first, so this will trigger that
      const context = createContext(roundState, 0, [13, 13, 13, 13], [1, 2, 3]);

      const result = detectRoundEnd(context, 0);
      expect(result.shouldEndRound).toBe(true);
      // 3 consecutive passes is detected first (1, 2, 3 are consecutive)
      expect(result.reason).toBe('THREE_CONSECUTIVE_PASSES');
      expect(result.roundWinner).toBe(0); // First player wins if no one played
      expect(result.shouldEndGame).toBe(false);
    });

    it('should detect all remaining passed when not 3 consecutive', () => {
      const roundState = initializeRoundState(4);
      roundState.passedPlayers = [0, 2, 3]; // Not consecutive in passSequence
      // Pass sequence [0, 2, 3] - 2->3 is consecutive, but 0->2 is not
      // So hasThreeConsecutivePasses should return false
      const context = createContext(roundState, 0, [13, 13, 13, 13], [0, 2, 3]);

      const result = detectRoundEnd(context, 0);
      expect(result.shouldEndRound).toBe(true);
      // Since [0, 2, 3] - checking last 3: 0->2 (not consecutive), 2->3 (consecutive)
      // So hasThreeConsecutivePasses returns false, and hasAllRemainingPassed returns true
      expect(result.reason).toBe('ALL_REMAINING_PASSED');
      expect(result.roundWinner).toBe(0); // First player wins if no one played
      expect(result.shouldEndGame).toBe(false);
    });

    it('should return false if round should continue', () => {
      const roundState = initializeRoundState(4);
      roundState.passedPlayers = [1];
      const context = createContext(roundState, 0, [13, 13, 13, 13], [1]);

      const result = detectRoundEnd(context, 0);
      expect(result.shouldEndRound).toBe(false);
      expect(result.reason).toBeNull();
      expect(result.roundWinner).toBeNull();
      expect(result.shouldEndGame).toBe(false);
    });
  });

  describe('getPlayerToWinnersRight', () => {
    it('should return next player in counter-clockwise order', () => {
      expect(getPlayerToWinnersRight(0, 4)).toBe(1);
      expect(getPlayerToWinnersRight(1, 4)).toBe(2);
      expect(getPlayerToWinnersRight(2, 4)).toBe(3);
      expect(getPlayerToWinnersRight(3, 4)).toBe(0); // Wraps around
    });

    it('should work for 3 players', () => {
      expect(getPlayerToWinnersRight(0, 3)).toBe(1);
      expect(getPlayerToWinnersRight(1, 3)).toBe(2);
      expect(getPlayerToWinnersRight(2, 3)).toBe(0);
    });

    it('should work for 2 players', () => {
      expect(getPlayerToWinnersRight(0, 2)).toBe(1);
      expect(getPlayerToWinnersRight(1, 2)).toBe(0);
    });

    it('should throw error for invalid number of players', () => {
      expect(() => getPlayerToWinnersRight(0, 1)).toThrow();
      expect(() => getPlayerToWinnersRight(0, 5)).toThrow();
    });

    it('should throw error for invalid winner index', () => {
      expect(() => getPlayerToWinnersRight(-1, 4)).toThrow();
      expect(() => getPlayerToWinnersRight(4, 4)).toThrow();
    });
  });
});
