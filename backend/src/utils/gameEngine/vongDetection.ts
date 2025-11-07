/**
 * Vòng Detection for Tiến Lên Miền Nam
 *
 * Implements vòng (round/cycle) detection for cutting rules.
 * A "vòng" exists when at least one player has already played in the current round
 * before the cutting action. The first player in a round cannot cut (no vòng exists yet).
 */

import { ValidationException } from '../../common/exceptions';

/**
 * Vòng state interface
 */
export interface VongState {
  /** Whether any player has played in the current round */
  hasAnyPlayerPlayed: boolean;
  /** Index of the first player in the current round (0-based) */
  firstPlayerIndex: number | null;
  /** Total number of players in the game */
  numPlayers: number;
}

/**
 * Initializes vòng state for a new round
 *
 * @param numPlayers - Total number of players (2-4)
 * @param firstPlayerIndex - Index of the first player in the round (0-based)
 * @returns Initialized VongState
 */
export function initializeVongState(numPlayers: number, firstPlayerIndex: number): VongState {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  if (firstPlayerIndex < 0 || firstPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid first player index: ${firstPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  return {
    hasAnyPlayerPlayed: false,
    firstPlayerIndex,
    numPlayers,
  };
}

/**
 * Marks that a player has played in the current round
 *
 * This should be called whenever a player makes a play (not a pass).
 * Once any player has played, a vòng exists for subsequent players.
 *
 * @param vongState - Current vòng state
 * @param playerIndex - Index of player who played (0-based)
 * @returns Updated VongState
 */
export function markPlayerPlayed(vongState: VongState, playerIndex: number): VongState {
  const { numPlayers } = vongState;

  // Validate player index
  if (playerIndex < 0 || playerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Once any player has played, vòng exists
  return {
    ...vongState,
    hasAnyPlayerPlayed: true,
  };
}

/**
 * Checks if a vòng exists for the current player
 *
 * Rules:
 * - A vòng exists when at least one player has already played in the current round
 * - The first player in a round cannot have vòng (no vòng exists yet)
 * - If any player has played before the current player, a vòng exists
 *
 * @param vongState - Current vòng state
 * @param currentPlayerIndex - Index of current player (0-based)
 * @returns true if vòng exists, false otherwise
 */
export function hasVong(vongState: VongState, currentPlayerIndex: number): boolean {
  const { hasAnyPlayerPlayed, firstPlayerIndex, numPlayers } = vongState;

  // Validate player index
  if (currentPlayerIndex < 0 || currentPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid current player index: ${currentPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Subtask 2.5.1.3: Handle first player exception (no vòng)
  // If this is the first player in the round, no vòng exists yet
  if (firstPlayerIndex !== null && currentPlayerIndex === firstPlayerIndex) {
    return false;
  }

  // Subtask 2.5.1.2: Create hasVong function
  // A vòng exists if any player has played in the current round
  // (and we're not the first player, which is already handled above)
  return hasAnyPlayerPlayed;
}

/**
 * Resets vòng state for a new round
 *
 * This should be called when a new round begins to reset the vòng tracking.
 *
 * @param vongState - Current vòng state
 * @param newFirstPlayerIndex - Index of the first player in the new round (0-based)
 * @returns Updated VongState with reset state
 */
export function resetVongState(vongState: VongState, newFirstPlayerIndex: number): VongState {
  const { numPlayers } = vongState;

  if (newFirstPlayerIndex < 0 || newFirstPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid first player index: ${newFirstPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  return {
    hasAnyPlayerPlayed: false,
    firstPlayerIndex: newFirstPlayerIndex,
    numPlayers,
  };
}

/**
 * Gets whether any player has played in the current round
 *
 * @param vongState - Current vòng state
 * @returns true if any player has played, false otherwise
 */
export function hasAnyPlayerPlayed(vongState: VongState): boolean {
  return vongState.hasAnyPlayerPlayed;
}

/**
 * Gets the index of the first player in the current round
 *
 * @param vongState - Current vòng state
 * @returns Index of first player, or null if not set
 */
export function getFirstPlayerIndex(vongState: VongState): number | null {
  return vongState.firstPlayerIndex;
}
