import {
  initializeRoundState,
  getCurrentRoundNumber,
  setLastPlay,
  getLastPlay,
  addPassedPlayer,
  getRoundPassedPlayers,
  hasPlayerPassed,
  setRoundWinner,
  getRoundWinner,
  hasRoundWinner,
  resetRoundState,
  incrementRoundNumber,
} from './roundState';
import { detectSingle, detectPair } from './combinations';
import { Card } from '../../types/game';

describe('Round State Tracking', () => {
  // Helper function to create a test card
  const createCard = (rank: string, suit: string, id: string): Card => ({
    id,
    rank,
    suit,
    value: 0, // Will be calculated by cardValue
    points: 0, // Will be calculated by cardPoints
  });

  describe('initializeRoundState', () => {
    it('should initialize round state for 2 players', () => {
      const state = initializeRoundState(2);
      expect(state.currentRoundNumber).toBe(1);
      expect(state.lastPlay).toBeNull();
      expect(state.passedPlayers).toEqual([]);
      expect(state.roundWinner).toBeNull();
      expect(state.numPlayers).toBe(2);
    });

    it('should initialize round state for 3 players', () => {
      const state = initializeRoundState(3);
      expect(state.currentRoundNumber).toBe(1);
      expect(state.lastPlay).toBeNull();
      expect(state.passedPlayers).toEqual([]);
      expect(state.roundWinner).toBeNull();
      expect(state.numPlayers).toBe(3);
    });

    it('should initialize round state for 4 players', () => {
      const state = initializeRoundState(4);
      expect(state.currentRoundNumber).toBe(1);
      expect(state.lastPlay).toBeNull();
      expect(state.passedPlayers).toEqual([]);
      expect(state.roundWinner).toBeNull();
      expect(state.numPlayers).toBe(4);
    });

    it('should throw error for invalid number of players (< 2)', () => {
      expect(() => initializeRoundState(1)).toThrow(
        'Invalid number of players: 1. Must be between 2 and 4.',
      );
    });

    it('should throw error for invalid number of players (> 4)', () => {
      expect(() => initializeRoundState(5)).toThrow(
        'Invalid number of players: 5. Must be between 2 and 4.',
      );
    });
  });

  describe('getCurrentRoundNumber', () => {
    it('should return current round number', () => {
      const state = initializeRoundState(4);
      expect(getCurrentRoundNumber(state)).toBe(1);
    });

    it('should return updated round number after increment', () => {
      let state = initializeRoundState(4);
      state = incrementRoundNumber(state);
      expect(getCurrentRoundNumber(state)).toBe(2);
    });
  });

  describe('setLastPlay and getLastPlay', () => {
    it('should set and get last play', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combination = detectSingle([card1]);
      expect(combination).not.toBeNull();

      let state = initializeRoundState(4);
      expect(getLastPlay(state)).toBeNull();

      state = setLastPlay(state, combination!, 0);
      const lastPlay = getLastPlay(state);
      expect(lastPlay).not.toBeNull();
      expect(lastPlay?.type).toBe('single');
      expect(lastPlay?.cards).toEqual([card1]);
    });

    it('should update last play when new play is made', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const card2 = createCard('4', 'Hearts', '4h');
      const combo1 = detectSingle([card1]);
      const combo2 = detectSingle([card2]);
      expect(combo1).not.toBeNull();
      expect(combo2).not.toBeNull();

      let state = initializeRoundState(4);
      state = setLastPlay(state, combo1!, 0);
      expect(getLastPlay(state)?.cards[0].id).toBe('3s');

      state = setLastPlay(state, combo2!, 1);
      expect(getLastPlay(state)?.cards[0].id).toBe('4h');
    });

    it('should handle pair combination as last play', () => {
      const card1 = createCard('5', 'Diamonds', '5d');
      const card2 = createCard('5', 'Clubs', '5c');
      const combination = detectPair([card1, card2]);
      expect(combination).not.toBeNull();

      let state = initializeRoundState(4);
      state = setLastPlay(state, combination!, 2);
      const lastPlay = getLastPlay(state);
      expect(lastPlay?.type).toBe('pair');
      expect(lastPlay?.cards).toHaveLength(2);
    });
  });

  describe('addPassedPlayer and getRoundPassedPlayers', () => {
    it('should add a player to passed players list', () => {
      let state = initializeRoundState(4);
      expect(getRoundPassedPlayers(state)).toEqual([]);

      state = addPassedPlayer(state, 0);
      expect(getRoundPassedPlayers(state)).toEqual([0]);
    });

    it('should add multiple players to passed players list', () => {
      let state = initializeRoundState(4);
      state = addPassedPlayer(state, 0);
      state = addPassedPlayer(state, 1);
      state = addPassedPlayer(state, 2);

      const passedPlayers = getRoundPassedPlayers(state);
      expect(passedPlayers).toEqual([0, 1, 2]);
      expect(passedPlayers).toHaveLength(3);
    });

    it('should throw error when adding same player twice', () => {
      let state = initializeRoundState(4);
      state = addPassedPlayer(state, 0);

      expect(() => addPassedPlayer(state, 0)).toThrow('Player 0 has already passed in this round.');
    });

    it('should throw error for invalid player index (negative)', () => {
      const state = initializeRoundState(4);
      expect(() => addPassedPlayer(state, -1)).toThrow(
        'Invalid player index: -1. Must be between 0 and 3.',
      );
    });

    it('should throw error for invalid player index (too high)', () => {
      const state = initializeRoundState(4);
      expect(() => addPassedPlayer(state, 4)).toThrow(
        'Invalid player index: 4. Must be between 0 and 3.',
      );
    });

    it('should return a copy of passed players array', () => {
      let state = initializeRoundState(4);
      state = addPassedPlayer(state, 0);
      state = addPassedPlayer(state, 1);

      const passedPlayers1 = getRoundPassedPlayers(state);
      const passedPlayers2 = getRoundPassedPlayers(state);

      // Should be equal but not the same reference
      expect(passedPlayers1).toEqual(passedPlayers2);
      expect(passedPlayers1).not.toBe(passedPlayers2);
    });
  });

  describe('hasPlayerPassed', () => {
    it('should return false for player who has not passed', () => {
      const state = initializeRoundState(4);
      expect(hasPlayerPassed(state, 0)).toBe(false);
      expect(hasPlayerPassed(state, 1)).toBe(false);
    });

    it('should return true for player who has passed', () => {
      let state = initializeRoundState(4);
      state = addPassedPlayer(state, 1);
      expect(hasPlayerPassed(state, 1)).toBe(true);
      expect(hasPlayerPassed(state, 0)).toBe(false);
    });

    it('should throw error for invalid player index (negative)', () => {
      const state = initializeRoundState(4);
      expect(() => hasPlayerPassed(state, -1)).toThrow(
        'Invalid player index: -1. Must be between 0 and 3.',
      );
    });

    it('should throw error for invalid player index (too high)', () => {
      const state = initializeRoundState(4);
      expect(() => hasPlayerPassed(state, 4)).toThrow(
        'Invalid player index: 4. Must be between 0 and 3.',
      );
    });
  });

  describe('setRoundWinner and getRoundWinner', () => {
    it('should set and get round winner', () => {
      let state = initializeRoundState(4);
      expect(getRoundWinner(state)).toBeNull();
      expect(hasRoundWinner(state)).toBe(false);

      state = setRoundWinner(state, 2);
      expect(getRoundWinner(state)).toBe(2);
      expect(hasRoundWinner(state)).toBe(true);
    });

    it('should update round winner', () => {
      let state = initializeRoundState(4);
      state = setRoundWinner(state, 0);
      expect(getRoundWinner(state)).toBe(0);

      state = setRoundWinner(state, 3);
      expect(getRoundWinner(state)).toBe(3);
    });

    it('should throw error for invalid player index (negative)', () => {
      const state = initializeRoundState(4);
      expect(() => setRoundWinner(state, -1)).toThrow(
        'Invalid player index: -1. Must be between 0 and 3.',
      );
    });

    it('should throw error for invalid player index (too high)', () => {
      const state = initializeRoundState(4);
      expect(() => setRoundWinner(state, 4)).toThrow(
        'Invalid player index: 4. Must be between 0 and 3.',
      );
    });
  });

  describe('hasRoundWinner', () => {
    it('should return false when no winner is set', () => {
      const state = initializeRoundState(4);
      expect(hasRoundWinner(state)).toBe(false);
    });

    it('should return true when winner is set', () => {
      let state = initializeRoundState(4);
      state = setRoundWinner(state, 1);
      expect(hasRoundWinner(state)).toBe(true);
    });
  });

  describe('resetRoundState', () => {
    it('should reset round state for new round', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combination = detectSingle([card1]);
      expect(combination).not.toBeNull();

      let state = initializeRoundState(4);
      state = setLastPlay(state, combination!, 0);
      state = addPassedPlayer(state, 0);
      state = addPassedPlayer(state, 1);
      state = setRoundWinner(state, 2);

      // Verify state before reset
      expect(getCurrentRoundNumber(state)).toBe(1);
      expect(getLastPlay(state)).not.toBeNull();
      expect(getRoundPassedPlayers(state)).toHaveLength(2);
      expect(getRoundWinner(state)).toBe(2);

      // Reset for new round
      state = resetRoundState(state);

      // Verify state after reset
      expect(getCurrentRoundNumber(state)).toBe(2);
      expect(getLastPlay(state)).toBeNull();
      expect(getRoundPassedPlayers(state)).toEqual([]);
      expect(getRoundWinner(state)).toBeNull();
      expect(state.numPlayers).toBe(4); // Should preserve numPlayers
    });

    it('should increment round number on reset', () => {
      let state = initializeRoundState(4);
      expect(getCurrentRoundNumber(state)).toBe(1);

      state = resetRoundState(state);
      expect(getCurrentRoundNumber(state)).toBe(2);

      state = resetRoundState(state);
      expect(getCurrentRoundNumber(state)).toBe(3);
    });

    it('should preserve numPlayers on reset', () => {
      let state = initializeRoundState(3);
      state = resetRoundState(state);
      expect(state.numPlayers).toBe(3);
    });
  });

  describe('incrementRoundNumber', () => {
    it('should increment round number', () => {
      let state = initializeRoundState(4);
      expect(getCurrentRoundNumber(state)).toBe(1);

      state = incrementRoundNumber(state);
      expect(getCurrentRoundNumber(state)).toBe(2);

      state = incrementRoundNumber(state);
      expect(getCurrentRoundNumber(state)).toBe(3);
    });

    it('should not affect other state properties', () => {
      const card1 = createCard('3', 'Spades', '3s');
      const combination = detectSingle([card1]);
      expect(combination).not.toBeNull();

      let state = initializeRoundState(4);
      state = setLastPlay(state, combination!, 0);
      state = addPassedPlayer(state, 0);
      state = setRoundWinner(state, 1);

      state = incrementRoundNumber(state);

      expect(getCurrentRoundNumber(state)).toBe(2);
      expect(getLastPlay(state)).not.toBeNull(); // Should still be set
      expect(getRoundPassedPlayers(state)).toHaveLength(1); // Should still have passed players
      expect(getRoundWinner(state)).toBe(1); // Should still have winner
    });
  });

  describe('Integration: Complete round flow', () => {
    it('should handle complete round flow', () => {
      // Initialize round
      let state = initializeRoundState(4);
      expect(getCurrentRoundNumber(state)).toBe(1);
      expect(getLastPlay(state)).toBeNull();

      // First player plays
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();
      state = setLastPlay(state, combo1!, 0);
      expect(getLastPlay(state)?.cards[0].id).toBe('3s');

      // Second player passes
      state = addPassedPlayer(state, 1);
      expect(hasPlayerPassed(state, 1)).toBe(true);

      // Third player plays
      const card2 = createCard('4', 'Hearts', '4h');
      const combo2 = detectSingle([card2]);
      expect(combo2).not.toBeNull();
      state = setLastPlay(state, combo2!, 2);
      expect(getLastPlay(state)?.cards[0].id).toBe('4h');

      // Fourth player passes
      state = addPassedPlayer(state, 3);
      expect(hasPlayerPassed(state, 3)).toBe(true);

      // Round ends, third player wins
      state = setRoundWinner(state, 2);
      expect(hasRoundWinner(state)).toBe(true);
      expect(getRoundWinner(state)).toBe(2);

      // Reset for next round
      state = resetRoundState(state);
      expect(getCurrentRoundNumber(state)).toBe(2);
      expect(getLastPlay(state)).toBeNull();
      expect(getRoundPassedPlayers(state)).toEqual([]);
      expect(getRoundWinner(state)).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle 2-player game correctly', () => {
      let state = initializeRoundState(2);
      state = addPassedPlayer(state, 0);
      expect(getRoundPassedPlayers(state)).toEqual([0]);
      expect(hasPlayerPassed(state, 0)).toBe(true);
      expect(hasPlayerPassed(state, 1)).toBe(false);

      state = setRoundWinner(state, 1);
      expect(getRoundWinner(state)).toBe(1);
    });

    it('should handle 3-player game correctly', () => {
      let state = initializeRoundState(3);
      state = addPassedPlayer(state, 0);
      state = addPassedPlayer(state, 2);
      expect(getRoundPassedPlayers(state)).toEqual([0, 2]);

      state = setRoundWinner(state, 1);
      expect(getRoundWinner(state)).toBe(1);
    });

    it('should handle multiple rounds', () => {
      let state = initializeRoundState(4);

      // Round 1
      const card1 = createCard('3', 'Spades', '3s');
      const combo1 = detectSingle([card1]);
      expect(combo1).not.toBeNull();
      state = setLastPlay(state, combo1!, 0);
      state = setRoundWinner(state, 0);
      state = resetRoundState(state);

      // Round 2
      expect(getCurrentRoundNumber(state)).toBe(2);
      const card2 = createCard('5', 'Diamonds', '5d');
      const combo2 = detectSingle([card2]);
      expect(combo2).not.toBeNull();
      state = setLastPlay(state, combo2!, 1);
      state = setRoundWinner(state, 1);
      state = resetRoundState(state);

      // Round 3
      expect(getCurrentRoundNumber(state)).toBe(3);
      expect(getLastPlay(state)).toBeNull();
      expect(getRoundPassedPlayers(state)).toEqual([]);
    });
  });
});
