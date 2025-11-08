/**
 * Thúi Penalty Calculation for Tiến Lên Miền Nam
 *
 * Implements penalty calculation for ending last (về bét) with special cards.
 * If the last-place player has heo (2s) or hàng (special combinations) remaining,
 * they pay additional penalties.
 *
 * Task 2.8.2: Thúi Penalty Calculation
 */

import { Card, RANK_2 } from '../../types/game';
import { PlayerRanking } from './gameEndDetection';
import { hasHeoInHand, hasHangInHand } from './gameEndDetection';
import { detectConsecutivePairs, detectFourOfKind } from './combinations';
import { getHeoPenaltyValue } from './chatPenalty';
import { ValidationException } from '../../common/exceptions';

/**
 * Result of thúi penalty calculation
 */
export interface ThuiPenaltyResult {
  /** Whether the last-place player has thúi (heo or hàng in hand) */
  hasThui: boolean;
  /** Total penalty points to be paid */
  penaltyPoints: number;
  /** Breakdown of penalties */
  breakdown: {
    /** Penalty from heo cards */
    heoPenalty: number;
    /** Penalty from hàng combinations */
    hangPenalty: number;
    /** Number of heo cards in hand */
    heoCount: number;
    /** Number of hàng combinations in hand */
    hangCount: number;
  };
  /** Index of player who receives the penalties */
  receiverIndex: number;
}

/**
 * Checks if last-place player has heo in hand
 *
 * Subtask 2.8.2.1: Check if last-place player has heo in hand
 *
 * @param veBetHand - Hand of the last-place player (về bét)
 * @returns true if hand contains any heo (rank 2)
 */
export function checkVeBetHasHeo(veBetHand: Card[]): boolean {
  return hasHeoInHand(veBetHand);
}

/**
 * Checks if last-place player has hàng in hand
 *
 * Subtask 2.8.2.2: Check if last-place player has hàng in hand
 *
 * @param veBetHand - Hand of the last-place player (về bét)
 * @returns true if hand contains any hàng (3 đôi thông, tứ quý, or 4 đôi thông)
 */
export function checkVeBetHasHang(veBetHand: Card[]): boolean {
  return hasHangInHand(veBetHand);
}

/**
 * Counts heo cards in a hand and calculates their total penalty value
 *
 * @param hand - Player's hand
 * @returns Object with heo count and total penalty value
 */
function countHeoPenalty(hand: Card[]): { count: number; penalty: number } {
  if (!hand || hand.length === 0) {
    return { count: 0, penalty: 0 };
  }

  let count = 0;
  let penalty = 0;

  for (const card of hand) {
    if (card.rank === RANK_2) {
      count++;
      penalty += getHeoPenaltyValue(card.suit);
    }
  }

  return { count, penalty };
}

/**
 * Counts hàng combinations in a hand and calculates their total penalty value
 *
 * Hàng includes:
 * - 3 đôi thông (3 consecutive pairs) = 4 points
 * - Tứ quý (four of a kind) = 4 points
 * - 4 đôi thông (4 consecutive pairs) = 4 points
 *
 * Note: This function counts distinct hàng combinations. If cards overlap
 * (e.g., a card is part of multiple hàng), we count each distinct hàng.
 * However, for simplicity, we use a greedy approach: find all possible hàng
 * and count them, but we should avoid double-counting overlapping combinations.
 *
 * @param hand - Player's hand
 * @returns Object with hàng count and total penalty value
 */
function countHangPenalty(hand: Card[]): { count: number; penalty: number } {
  if (!hand || hand.length === 0) {
    return { count: 0, penalty: 0 };
  }

  let count = 0;
  const usedCards = new Set<string>(); // Track which cards have been used in hàng

  // Check for tứ quý (four of a kind)
  if (hand.length >= 4) {
    for (let i = 0; i <= hand.length - 4; i++) {
      const fourCards = hand.slice(i, i + 4);
      const fourOfKind = detectFourOfKind(fourCards);
      if (fourOfKind) {
        // Check if any of these cards are already used
        const cardIds = fourCards.map((c) => c.id);
        const isUsed = cardIds.some((id) => usedCards.has(id));
        if (!isUsed) {
          count++;
          cardIds.forEach((id) => usedCards.add(id));
        }
      }
    }
  }

  // Check for 3 đôi thông (6 cards = 3 pairs)
  if (hand.length >= 6) {
    for (let i = 0; i <= hand.length - 6; i++) {
      for (let j = i + 6; j <= hand.length; j++) {
        const subset = hand.slice(i, j);
        if (subset.length === 6) {
          const consecutivePairs = detectConsecutivePairs(subset);
          if (consecutivePairs) {
            const cardIds = subset.map((c) => c.id);
            const isUsed = cardIds.some((id) => usedCards.has(id));
            if (!isUsed) {
              count++;
              cardIds.forEach((id) => usedCards.add(id));
            }
          }
        }
      }
    }
  }

  // Check for 4 đôi thông (8 cards = 4 pairs)
  if (hand.length >= 8) {
    for (let i = 0; i <= hand.length - 8; i++) {
      for (let j = i + 8; j <= hand.length; j++) {
        const subset = hand.slice(i, j);
        if (subset.length === 8) {
          const consecutivePairs = detectConsecutivePairs(subset);
          if (consecutivePairs) {
            const cardIds = subset.map((c) => c.id);
            const isUsed = cardIds.some((id) => usedCards.has(id));
            if (!isUsed) {
              count++;
              cardIds.forEach((id) => usedCards.add(id));
            }
          }
        }
      }
    }
  }

  // Each hàng is worth 4 points
  const penalty = count * 4;

  return { count, penalty };
}

/**
 * Calculates thúi penalties for the last-place player
 *
 * Subtask 2.8.2.3: Calculate thúi penalties (heo values + hàng × 4)
 *
 * Penalty calculation:
 * - Each heo (2) in hand: Pay penalty equal to that heo's value (1 or 2 points)
 * - Each hàng (3 đôi thông, tứ quý, 4 đôi thông) in hand: Pay 4 points
 * - Multiple heo or hàng: Penalties are cumulative
 *
 * @param veBetHand - Hand of the last-place player (về bét)
 * @returns Object with penalty breakdown
 */
export function calculateThuiPenalty(veBetHand: Card[]): {
  hasThui: boolean;
  penaltyPoints: number;
  breakdown: {
    heoPenalty: number;
    hangPenalty: number;
    heoCount: number;
    hangCount: number;
  };
} {
  if (!veBetHand || veBetHand.length === 0) {
    return {
      hasThui: false,
      penaltyPoints: 0,
      breakdown: {
        heoPenalty: 0,
        hangPenalty: 0,
        heoCount: 0,
        hangCount: 0,
      },
    };
  }

  const heoResult = countHeoPenalty(veBetHand);
  const hangResult = countHangPenalty(veBetHand);

  const hasThui = heoResult.count > 0 || hangResult.count > 0;
  const totalPenalty = heoResult.penalty + hangResult.penalty;

  return {
    hasThui,
    penaltyPoints: totalPenalty,
    breakdown: {
      heoPenalty: heoResult.penalty,
      hangPenalty: hangResult.penalty,
      heoCount: heoResult.count,
      hangCount: hangResult.count,
    },
  };
}

/**
 * Determines who receives thúi penalties
 *
 * Subtask 2.8.2.4: Determine who receives thúi penalties (3rd place or winner)
 *
 * Rules:
 * - **Normal games:** The player who finished 3rd receives the thúi penalties
 * - **Tới trắng games:** The winner receives the thúi penalties (in addition to other rewards)
 * - **Cóng games:** If the cóng player finishes last (về bét), thúi penalties are added to the winner's total reward
 *
 * @param rankings - Array of player rankings
 * @param isInstantWin - Whether the game ended via instant win (tới trắng)
 * @param congPlayers - Array of player indices who got cóng (stuck)
 * @param veBetIndex - Index of the về bét (last-place) player
 * @returns Index of player who receives thúi penalties
 */
export function determineThuiPenaltyReceiver(
  rankings: PlayerRanking[],
  isInstantWin: boolean,
  congPlayers: number[],
  veBetIndex: number,
): number {
  if (!rankings || rankings.length === 0) {
    throw new ValidationException('Rankings array cannot be empty');
  }

  if (veBetIndex < 0 || veBetIndex >= rankings.length) {
    throw new ValidationException(
      `Invalid về bét index: ${veBetIndex}. Must be between 0 and ${rankings.length - 1}.`,
      undefined,
      { veBetIndex, numPlayers: rankings.length },
    );
  }

  // Tới trắng games: Winner receives thúi penalties
  if (isInstantWin) {
    const winner = rankings.find((r) => r.rank === 1);
    if (!winner) {
      throw new ValidationException('Winner not found in rankings for tới trắng game');
    }
    return winner.playerIndex;
  }

  // Cóng games: If cóng player finishes last, winner receives thúi penalties
  if (congPlayers && congPlayers.length > 0 && congPlayers.includes(veBetIndex)) {
    const winner = rankings.find((r) => r.rank === 1);
    if (!winner) {
      throw new ValidationException('Winner not found in rankings for cóng game');
    }
    return winner.playerIndex;
  }

  // Normal games: 3rd place receives thúi penalties
  // In 2-player games, there's no 3rd place, so winner receives thúi penalties
  const thirdPlace = rankings.find((r) => r.rank === 3);
  if (!thirdPlace) {
    // Check if this is a 2-player game (only winner and 2nd place)
    const numPlayers = rankings.length;
    if (numPlayers === 2) {
      // In 2-player game, winner receives thúi penalties
      const winner = rankings.find((r) => r.rank === 1);
      if (!winner) {
        throw new ValidationException('Winner not found in rankings for 2-player game');
      }
      return winner.playerIndex;
    }
    throw new ValidationException('3rd place player not found in rankings');
  }
  return thirdPlace.playerIndex;
}

/**
 * Calculates complete thúi penalty result
 *
 * This is the main function that combines all thúi penalty logic.
 *
 * @param veBetHand - Hand of the last-place player (về bét)
 * @param rankings - Array of player rankings
 * @param isInstantWin - Whether the game ended via instant win (tới trắng)
 * @param congPlayers - Array of player indices who got cóng (stuck)
 * @param veBetIndex - Index of the về bét (last-place) player
 * @returns Complete ThuiPenaltyResult
 */
export function calculateThuiPenaltyResult(
  veBetHand: Card[],
  rankings: PlayerRanking[],
  isInstantWin: boolean,
  congPlayers: number[],
  veBetIndex: number,
): ThuiPenaltyResult {
  const penaltyCalculation = calculateThuiPenalty(veBetHand);
  const receiverIndex = determineThuiPenaltyReceiver(
    rankings,
    isInstantWin,
    congPlayers,
    veBetIndex,
  );

  return {
    ...penaltyCalculation,
    receiverIndex,
  };
}
