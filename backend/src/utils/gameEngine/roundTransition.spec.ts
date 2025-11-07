import {
  determineNextRoundLeader,
  transitionToNextRound,
  clearPlayedCardsHistory,
  type RoundTransitionContext,
} from './roundTransition';
import { initializeRoundState, setLastPlay, addPassedPlayer, setRoundWinner } from './roundState';
import { initializeTurnOrder } from './turnOrder';
import { initializeVongState } from './vongDetection';
import { initializePassingState } from './passing';
import { initializeSingleHeoTracking } from './singleHeoTracking';
import { initializeCuttingChain } from './cuttingChain';
import { detectSingle } from './combinations';
import { Card } from '../../types/game';

describe('Round Transition', () => {
  // Helper function to create a test card
  const createCard = (rank: string, suit: string, id: string): Card => ({
    id,
    rank,
    suit,
    value: 0,
    points: 0,
  });

  const createContext = (): RoundTransitionContext => {
    const roundState = initializeRoundState(4);
    const turnOrderState = initializeTurnOrder(0, 4);
    const vongState = initializeVongState(4, 0);
    const passingState = initializePassingState(4);
    const singleHeoTrackingState = initializeSingleHeoTracking(4);
    const cuttingChainState = initializeCuttingChain(4);

    return {
      roundState,
      turnOrderState,
      vongState,
      passingState,
      singleHeoTrackingState,
      cuttingChainState,
    };
  };

  describe('determineNextRoundLeader', () => {
    it('should return player to winner right (Hưởng Sái rule)', () => {
      expect(determineNextRoundLeader(0, 4)).toBe(1);
      expect(determineNextRoundLeader(1, 4)).toBe(2);
      expect(determineNextRoundLeader(2, 4)).toBe(3);
      expect(determineNextRoundLeader(3, 4)).toBe(0); // Wraps around
    });

    it('should work for 3 players', () => {
      expect(determineNextRoundLeader(0, 3)).toBe(1);
      expect(determineNextRoundLeader(1, 3)).toBe(2);
      expect(determineNextRoundLeader(2, 3)).toBe(0);
    });

    it('should work for 2 players', () => {
      expect(determineNextRoundLeader(0, 2)).toBe(1);
      expect(determineNextRoundLeader(1, 2)).toBe(0);
    });

    it('should throw error for invalid number of players', () => {
      expect(() => determineNextRoundLeader(0, 1)).toThrow();
      expect(() => determineNextRoundLeader(0, 5)).toThrow();
    });

    it('should throw error for invalid winner index', () => {
      expect(() => determineNextRoundLeader(-1, 4)).toThrow();
      expect(() => determineNextRoundLeader(4, 4)).toThrow();
    });
  });

  describe('transitionToNextRound', () => {
    it('should reset all round-specific states', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      const context = createContext();
      context.roundState = setLastPlay(context.roundState, combo1!, 0);
      context.roundState = addPassedPlayer(context.roundState, 1);
      context.roundState = addPassedPlayer(context.roundState, 2);
      context.roundState = setRoundWinner(context.roundState, 0);

      const result = transitionToNextRound(context, 0);

      // Round state should be reset
      expect(result.roundState.currentRoundNumber).toBe(2);
      expect(result.roundState.lastPlay).toBeNull();
      expect(result.roundState.lastPlayerIndex).toBeNull();
      expect(result.roundState.passedPlayers).toEqual([]);
      expect(result.roundState.roundWinner).toBeNull();

      // Turn order should be set to next round leader
      expect(result.turnOrderState.currentPlayerIndex).toBe(1); // Player to winner's right
    });

    it('should set next round leader correctly', () => {
      let context = createContext();
      context.roundState = setRoundWinner(context.roundState, 0);

      const result = transitionToNextRound(context, 0);
      expect(result.nextRoundLeader).toBe(1); // Player to winner's right

      // Test with different winner
      context = createContext();
      context.roundState = setRoundWinner(context.roundState, 2);
      const result2 = transitionToNextRound(context, 2);
      expect(result2.nextRoundLeader).toBe(3);
    });

    it('should reset vòng state with new first player', () => {
      const context = createContext();
      context.roundState = setRoundWinner(context.roundState, 0);

      const result = transitionToNextRound(context, 0);
      expect(result.vongState.firstPlayerIndex).toBe(1); // Next round leader
      expect(result.vongState.hasAnyPlayerPlayed).toBe(false);
    });

    it('should reset passing state', () => {
      const context = createContext();
      context.roundState = addPassedPlayer(context.roundState, 1);
      context.roundState = addPassedPlayer(context.roundState, 2);
      context.roundState = setRoundWinner(context.roundState, 0);

      const result = transitionToNextRound(context, 0);
      expect(result.passingState.passedPlayers).toEqual([]);
    });

    it('should reset single heo tracking state', () => {
      const context = createContext();
      context.roundState = setRoundWinner(context.roundState, 0);

      const result = transitionToNextRound(context, 0);
      expect(result.singleHeoTrackingState.consecutiveSingleHeos).toEqual([]);
    });

    it('should reset cutting chain state', () => {
      const context = createContext();
      context.roundState = setRoundWinner(context.roundState, 0);

      const result = transitionToNextRound(context, 0);
      expect(result.cuttingChainState.chain).toEqual([]);
    });

    it('should increment round number', () => {
      const context = createContext();
      context.roundState = setRoundWinner(context.roundState, 0);

      const result = transitionToNextRound(context, 0);
      expect(result.roundState.currentRoundNumber).toBe(2);

      // Transition again
      const result2 = transitionToNextRound(
        {
          ...context,
          roundState: result.roundState,
          turnOrderState: result.turnOrderState,
          vongState: result.vongState,
          passingState: result.passingState,
          singleHeoTrackingState: result.singleHeoTrackingState,
          cuttingChainState: result.cuttingChainState,
        },
        1,
      );
      expect(result2.roundState.currentRoundNumber).toBe(3);
    });

    it('should handle wrapping around for next round leader', () => {
      const context = createContext();
      context.roundState = setRoundWinner(context.roundState, 3); // Last player wins

      const result = transitionToNextRound(context, 3);
      expect(result.nextRoundLeader).toBe(0); // Wraps around
      expect(result.turnOrderState.currentPlayerIndex).toBe(0);
    });

    it('should throw error for invalid round winner index', () => {
      const context = createContext();
      expect(() => transitionToNextRound(context, -1)).toThrow();
      expect(() => transitionToNextRound(context, 4)).toThrow();
    });
  });

  describe('clearPlayedCardsHistory', () => {
    it('should return round state unchanged (placeholder)', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      let roundState = initializeRoundState(4);
      roundState = setLastPlay(roundState, combo1!, 0);

      const result = clearPlayedCardsHistory(roundState);
      // This is a placeholder - in full implementation would clear history
      expect(result).toBe(roundState);
    });
  });

  describe('Integration: Complete round transition flow', () => {
    it('should handle complete round transition', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();

      // Set up round with plays and passes
      const context = createContext();
      context.roundState = setLastPlay(context.roundState, combo1!, 0);
      context.roundState = addPassedPlayer(context.roundState, 1);
      context.roundState = addPassedPlayer(context.roundState, 2);
      context.roundState = setRoundWinner(context.roundState, 0);

      // Transition to next round
      const result = transitionToNextRound(context, 0);

      // Verify all states are reset
      expect(result.roundState.currentRoundNumber).toBe(2);
      expect(result.roundState.lastPlay).toBeNull();
      expect(result.roundState.passedPlayers).toEqual([]);
      expect(result.roundState.roundWinner).toBeNull();
      expect(result.nextRoundLeader).toBe(1);
      expect(result.turnOrderState.currentPlayerIndex).toBe(1);
      expect(result.vongState.firstPlayerIndex).toBe(1);
      expect(result.vongState.hasAnyPlayerPlayed).toBe(false);
    });

    it('should handle multiple round transitions', () => {
      let context = createContext();

      // Round 1: Player 0 wins
      context.roundState = setRoundWinner(context.roundState, 0);
      let result = transitionToNextRound(context, 0);
      expect(result.roundState.currentRoundNumber).toBe(2);
      expect(result.nextRoundLeader).toBe(1);

      // Round 2: Player 1 wins
      context = {
        ...context,
        roundState: result.roundState,
        turnOrderState: result.turnOrderState,
        vongState: result.vongState,
        passingState: result.passingState,
        singleHeoTrackingState: result.singleHeoTrackingState,
        cuttingChainState: result.cuttingChainState,
      };
      context.roundState = setRoundWinner(context.roundState, 1);
      result = transitionToNextRound(context, 1);
      expect(result.roundState.currentRoundNumber).toBe(3);
      expect(result.nextRoundLeader).toBe(2);

      // Round 3: Player 2 wins
      context = {
        ...context,
        roundState: result.roundState,
        turnOrderState: result.turnOrderState,
        vongState: result.vongState,
        passingState: result.passingState,
        singleHeoTrackingState: result.singleHeoTrackingState,
        cuttingChainState: result.cuttingChainState,
      };
      context.roundState = setRoundWinner(context.roundState, 2);
      result = transitionToNextRound(context, 2);
      expect(result.roundState.currentRoundNumber).toBe(4);
      expect(result.nextRoundLeader).toBe(3);
    });
  });
});
