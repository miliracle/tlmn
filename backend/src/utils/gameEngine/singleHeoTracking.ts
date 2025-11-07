/**
 * Single Heo Tracking for Tiến Lên Miền Nam
 *
 * Tracks consecutive single heo (2s) plays for cutting rules.
 * Distinguishes between single heo plays and đôi heo (pair of 2s) plays.
 */

import { Card, RANK_2 } from '../../types/game';
import { CardCombination } from './combinations';
import { ValidationException } from '../../common/exceptions';

/**
 * Single heo tracking state interface
 */
export interface SingleHeoTrackingState {
  /** Array of consecutive single heo plays (each entry is a single heo card) */
  consecutiveSingleHeos: Card[];
  /** Total number of players in the game */
  numPlayers: number;
}

/**
 * Initializes single heo tracking state for a new round
 *
 * @param numPlayers - Total number of players (2-4)
 * @returns Initialized SingleHeoTrackingState
 */
export function initializeSingleHeoTracking(numPlayers: number): SingleHeoTrackingState {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  return {
    consecutiveSingleHeos: [],
    numPlayers,
  };
}

/**
 * Records a play and updates single heo tracking
 *
 * Rules:
 * - If the play is a single heo (single card with rank 2), add it to the sequence
 * - If the play is đôi heo (pair of 2s), reset the sequence (đôi heo breaks the chain)
 * - If the play is 3 con heo (triple of 2s), reset the sequence
 * - If the play is not a heo at all, reset the sequence
 * - If the play is a combination that includes heo but is not a single heo, reset the sequence
 *
 * @param trackingState - Current tracking state
 * @param combination - The combination that was played
 * @returns Updated SingleHeoTrackingState
 */
export function recordPlay(
  trackingState: SingleHeoTrackingState,
  combination: CardCombination,
): SingleHeoTrackingState {
  const { consecutiveSingleHeos } = trackingState;

  // Subtask 2.5.2.2: Distinguish between single heo vs đôi heo
  // Check if this is a single heo play
  if (isSingleHeo(combination)) {
    // Subtask 2.5.2.1: Track consecutive single heo plays
    // Add this single heo to the sequence
    return {
      ...trackingState,
      consecutiveSingleHeos: [...consecutiveSingleHeos, combination.cards[0]],
    };
  }

  // Subtask 2.5.2.3: Reset tracking on new round or non-heo play
  // Any other play (đôi heo, 3 con heo, non-heo, etc.) resets the sequence
  return {
    ...trackingState,
    consecutiveSingleHeos: [],
  };
}

/**
 * Checks if a combination is a single heo (single card with rank 2)
 *
 * @param combination - The combination to check
 * @returns true if it's a single heo, false otherwise
 */
export function isSingleHeo(combination: CardCombination): boolean {
  // Must be a single card
  if (combination.type !== 'single' || combination.cards.length !== 1) {
    return false;
  }

  // Must be rank 2 (heo)
  return combination.cards[0].rank === RANK_2;
}

/**
 * Checks if a combination is đôi heo (pair of 2s)
 *
 * @param combination - The combination to check
 * @returns true if it's đôi heo, false otherwise
 */
export function isDoiHeo(combination: CardCombination): boolean {
  // Must be a pair
  if (combination.type !== 'pair' || combination.cards.length !== 2) {
    return false;
  }

  // Both cards must be rank 2 (heo)
  return combination.cards[0].rank === RANK_2 && combination.cards[1].rank === RANK_2;
}

/**
 * Checks if a combination is 3 con heo (triple of 2s)
 *
 * @param combination - The combination to check
 * @returns true if it's 3 con heo, false otherwise
 */
export function isBaConHeo(combination: CardCombination): boolean {
  // Must be a triple
  if (combination.type !== 'triple' || combination.cards.length !== 3) {
    return false;
  }

  // All three cards must be rank 2 (heo)
  return (
    combination.cards[0].rank === RANK_2 &&
    combination.cards[1].rank === RANK_2 &&
    combination.cards[2].rank === RANK_2
  );
}

/**
 * Gets the count of consecutive single heos in the current sequence
 *
 * Subtask 2.5.2.4: Count how many single heo in sequence
 *
 * @param trackingState - Current tracking state
 * @returns Number of consecutive single heos (0-4)
 */
export function getConsecutiveSingleHeoCount(trackingState: SingleHeoTrackingState): number {
  return trackingState.consecutiveSingleHeos.length;
}

/**
 * Gets the array of consecutive single heos
 *
 * @param trackingState - Current tracking state
 * @returns Array of single heo cards (copy to prevent mutation)
 */
export function getConsecutiveSingleHeos(trackingState: SingleHeoTrackingState): Card[] {
  return [...trackingState.consecutiveSingleHeos];
}

/**
 * Resets the single heo tracking for a new round
 *
 * @param trackingState - Current tracking state
 * @returns Updated SingleHeoTrackingState with reset sequence
 */
export function resetSingleHeoTracking(
  trackingState: SingleHeoTrackingState,
): SingleHeoTrackingState {
  return {
    ...trackingState,
    consecutiveSingleHeos: [],
  };
}
