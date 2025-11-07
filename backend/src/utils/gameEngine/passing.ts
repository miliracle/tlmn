/**
 * Passing System for Tiến Lên Miền Nam
 *
 * Implements the passing mechanism where players can pass their turn.
 * Once a player passes, they cannot play again in the current round.
 * Passed status is reset when a new round begins.
 */

import { ValidationException } from '../../common/exceptions';

/**
 * Passing state interface
 */
export interface PassingState {
  /** Array of player indices who have passed in the current round */
  passedPlayers: number[];
  /** Total number of players in the game */
  numPlayers: number;
}

/**
 * Result of passing a turn
 */
export interface PassTurnResult {
  /** Whether the pass was successful */
  success: boolean;
  /** Updated passing state */
  passingState: PassingState;
  /** Error message if pass failed */
  error?: string;
}

/**
 * Initializes passing state for a new game or round
 *
 * @param numPlayers - Total number of players (2-4)
 * @returns Initialized PassingState with empty passed players array
 */
export function initializePassingState(numPlayers: number): PassingState {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  return {
    passedPlayers: [],
    numPlayers,
  };
}

/**
 * Marks a player as having passed in the current round
 *
 * Rules:
 * - A player can only pass once per round
 * - Once passed, the player cannot play again in the same round
 * - Passing is allowed even if the player has valid moves
 *
 * @param passingState - Current passing state
 * @param playerIndex - Index of player who wants to pass (0-based)
 * @returns PassTurnResult with updated passing state
 */
export function passTurn(passingState: PassingState, playerIndex: number): PassTurnResult {
  const { passedPlayers, numPlayers } = passingState;

  // Validate number of players
  if (numPlayers < 2 || numPlayers > 4) {
    return {
      success: false,
      passingState,
      error: `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    };
  }

  // Validate player index
  if (playerIndex < 0 || playerIndex >= numPlayers) {
    return {
      success: false,
      passingState,
      error: `Invalid player index: ${playerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    };
  }

  // Check if player has already passed
  if (passedPlayers.includes(playerIndex)) {
    return {
      success: false,
      passingState,
      error: `Player ${playerIndex} has already passed in this round.`,
    };
  }

  // Add player to passed players list
  const updatedPassedPlayers = [...passedPlayers, playerIndex];

  return {
    success: true,
    passingState: {
      ...passingState,
      passedPlayers: updatedPassedPlayers,
    },
  };
}

/**
 * Checks if a player has passed in the current round
 *
 * @param passingState - Current passing state
 * @param playerIndex - Index of player to check (0-based)
 * @returns true if player has passed, false otherwise
 */
export function hasPassed(passingState: PassingState, playerIndex: number): boolean {
  const { passedPlayers, numPlayers } = passingState;

  // Validate player index
  if (playerIndex < 0 || playerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  return passedPlayers.includes(playerIndex);
}

/**
 * Resets the passed players list for a new round
 *
 * This should be called when a new round begins to restore playing rights
 * to all players who passed in the previous round.
 *
 * @param passingState - Current passing state
 * @returns Updated PassingState with empty passed players array
 */
export function resetPassedPlayers(passingState: PassingState): PassingState {
  return {
    ...passingState,
    passedPlayers: [],
  };
}

/**
 * Gets the number of players who have passed in the current round
 *
 * @param passingState - Current passing state
 * @returns Number of passed players
 */
export function getPassedPlayersCount(passingState: PassingState): number {
  return passingState.passedPlayers.length;
}

/**
 * Gets the array of player indices who have passed
 *
 * @param passingState - Current passing state
 * @returns Array of player indices who have passed
 */
export function getPassedPlayers(passingState: PassingState): number[] {
  return [...passingState.passedPlayers]; // Return a copy to prevent mutation
}

/**
 * Checks if all players except one have passed
 * (useful for determining if a round should end)
 *
 * @param passingState - Current passing state
 * @returns true if all players except one have passed
 */
export function hasAllButOnePassed(passingState: PassingState): boolean {
  const { passedPlayers, numPlayers } = passingState;
  return passedPlayers.length >= numPlayers - 1;
}

/**
 * Checks if a specific number of consecutive players have passed
 * (useful for determining round end condition: 3 consecutive passes)
 *
 * Note: This checks if the last N players in the passed list are consecutive
 * in turn order. This is a simplified check - a more sophisticated implementation
 * would track the order of passes relative to turn order.
 *
 * @param passingState - Current passing state
 * @param consecutiveCount - Number of consecutive passes required (default: 3)
 * @returns true if the required number of consecutive players have passed
 */
export function hasConsecutivePasses(
  passingState: PassingState,
  consecutiveCount: number = 3,
): boolean {
  const { passedPlayers } = passingState;

  if (passedPlayers.length < consecutiveCount) {
    return false;
  }

  // If all but one have passed, that counts as consecutive passes
  if (hasAllButOnePassed(passingState)) {
    return true;
  }

  // For a more accurate check, we'd need to track the order of passes
  // relative to turn order. For now, if we have enough passes, we consider it valid.
  // This is a simplified implementation - the actual game logic should track
  // the sequence of passes relative to the current turn order.
  return passedPlayers.length >= consecutiveCount;
}
