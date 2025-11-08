/**
 * Game Score Calculation for Tiến Lên Miền Nam
 *
 * Implements complete game score calculation for winners and losers.
 * Combines card points, cóng penalties, chặt penalties, and thúi penalties.
 *
 * Task 2.8.4: Game Score Calculation
 */

import { Card } from '../../types/game';
import { PlayerRanking } from './gameEndDetection';
import { CongPenaltyResult } from './congPenalty';
import { calculateToiTrangPenalty } from './congPenalty';
import {
  GamePenaltyState,
  getPlayerPenaltiesPaid,
  getPlayerPenaltiesReceived,
} from './chatPenalty';
import { ThuiPenaltyResult } from './thuiPenalty';
import { ValidationException } from '../../common/exceptions';

/**
 * Score breakdown for a single player
 */
export interface PlayerScore {
  /** Player index (0-based) */
  playerIndex: number;
  /** Total score (positive for winner, negative for losers) */
  totalScore: number;
  /** Breakdown of score components */
  breakdown: {
    /** Card points (1 per card remaining in losers, or negative for losers) */
    cardPoints: number;
    /** Cóng penalties (received if winner, paid if cóng player) */
    congPenalties: number;
    /** Chặt penalties (received if performed cutting, paid if was cut) */
    chatPenalties: number;
    /** Thúi penalties (received if 3rd place/winner, paid if về bét) */
    thuiPenalties: number;
    /** Đền bài penalty (paid if đền bài player) */
    denBaiPenalty: number;
  };
}

/**
 * Complete game score result
 */
export interface GameScoreResult {
  /** Array of player scores */
  playerScores: PlayerScore[];
  /** Index of the winner */
  winnerIndex: number;
  /** Whether the game ended via instant win (tới trắng) */
  isInstantWin: boolean;
}

/**
 * Calculates winner's card points
 *
 * Subtask 2.8.4.1: Calculate winner's card points (1 per card remaining in losers)
 *
 * Each card remaining in other players' hands = 1 point per card
 * Example: If Player A wins and Players B, C, D have 8, 6, 11 cards remaining respectively,
 * Player A receives 8 + 6 + 11 = 25 card points
 *
 * @param playerHands - Array of player hands
 * @param winnerIndex - Index of the winner (0-based)
 * @returns Total card points received by winner
 */
export function calculateWinnerCardPoints(playerHands: Card[][], winnerIndex: number): number {
  if (!playerHands || playerHands.length === 0) {
    throw new ValidationException('Player hands array cannot be empty');
  }

  if (winnerIndex < 0 || winnerIndex >= playerHands.length) {
    throw new ValidationException(
      `Invalid winner index: ${winnerIndex}. Must be between 0 and ${playerHands.length - 1}.`,
      undefined,
      { winnerIndex, numPlayers: playerHands.length },
    );
  }

  let totalCardPoints = 0;

  // Sum up cards remaining in all losers' hands
  for (let i = 0; i < playerHands.length; i++) {
    if (i !== winnerIndex) {
      totalCardPoints += playerHands[i].length;
    }
  }

  return totalCardPoints;
}

/**
 * Calculates winner's total points
 *
 * Subtask 2.8.4.2: Calculate winner's total points (cards + cóng + chặt received + thúi)
 *
 * Winner's Total Points = Card Points + Cóng Penalties + Chặt Penalties + Thúi Penalties
 *
 * @param playerHands - Array of player hands
 * @param winnerIndex - Index of the winner (0-based)
 * @param congPenaltyResult - Cóng penalty calculation result
 * @param chatPenaltyState - Chặt penalty tracking state
 * @param thuiPenaltyResult - Thúi penalty calculation result (if applicable)
 * @returns Total points received by winner
 */
export function calculateWinnerTotalPoints(
  playerHands: Card[][],
  winnerIndex: number,
  congPenaltyResult: CongPenaltyResult,
  chatPenaltyState: GamePenaltyState,
  thuiPenaltyResult: ThuiPenaltyResult | null,
): number {
  // Card points
  const cardPoints = calculateWinnerCardPoints(playerHands, winnerIndex);

  // Cóng penalties (winner receives all cóng penalties)
  const congPenalties = congPenaltyResult.winnerReceives;

  // Chặt penalties (winner receives penalties from cutting)
  const chatPenalties = getPlayerPenaltiesReceived(chatPenaltyState, winnerIndex);

  // Thúi penalties (winner receives if they're the receiver)
  let thuiPenalties = 0;
  if (
    thuiPenaltyResult &&
    thuiPenaltyResult.hasThui &&
    thuiPenaltyResult.receiverIndex === winnerIndex
  ) {
    thuiPenalties = thuiPenaltyResult.penaltyPoints;
  }

  return cardPoints + congPenalties + chatPenalties + thuiPenalties;
}

/**
 * Calculates loser points
 *
 * Subtask 2.8.4.3: Calculate loser points (negative: cards + cóng + chặt paid + thúi)
 *
 * Each player who did not win loses points equal to:
 * - (Number of cards remaining in their hand) + (Cóng penalty if applicable) + (Chặt penalties paid) + (Thúi penalties if last place)
 *
 * @param playerHands - Array of player hands
 * @param playerIndex - Index of the loser (0-based)
 * @param winnerIndex - Index of the winner (0-based)
 * @param rankings - Array of player rankings
 * @param congPenaltyResult - Cóng penalty calculation result
 * @param chatPenaltyState - Chặt penalty tracking state
 * @param thuiPenaltyResult - Thúi penalty calculation result (if applicable)
 * @returns Negative points lost by the loser
 */
export function calculateLoserPoints(
  playerHands: Card[][],
  playerIndex: number,
  winnerIndex: number,
  rankings: PlayerRanking[],
  congPenaltyResult: CongPenaltyResult,
  chatPenaltyState: GamePenaltyState,
  thuiPenaltyResult: ThuiPenaltyResult | null,
): number {
  if (playerIndex === winnerIndex) {
    throw new ValidationException('Cannot calculate loser points for winner', undefined, {
      playerIndex,
      winnerIndex,
    });
  }

  // Card points (negative: number of cards remaining)
  const cardPoints = -playerHands[playerIndex].length;

  // Cóng penalty (if this player got cóng)
  const congPenalty = congPenaltyResult.congPlayerPenalties.get(playerIndex) || 0;
  const congPenalties = -congPenalty; // Negative because they pay

  // Đền bài penalty (if this player đền bài)
  let denBaiPenalty = 0;
  if (congPenaltyResult.denBaiPlayerIndex === playerIndex) {
    denBaiPenalty = -congPenaltyResult.denBaiPenalty; // Negative because they pay
  }

  // Chặt penalties (negative: penalties paid)
  const chatPenalties = -getPlayerPenaltiesPaid(chatPenaltyState, playerIndex);

  // Thúi penalties (if this player is về bét and has thúi)
  let thuiPenalties = 0;
  if (thuiPenaltyResult && thuiPenaltyResult.hasThui) {
    const veBet = rankings.find((r) => r.rank === Math.max(...rankings.map((r) => r.rank)));
    if (veBet && veBet.playerIndex === playerIndex) {
      thuiPenalties = -thuiPenaltyResult.penaltyPoints; // Negative because they pay
    }
  }

  return cardPoints + congPenalties + chatPenalties + thuiPenalties + denBaiPenalty;
}

/**
 * Calculates tới trắng scoring
 *
 * Subtask 2.8.4.4: Calculate tới trắng scoring
 *
 * Tới Trắng Scoring:
 * - Winner receives: tới trắng penalty from all other players
 * - Tới trắng penalty value per loser: 13 points × number of players in the game
 * - Total winner receives: (13 × number of players) × (number of losers)
 * - Additionally, if any loser has heo or hàng in hand, thúi penalties apply (received by winner)
 *
 * @param numPlayers - Total number of players in the game (2-4)
 * @param winnerIndex - Index of the winner (0-based)
 * @param thuiPenaltyResult - Thúi penalty calculation result (if applicable)
 * @returns Object with winner's tới trắng points and loser penalties
 */
export function calculateToiTrangScoring(
  numPlayers: number,
  winnerIndex: number,
  thuiPenaltyResult: ThuiPenaltyResult | null,
): {
  winnerReceives: number;
  loserPenalties: Map<number, number>;
} {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
      undefined,
      { numPlayers },
    );
  }

  if (winnerIndex < 0 || winnerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid winner index: ${winnerIndex}. Must be between 0 and ${numPlayers - 1}.`,
      undefined,
      { winnerIndex, numPlayers },
    );
  }

  const toiTrangPenaltyPerLoser = calculateToiTrangPenalty(numPlayers);
  const numLosers = numPlayers - 1;

  // Each loser pays tới trắng penalty
  const loserPenalties = new Map<number, number>();
  for (let i = 0; i < numPlayers; i++) {
    if (i !== winnerIndex) {
      loserPenalties.set(i, toiTrangPenaltyPerLoser);
    }
  }

  // Winner receives: (tới trắng penalty per loser) × (number of losers)
  let winnerReceives = toiTrangPenaltyPerLoser * numLosers;

  // Additionally, if any loser has heo or hàng in hand, thúi penalties apply (received by winner)
  if (
    thuiPenaltyResult &&
    thuiPenaltyResult.hasThui &&
    thuiPenaltyResult.receiverIndex === winnerIndex
  ) {
    winnerReceives += thuiPenaltyResult.penaltyPoints;
  }

  return {
    winnerReceives,
    loserPenalties,
  };
}

/**
 * Calculates complete game score breakdown
 *
 * Subtask 2.8.4.5: Return complete score breakdown
 *
 * This is the main function that combines all score calculation logic.
 *
 * @param playerHands - Array of player hands
 * @param winnerIndex - Index of the winner (0-based)
 * @param rankings - Array of player rankings
 * @param isInstantWin - Whether the game ended via instant win (tới trắng)
 * @param congPenaltyResult - Cóng penalty calculation result
 * @param chatPenaltyState - Chặt penalty tracking state
 * @param thuiPenaltyResult - Thúi penalty calculation result (if applicable)
 * @returns Complete GameScoreResult
 */
export function calculateGameScore(
  playerHands: Card[][],
  winnerIndex: number,
  rankings: PlayerRanking[],
  isInstantWin: boolean,
  congPenaltyResult: CongPenaltyResult,
  chatPenaltyState: GamePenaltyState,
  thuiPenaltyResult: ThuiPenaltyResult | null,
): GameScoreResult {
  if (!playerHands || playerHands.length === 0) {
    throw new ValidationException('Player hands array cannot be empty');
  }

  if (winnerIndex < 0 || winnerIndex >= playerHands.length) {
    throw new ValidationException(
      `Invalid winner index: ${winnerIndex}. Must be between 0 and ${playerHands.length - 1}.`,
      undefined,
      { winnerIndex, numPlayers: playerHands.length },
    );
  }

  const numPlayers = playerHands.length;
  const playerScores: PlayerScore[] = [];

  // Handle tới trắng scoring separately
  if (isInstantWin) {
    const toiTrangScoring = calculateToiTrangScoring(numPlayers, winnerIndex, thuiPenaltyResult);

    // Calculate scores for all players
    for (let i = 0; i < numPlayers; i++) {
      if (i === winnerIndex) {
        // Winner receives tới trắng penalties
        const thuiPenalties =
          thuiPenaltyResult?.hasThui && thuiPenaltyResult.receiverIndex === winnerIndex
            ? thuiPenaltyResult.penaltyPoints
            : 0;

        playerScores.push({
          playerIndex: i,
          totalScore: toiTrangScoring.winnerReceives,
          breakdown: {
            cardPoints: 0, // No card points in tới trắng
            congPenalties: 0, // No cóng in tới trắng
            chatPenalties: 0, // No chặt in tới trắng (game ended before play)
            thuiPenalties,
            denBaiPenalty: 0,
          },
        });
      } else {
        // Losers pay tới trắng penalty
        const loserPenalty = toiTrangScoring.loserPenalties.get(i) || 0;

        playerScores.push({
          playerIndex: i,
          totalScore: -loserPenalty,
          breakdown: {
            cardPoints: 0, // No card points in tới trắng
            congPenalties: 0, // No cóng in tới trắng
            chatPenalties: 0, // No chặt in tới trắng
            thuiPenalties: 0, // Thúi penalties are included in winner's total
            denBaiPenalty: 0,
          },
        });
      }
    }
  } else {
    // Normal game scoring
    for (let i = 0; i < numPlayers; i++) {
      if (i === winnerIndex) {
        // Winner's score
        const cardPoints = calculateWinnerCardPoints(playerHands, winnerIndex);
        const congPenalties = congPenaltyResult.winnerReceives;
        const chatPenalties = getPlayerPenaltiesReceived(chatPenaltyState, winnerIndex);
        const thuiPenalties =
          thuiPenaltyResult?.hasThui && thuiPenaltyResult.receiverIndex === winnerIndex
            ? thuiPenaltyResult.penaltyPoints
            : 0;

        playerScores.push({
          playerIndex: i,
          totalScore: cardPoints + congPenalties + chatPenalties + thuiPenalties,
          breakdown: {
            cardPoints,
            congPenalties,
            chatPenalties,
            thuiPenalties,
            denBaiPenalty: 0,
          },
        });
      } else {
        // Loser's score
        const cardPoints = -playerHands[i].length;
        const congPenalty = congPenaltyResult.congPlayerPenalties.get(i) || 0;
        const congPenalties = -congPenalty;
        const chatPenalties = -getPlayerPenaltiesPaid(chatPenaltyState, i);
        const denBaiPenalty =
          congPenaltyResult.denBaiPlayerIndex === i ? -congPenaltyResult.denBaiPenalty : 0;

        // Thúi penalties
        let thuiPenalties = 0;
        if (thuiPenaltyResult && thuiPenaltyResult.hasThui) {
          const veBet = rankings.find((r) => r.rank === Math.max(...rankings.map((r) => r.rank)));
          // If this player is về bét, they pay thúi penalties (negative)
          if (veBet && veBet.playerIndex === i) {
            thuiPenalties = -thuiPenaltyResult.penaltyPoints;
          }
          // If this player receives thúi penalties (3rd place or winner), they get positive points
          else if (thuiPenaltyResult.receiverIndex === i) {
            thuiPenalties = thuiPenaltyResult.penaltyPoints;
          }
        }

        playerScores.push({
          playerIndex: i,
          totalScore: cardPoints + congPenalties + chatPenalties + thuiPenalties + denBaiPenalty,
          breakdown: {
            cardPoints,
            congPenalties,
            chatPenalties,
            thuiPenalties,
            denBaiPenalty,
          },
        });
      }
    }
  }

  return {
    playerScores,
    winnerIndex,
    isInstantWin,
  };
}
