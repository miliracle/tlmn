/**
 * Round End Detection for Tiến Lên Miền Nam
 *
 * Detects when a round should end based on:
 * - 3 consecutive passes
 * - All remaining players passed
 * - Game end (winner has no cards)
 */

import { ValidationException } from '../../common/exceptions';
import { RoundState } from './roundState';
import { getNextPlayerIndex } from './turnOrder';

/**
 * Context for round end detection
 */
export interface RoundEndDetectionContext {
  /** Current round state */
  roundState: RoundState;
  /** Current player index (0-based) */
  currentPlayerIndex: number;
  /** Array of player hand sizes (number of cards remaining) */
  playerHandSizes: number[];
  /** Array of pass sequence (player indices in order of passing) */
  passSequence: number[];
}

/**
 * Result of round end detection
 */
export interface RoundEndDetectionResult {
  /** Whether the round should end */
  shouldEndRound: boolean;
  /** Reason for round end */
  reason: RoundEndReason | null;
  /** Index of round winner (if round ends) */
  roundWinner: number | null;
  /** Whether the game should end */
  shouldEndGame: boolean;
}

/**
 * Reasons why a round might end
 */
export type RoundEndReason =
  | 'THREE_CONSECUTIVE_PASSES'
  | 'ALL_REMAINING_PASSED'
  | 'PLAYER_WON_ROUND'
  | 'GAME_END';

/**
 * Detects if 3 consecutive players have passed in turn order
 *
 * Rules:
 * - 3 consecutive passes in turn order ends the round
 * - The last player to make a play wins the round
 * - If no one has played yet, the first player wins
 *
 * @param context - Round end detection context
 * @returns true if 3 consecutive passes detected
 */
export function hasThreeConsecutivePasses(context: RoundEndDetectionContext): boolean {
  const { passSequence, roundState } = context;
  const { numPlayers } = roundState;

  // Need at least 3 passes
  if (passSequence.length < 3) {
    return false;
  }

  // Check if the last 3 passes are consecutive in turn order
  const lastThreePasses = passSequence.slice(-3);

  // Check if they are consecutive in counter-clockwise order
  for (let i = 0; i < lastThreePasses.length - 1; i++) {
    const currentPasser = lastThreePasses[i];
    const nextPasser = lastThreePasses[i + 1];
    const expectedNext = getNextPlayerIndex(currentPasser, numPlayers);

    if (nextPasser !== expectedNext) {
      return false;
    }
  }

  return true;
}

/**
 * Detects if all remaining players (except the last player to play) have passed
 *
 * Rules:
 * - If all players except one have passed, the round ends
 * - The non-passing player wins the round
 *
 * @param context - Round end detection context
 * @returns true if all remaining players have passed
 */
export function hasAllRemainingPassed(context: RoundEndDetectionContext): boolean {
  const { roundState } = context;
  const { numPlayers, passedPlayers } = roundState;

  // If all but one have passed, round ends
  return passedPlayers.length >= numPlayers - 1;
}

/**
 * Determines the round winner when round ends due to passes
 *
 * Rules:
 * - If someone has played, the last player to make a play wins
 * - If no one has played, the first player in the round wins
 *
 * @param context - Round end detection context
 * @param firstPlayerIndex - Index of first player in the round (0-based)
 * @returns Index of round winner
 */
export function determineRoundWinnerFromPasses(
  context: RoundEndDetectionContext,
  firstPlayerIndex: number,
): number {
  const { roundState } = context;
  const { lastPlay, lastPlayerIndex } = roundState;

  // If someone has played, the last player to make a play wins
  if (lastPlay && lastPlayerIndex !== null) {
    return lastPlayerIndex;
  }

  // If no one has played, first player wins
  return firstPlayerIndex;
}

/**
 * Determines the round winner when round ends due to passes (with last player index override)
 *
 * @param context - Round end detection context
 * @param firstPlayerIndex - Index of first player in the round (0-based)
 * @param lastPlayerIndexOverride - Optional override for last player index (0-based)
 * @returns Index of round winner
 */
export function determineRoundWinnerFromPassesWithLastPlayer(
  context: RoundEndDetectionContext,
  firstPlayerIndex: number,
  lastPlayerIndexOverride: number | null,
): number {
  const { roundState } = context;
  const { lastPlay } = roundState;

  // Use override if provided, otherwise use roundState
  const lastPlayerIndex = lastPlayerIndexOverride ?? roundState.lastPlayerIndex;

  // If someone has played, the last player to make a play wins
  if (lastPlay && lastPlayerIndex !== null) {
    return lastPlayerIndex;
  }

  // If no one has played, first player wins
  return firstPlayerIndex;
}

/**
 * Checks if a player has won the game (has 0 cards)
 *
 * @param playerHandSizes - Array of player hand sizes
 * @param playerIndex - Index of player to check (0-based)
 * @returns true if player has 0 cards
 */
export function hasPlayerWonGame(playerHandSizes: number[], playerIndex: number): boolean {
  if (playerIndex < 0 || playerIndex >= playerHandSizes.length) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${playerHandSizes.length - 1}.`,
    );
  }

  return playerHandSizes[playerIndex] === 0;
}

/**
 * Detects if the round should end and determines the winner
 *
 * @param context - Round end detection context
 * @param firstPlayerIndex - Index of first player in the round (0-based)
 * @returns RoundEndDetectionResult
 */
export function detectRoundEnd(
  context: RoundEndDetectionContext,
  firstPlayerIndex: number,
): RoundEndDetectionResult {
  const { playerHandSizes, currentPlayerIndex } = context;

  // Check if current player has won the game (0 cards)
  if (hasPlayerWonGame(playerHandSizes, currentPlayerIndex)) {
    return {
      shouldEndRound: true,
      reason: 'GAME_END',
      roundWinner: currentPlayerIndex,
      shouldEndGame: true,
    };
  }

  // Check for 3 consecutive passes
  if (hasThreeConsecutivePasses(context)) {
    const winner = determineRoundWinnerFromPasses(context, firstPlayerIndex);

    return {
      shouldEndRound: true,
      reason: 'THREE_CONSECUTIVE_PASSES',
      roundWinner: winner,
      shouldEndGame: false,
    };
  }

  // Check if all remaining players have passed
  if (hasAllRemainingPassed(context)) {
    const winner = determineRoundWinnerFromPasses(context, firstPlayerIndex);

    return {
      shouldEndRound: true,
      reason: 'ALL_REMAINING_PASSED',
      roundWinner: winner,
      shouldEndGame: false,
    };
  }

  // Round continues
  return {
    shouldEndRound: false,
    reason: null,
    roundWinner: null,
    shouldEndGame: false,
  };
}

/**
 * Gets the player to the winner's right (Hưởng Sái rule)
 *
 * In counter-clockwise order, the player to the right is the next player.
 * This player starts the next round.
 *
 * @param winnerIndex - Index of the round winner (0-based)
 * @param numPlayers - Total number of players (2-4)
 * @returns Index of player to winner's right (next round leader)
 */
export function getPlayerToWinnersRight(winnerIndex: number, numPlayers: number): number {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  if (winnerIndex < 0 || winnerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid winner index: ${winnerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Player to the right is the next player in counter-clockwise order
  return getNextPlayerIndex(winnerIndex, numPlayers);
}
