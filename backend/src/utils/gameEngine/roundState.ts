/**
 * Round State Tracking for Tiến Lên Miền Nam
 *
 * Tracks round-level state including:
 * - Current round number
 * - Last play in the round
 * - Passed players array
 * - Round winner
 */

import { ValidationException } from '../../common/exceptions';
import { CardCombination } from './combinations';

/**
 * Round state interface
 */
export interface RoundState {
  /** Current round number (starts at 1) */
  currentRoundNumber: number;
  /** Last play in the current round (null if no play yet) */
  lastPlay: CardCombination | null;
  /** Index of last player who made a play (null if no play yet) */
  lastPlayerIndex: number | null;
  /** Array of player indices who have passed in the current round */
  passedPlayers: number[];
  /** Index of the round winner (null if round not finished) */
  roundWinner: number | null;
  /** Total number of players in the game */
  numPlayers: number;
}

/**
 * Initializes round state for a new game
 *
 * @param numPlayers - Total number of players (2-4)
 * @returns Initialized RoundState with round number 1 and empty state
 */
export function initializeRoundState(numPlayers: number): RoundState {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  return {
    currentRoundNumber: 1,
    lastPlay: null,
    lastPlayerIndex: null,
    passedPlayers: [],
    roundWinner: null,
    numPlayers,
  };
}

/**
 * Gets the current round number
 *
 * @param roundState - Current round state
 * @returns Current round number
 */
export function getCurrentRoundNumber(roundState: RoundState): number {
  return roundState.currentRoundNumber;
}

/**
 * Sets the last play in the current round
 *
 * This should be called whenever a player makes a valid play (not a pass).
 * The last play is used to validate subsequent plays in the same round.
 *
 * @param roundState - Current round state
 * @param combination - The combination that was played
 * @param playerIndex - Index of player who made the play (0-based)
 * @returns Updated RoundState with new last play
 */
export function setLastPlay(
  roundState: RoundState,
  combination: CardCombination,
  playerIndex: number,
): RoundState {
  const { numPlayers } = roundState;

  // Validate player index
  if (playerIndex < 0 || playerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  return {
    ...roundState,
    lastPlay: combination,
    lastPlayerIndex: playerIndex,
  };
}

/**
 * Gets the last play in the current round
 *
 * @param roundState - Current round state
 * @returns Last play combination, or null if no play yet
 */
export function getLastPlay(roundState: RoundState): CardCombination | null {
  return roundState.lastPlay;
}

/**
 * Adds a player to the passed players array
 *
 * This should be called when a player passes their turn.
 * Once a player passes, they cannot play again in the current round.
 *
 * @param roundState - Current round state
 * @param playerIndex - Index of player who passed (0-based)
 * @returns Updated RoundState with player added to passed players
 */
export function addPassedPlayer(roundState: RoundState, playerIndex: number): RoundState {
  const { passedPlayers, numPlayers } = roundState;

  // Validate player index
  if (playerIndex < 0 || playerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Check if player has already passed
  if (passedPlayers.includes(playerIndex)) {
    throw new ValidationException(`Player ${playerIndex} has already passed in this round.`);
  }

  // Add player to passed players list
  return {
    ...roundState,
    passedPlayers: [...passedPlayers, playerIndex],
  };
}

/**
 * Gets the array of player indices who have passed in the current round
 *
 * @param roundState - Current round state
 * @returns Array of player indices who have passed
 */
export function getRoundPassedPlayers(roundState: RoundState): number[] {
  return [...roundState.passedPlayers]; // Return a copy to prevent mutation
}

/**
 * Checks if a player has passed in the current round
 *
 * @param roundState - Current round state
 * @param playerIndex - Index of player to check (0-based)
 * @returns true if player has passed, false otherwise
 */
export function hasPlayerPassed(roundState: RoundState, playerIndex: number): boolean {
  const { passedPlayers, numPlayers } = roundState;

  // Validate player index
  if (playerIndex < 0 || playerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  return passedPlayers.includes(playerIndex);
}

/**
 * Sets the round winner
 *
 * This should be called when a round ends and a winner is determined.
 * The winner is typically the player who played all their cards or
 * the last player to make a play before the round ended.
 *
 * @param roundState - Current round state
 * @param playerIndex - Index of the round winner (0-based)
 * @returns Updated RoundState with round winner set
 */
export function setRoundWinner(roundState: RoundState, playerIndex: number): RoundState {
  const { numPlayers } = roundState;

  // Validate player index
  if (playerIndex < 0 || playerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  return {
    ...roundState,
    roundWinner: playerIndex,
  };
}

/**
 * Gets the round winner
 *
 * @param roundState - Current round state
 * @returns Index of round winner, or null if round not finished
 */
export function getRoundWinner(roundState: RoundState): number | null {
  return roundState.roundWinner;
}

/**
 * Checks if the round has a winner
 *
 * @param roundState - Current round state
 * @returns true if round has a winner, false otherwise
 */
export function hasRoundWinner(roundState: RoundState): boolean {
  return roundState.roundWinner !== null;
}

/**
 * Resets round state for a new round
 *
 * This should be called when transitioning to a new round.
 * Resets last play, passed players, and round winner, but increments round number.
 *
 * @param roundState - Current round state
 * @returns Updated RoundState for the new round
 */
export function resetRoundState(roundState: RoundState): RoundState {
  return {
    ...roundState,
    lastPlay: null,
    lastPlayerIndex: null,
    passedPlayers: [],
    roundWinner: null,
    currentRoundNumber: roundState.currentRoundNumber + 1,
  };
}

/**
 * Increments the round number
 *
 * This is typically called automatically by resetRoundState,
 * but can be called separately if needed.
 *
 * @param roundState - Current round state
 * @returns Updated RoundState with incremented round number
 */
export function incrementRoundNumber(roundState: RoundState): RoundState {
  return {
    ...roundState,
    currentRoundNumber: roundState.currentRoundNumber + 1,
  };
}
