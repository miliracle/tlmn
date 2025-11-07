/**
 * Turn Order Management for Tiến Lên Miền Nam
 *
 * Implements counter-clockwise turn order (right-hand direction) and turn tracking.
 */

import { ValidationException } from '../../common/exceptions';

/**
 * Default turn timeout in milliseconds (15 seconds)
 */
export const TURN_TIMEOUT_MS = 15 * 1000;

/**
 * Turn order state interface
 */
export interface TurnOrderState {
  /** Current player index (0-based) */
  currentPlayerIndex: number;
  /** Total number of players in the game */
  numPlayers: number;
  /** Timestamp when current turn started (in milliseconds) */
  turnStartTime?: number;
}

/**
 * Result of turn advancement
 */
export interface AdvanceTurnResult {
  /** New current player index */
  newPlayerIndex: number;
  /** Whether the turn was successfully advanced */
  success: boolean;
  /** Error message if advancement failed */
  error?: string;
}

/**
 * Calculates the next player index in counter-clockwise order (right-hand direction)
 *
 * In counter-clockwise order:
 * - Player 0 -> Player 1 -> Player 2 -> Player 3 -> Player 0
 * - For 3 players: Player 0 -> Player 1 -> Player 2 -> Player 0
 * - For 2 players: Player 0 -> Player 1 -> Player 0
 *
 * @param currentPlayerIndex - Current player index (0-based)
 * @param numPlayers - Total number of players (2-4)
 * @returns Next player index in counter-clockwise order
 */
export function getNextPlayerIndex(currentPlayerIndex: number, numPlayers: number): number {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  if (currentPlayerIndex < 0 || currentPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid current player index: ${currentPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Counter-clockwise: increment index, wrap around at numPlayers
  return (currentPlayerIndex + 1) % numPlayers;
}

/**
 * Gets the previous player index in counter-clockwise order
 * (useful for finding who played before current player)
 *
 * @param currentPlayerIndex - Current player index (0-based)
 * @param numPlayers - Total number of players (2-4)
 * @returns Previous player index in counter-clockwise order
 */
export function getPreviousPlayerIndex(currentPlayerIndex: number, numPlayers: number): number {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  if (currentPlayerIndex < 0 || currentPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid current player index: ${currentPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Counter-clockwise previous: decrement index, wrap around
  return (currentPlayerIndex - 1 + numPlayers) % numPlayers;
}

/**
 * Initializes turn order state for a new game or round
 *
 * @param startingPlayerIndex - Index of player who should start (0-based)
 * @param numPlayers - Total number of players (2-4)
 * @param turnStartTime - Optional timestamp when turn started (defaults to current time)
 * @returns Initialized TurnOrderState
 */
export function initializeTurnOrder(
  startingPlayerIndex: number,
  numPlayers: number,
  turnStartTime?: number,
): TurnOrderState {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  if (startingPlayerIndex < 0 || startingPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid starting player index: ${startingPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  return {
    currentPlayerIndex: startingPlayerIndex,
    numPlayers,
    turnStartTime: turnStartTime ?? Date.now(),
  };
}

/**
 * Advances turn to the next player in counter-clockwise order
 *
 * @param turnState - Current turn order state
 * @param skipPlayers - Optional array of player indices to skip (e.g., passed players)
 * @returns AdvanceTurnResult with new player index
 */
export function advanceTurn(
  turnState: TurnOrderState,
  skipPlayers: number[] = [],
): AdvanceTurnResult {
  const { currentPlayerIndex, numPlayers } = turnState;

  if (numPlayers < 2 || numPlayers > 4) {
    return {
      success: false,
      newPlayerIndex: currentPlayerIndex,
      error: `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    };
  }

  if (currentPlayerIndex < 0 || currentPlayerIndex >= numPlayers) {
    return {
      success: false,
      newPlayerIndex: currentPlayerIndex,
      error: `Invalid current player index: ${currentPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    };
  }

  // Validate skipPlayers array
  const invalidSkipPlayers = skipPlayers.filter((idx) => idx < 0 || idx >= numPlayers);
  if (invalidSkipPlayers.length > 0) {
    return {
      success: false,
      newPlayerIndex: currentPlayerIndex,
      error: `Invalid skip player indices: ${invalidSkipPlayers.join(', ')}`,
    };
  }

  // If all players are skipped, return error
  if (skipPlayers.length >= numPlayers) {
    return {
      success: false,
      newPlayerIndex: currentPlayerIndex,
      error: 'Cannot advance turn: all players are skipped',
    };
  }

  // Find next player, skipping passed players
  let nextPlayerIndex = getNextPlayerIndex(currentPlayerIndex, numPlayers);
  let attempts = 0;
  const maxAttempts = numPlayers; // Prevent infinite loop

  while (skipPlayers.includes(nextPlayerIndex) && attempts < maxAttempts) {
    nextPlayerIndex = getNextPlayerIndex(nextPlayerIndex, numPlayers);
    attempts++;
  }

  if (attempts >= maxAttempts) {
    return {
      success: false,
      newPlayerIndex: currentPlayerIndex,
      error: 'Failed to find next player: all players are skipped',
    };
  }

  return {
    success: true,
    newPlayerIndex: nextPlayerIndex,
  };
}

/**
 * Checks if the current turn has timed out
 *
 * @param turnState - Current turn order state
 * @param timeoutMs - Turn timeout in milliseconds (defaults to TURN_TIMEOUT_MS)
 * @returns true if turn has timed out, false otherwise
 */
export function isTurnTimedOut(
  turnState: TurnOrderState,
  timeoutMs: number = TURN_TIMEOUT_MS,
): boolean {
  if (!turnState.turnStartTime) {
    // No start time recorded, cannot determine timeout
    return false;
  }

  const elapsed = Date.now() - turnState.turnStartTime;
  return elapsed >= timeoutMs;
}

/**
 * Gets the remaining time for the current turn in milliseconds
 *
 * @param turnState - Current turn order state
 * @param timeoutMs - Turn timeout in milliseconds (defaults to TURN_TIMEOUT_MS)
 * @returns Remaining time in milliseconds, or 0 if timed out or no start time
 */
export function getRemainingTurnTime(
  turnState: TurnOrderState,
  timeoutMs: number = TURN_TIMEOUT_MS,
): number {
  if (!turnState.turnStartTime) {
    return 0;
  }

  const elapsed = Date.now() - turnState.turnStartTime;
  const remaining = timeoutMs - elapsed;
  return Math.max(0, remaining);
}

/**
 * Updates the turn start time for the current turn
 *
 * @param turnState - Current turn order state
 * @param turnStartTime - Optional timestamp (defaults to current time)
 * @returns Updated TurnOrderState
 */
export function updateTurnStartTime(
  turnState: TurnOrderState,
  turnStartTime?: number,
): TurnOrderState {
  return {
    ...turnState,
    turnStartTime: turnStartTime ?? Date.now(),
  };
}

/**
 * Sets the current player index (useful for starting a new round with a specific player)
 *
 * @param turnState - Current turn order state
 * @param newPlayerIndex - New current player index
 * @param resetTurnTime - Whether to reset turn start time (defaults to true)
 * @returns Updated TurnOrderState
 */
export function setCurrentPlayer(
  turnState: TurnOrderState,
  newPlayerIndex: number,
  resetTurnTime: boolean = true,
): TurnOrderState {
  if (newPlayerIndex < 0 || newPlayerIndex >= turnState.numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${newPlayerIndex}. Must be between 0 and ${turnState.numPlayers - 1}.`,
    );
  }

  return {
    ...turnState,
    currentPlayerIndex: newPlayerIndex,
    turnStartTime: resetTurnTime ? Date.now() : turnState.turnStartTime,
  };
}
