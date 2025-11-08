/**
 * Cóng Penalty Calculation for Tiến Lên Miền Nam
 *
 * Implements penalty calculation for cóng (stuck) players.
 * Players get cóng if they haven't played any cards when someone else finishes.
 *
 * Task 2.8.3: Cóng Penalty Calculation
 */

import { CongDetectionResult } from './gameEndDetection';
import { DenBaiDetectionResult } from './gameEndDetection';
import { ValidationException } from '../../common/exceptions';

/**
 * Result of cóng penalty calculation
 */
export interface CongPenaltyResult {
  /** Total cóng penalties paid by all cóng players */
  totalCongPenalties: number;
  /** Penalty per cóng player (tới trắng penalty value) */
  penaltyPerCongPlayer: number;
  /** Map of cóng player index to penalty they pay */
  congPlayerPenalties: Map<number, number>;
  /** Total đền bài penalty (if applicable) */
  denBaiPenalty: number;
  /** Index of player who đền bài (if applicable) */
  denBaiPlayerIndex: number | null;
  /** Total cóng penalties received by winner */
  winnerReceives: number;
}

/**
 * Calculates tới trắng penalty value
 *
 * Subtask 2.8.3.1: Calculate tới trắng penalty value (13 × player count)
 *
 * Tới trắng penalty value per loser: 13 points × number of players in the game
 * - 4-player game: 52 points per loser
 * - 3-player game: 39 points per loser
 * - 2-player game: 26 points per loser
 *
 * @param numPlayers - Total number of players in the game (2-4)
 * @returns Tới trắng penalty value per player
 */
export function calculateToiTrangPenalty(numPlayers: number): number {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
      undefined,
      { numPlayers },
    );
  }

  return 13 * numPlayers;
}

/**
 * Calculates cóng penalty for a single cóng player
 *
 * Each cóng player pays: equivalent to "tới trắng" penalty
 *
 * @param numPlayers - Total number of players in the game (2-4)
 * @returns Cóng penalty per player
 */
export function calculateCongPenaltyPerPlayer(numPlayers: number): number {
  return calculateToiTrangPenalty(numPlayers);
}

/**
 * Applies cóng penalty per stuck player
 *
 * Subtask 2.8.3.2: Apply cóng penalty per stuck player
 *
 * Rules:
 * - Each cóng player pays: equivalent to "tới trắng" penalty
 * - Cóng 1 nhà: 1 player pays penalty
 * - Cóng 2 nhà: 2 players pay penalty each
 * - Cóng 3 nhà: 3 players pay penalty each
 *
 * @param congResult - Cóng detection result
 * @param numPlayers - Total number of players in the game (2-4)
 * @returns Map of cóng player index to penalty they pay
 */
export function applyCongPenaltyPerPlayer(
  congResult: CongDetectionResult,
  numPlayers: number,
): Map<number, number> {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
      undefined,
      { numPlayers },
    );
  }

  const penaltyPerPlayer = calculateCongPenaltyPerPlayer(numPlayers);
  const penaltyMap = new Map<number, number>();

  // Each cóng player pays the same penalty (tới trắng penalty value)
  for (const playerIndex of congResult.congPlayers) {
    penaltyMap.set(playerIndex, penaltyPerPlayer);
  }

  return penaltyMap;
}

/**
 * Calculates total cóng penalties from all cóng players
 *
 * @param congResult - Cóng detection result
 * @param numPlayers - Total number of players in the game (2-4)
 * @returns Total penalty points from all cóng players
 */
export function calculateTotalCongPenalties(
  congResult: CongDetectionResult,
  numPlayers: number,
): number {
  const penaltyPerPlayer = calculateCongPenaltyPerPlayer(numPlayers);
  return penaltyPerPlayer * congResult.congCount;
}

/**
 * Handles đền bài penalty calculation
 *
 * Subtask 2.8.3.3: Handle đền bài penalty (all cóng penalties)
 *
 * Rules:
 * - Đền bài only applies in cóng 3 nhà (3 players stuck)
 * - The player who đền bài must pay the equivalent of all cóng penalties
 * - As if they were responsible for all stuck players
 * - Winner still receives full reward from all penalties
 *
 * @param congResult - Cóng detection result
 * @param denBaiResult - Đền bài detection result
 * @param numPlayers - Total number of players in the game (2-4)
 * @returns Object with đền bài penalty and player index, or null if not applicable
 */
export function handleDenBaiPenalty(
  congResult: CongDetectionResult,
  denBaiResult: DenBaiDetectionResult,
  numPlayers: number,
): { penalty: number; playerIndex: number } | null {
  // Đền bài only applies in cóng 3 nhà
  if (!congResult.isCong3Nha) {
    return null;
  }

  // Check if any player đền bài
  if (!denBaiResult.hasDenBai || denBaiResult.denBaiPlayers.length === 0) {
    return null;
  }

  // In cóng 3 nhà, there should be exactly one player who đền bài
  if (denBaiResult.denBaiPlayers.length !== 1) {
    throw new ValidationException(
      `Expected exactly 1 đền bài player in cóng 3 nhà, but found ${denBaiResult.denBaiPlayers.length}`,
      undefined,
      { denBaiPlayers: denBaiResult.denBaiPlayers },
    );
  }

  const denBaiPlayerIndex = denBaiResult.denBaiPlayers[0];

  // Đền bài penalty = all cóng penalties (as if responsible for all stuck players)
  const totalCongPenalties = calculateTotalCongPenalties(congResult, numPlayers);

  return {
    penalty: totalCongPenalties,
    playerIndex: denBaiPlayerIndex,
  };
}

/**
 * Calculates total cóng penalties received by winner
 *
 * Subtask 2.8.3.4: Apply cóng penalty to winner's total
 *
 * The winner receives:
 * - All cóng penalties from cóng players
 * - Đền bài penalty (if applicable)
 *
 * @param congResult - Cóng detection result
 * @param denBaiResult - Đền bài detection result
 * @param numPlayers - Total number of players in the game (2-4)
 * @returns Total cóng penalties received by winner
 */
export function calculateWinnerCongPenalties(
  congResult: CongDetectionResult,
  denBaiResult: DenBaiDetectionResult,
  numPlayers: number,
): number {
  // Winner receives all cóng penalties
  const totalCongPenalties = calculateTotalCongPenalties(congResult, numPlayers);

  // Winner also receives đền bài penalty (if applicable)
  const denBaiInfo = handleDenBaiPenalty(congResult, denBaiResult, numPlayers);
  const denBaiPenalty = denBaiInfo ? denBaiInfo.penalty : 0;

  // Winner receives both cóng penalties and đền bài penalty
  return totalCongPenalties + denBaiPenalty;
}

/**
 * Calculates complete cóng penalty result
 *
 * This is the main function that combines all cóng penalty logic.
 *
 * @param congResult - Cóng detection result
 * @param denBaiResult - Đền bài detection result
 * @param numPlayers - Total number of players in the game (2-4)
 * @returns Complete CongPenaltyResult
 */
export function calculateCongPenaltyResult(
  congResult: CongDetectionResult,
  denBaiResult: DenBaiDetectionResult,
  numPlayers: number,
): CongPenaltyResult {
  const penaltyPerPlayer = calculateCongPenaltyPerPlayer(numPlayers);
  const congPlayerPenalties = applyCongPenaltyPerPlayer(congResult, numPlayers);
  const totalCongPenalties = calculateTotalCongPenalties(congResult, numPlayers);

  const denBaiInfo = handleDenBaiPenalty(congResult, denBaiResult, numPlayers);
  const denBaiPenalty = denBaiInfo ? denBaiInfo.penalty : 0;
  const denBaiPlayerIndex = denBaiInfo ? denBaiInfo.playerIndex : null;

  const winnerReceives = calculateWinnerCongPenalties(congResult, denBaiResult, numPlayers);

  return {
    totalCongPenalties,
    penaltyPerCongPlayer: penaltyPerPlayer,
    congPlayerPenalties,
    denBaiPenalty,
    denBaiPlayerIndex,
    winnerReceives,
  };
}
