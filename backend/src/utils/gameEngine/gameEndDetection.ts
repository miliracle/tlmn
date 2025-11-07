/**
 * Game End Detection & Winner Determination for Tiến Lên Miền Nam
 *
 * Handles:
 * - Game end detection (player has 0 cards)
 * - Instant win game end
 * - Player ranking (losers)
 * - Cóng detection (players who didn't play any cards)
 * - Đền bài detection (players who had playable cards but didn't play)
 */

import { Card } from '../../types/game';
import { ValidationException } from '../../common/exceptions';
import { detectConsecutivePairs, detectFourOfKind } from './combinations';

/**
 * Context for game end detection
 */
export interface GameEndDetectionContext {
  /** Array of player hands (cards remaining) */
  playerHands: Card[][];
  /** Index of the winner (player who has 0 cards) */
  winnerIndex: number;
  /** Whether the game ended via instant win (tới trắng) */
  isInstantWin: boolean;
  /** Total number of players in the game */
  numPlayers: number;
}

/**
 * Result of game end detection
 */
export interface GameEndDetectionResult {
  /** Whether the game should end */
  shouldEndGame: boolean;
  /** Index of the winner (null if game not ended) */
  winnerIndex: number | null;
  /** Whether the game ended via instant win */
  isInstantWin: boolean;
}

/**
 * Player ranking information
 */
export interface PlayerRanking {
  /** Player index (0-based) */
  playerIndex: number;
  /** Rank (1 = winner, 2 = 2nd place, 3 = 3rd place, 4 = 4th place/về bét) */
  rank: number;
  /** Number of cards remaining */
  cardCount: number;
  /** Total value of cards remaining (for tie-breaking) */
  totalCardValue: number;
}

/**
 * Cóng detection result
 */
export interface CongDetectionResult {
  /** Array of player indices who got cóng (stuck) */
  congPlayers: number[];
  /** Number of cóng players (1, 2, or 3) */
  congCount: number;
  /** Whether cóng 1 nhà (1 player stuck) */
  isCong1Nha: boolean;
  /** Whether cóng 2 nhà (2 players stuck) */
  isCong2Nha: boolean;
  /** Whether cóng 3 nhà (3 players stuck) */
  isCong3Nha: boolean;
}

/**
 * Đền bài detection result
 */
export interface DenBaiDetectionResult {
  /** Array of player indices who đền bài (had playable cards but didn't play) */
  denBaiPlayers: number[];
  /** Whether any player đền bài */
  hasDenBai: boolean;
}

/**
 * Checks if a player has won the game (has 0 cards)
 *
 * @param playerHands - Array of player hands
 * @param playerIndex - Index of player to check (0-based)
 * @returns true if player has 0 cards
 */
export function hasPlayerWonGame(playerHands: Card[][], playerIndex: number): boolean {
  if (!playerHands || playerHands.length === 0) {
    throw new ValidationException('Player hands array cannot be empty');
  }

  if (playerIndex < 0 || playerIndex >= playerHands.length) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${playerHands.length - 1}.`,
    );
  }

  return playerHands[playerIndex].length === 0;
}

/**
 * Detects if the game should end
 *
 * Checks if any player has 0 cards after a play.
 * Also handles instant win game end (tới trắng).
 *
 * @param context - Game end detection context
 * @returns GameEndDetectionResult
 */
export function detectGameEnd(context: GameEndDetectionContext): GameEndDetectionResult {
  const { playerHands, winnerIndex, isInstantWin, numPlayers } = context;

  // Validate inputs
  if (!playerHands || playerHands.length !== numPlayers) {
    throw new ValidationException(
      `Invalid player hands array. Expected length ${numPlayers}, got ${playerHands?.length ?? 0}.`,
    );
  }

  if (winnerIndex < 0 || winnerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid winner index: ${winnerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Check if winner has 0 cards
  const winnerHasNoCards = hasPlayerWonGame(playerHands, winnerIndex);

  if (winnerHasNoCards || isInstantWin) {
    return {
      shouldEndGame: true,
      winnerIndex,
      isInstantWin,
    };
  }

  return {
    shouldEndGame: false,
    winnerIndex: null,
    isInstantWin: false,
  };
}

/**
 * Counts cards remaining for each player
 *
 * @param playerHands - Array of player hands
 * @returns Array of card counts per player
 */
export function countCardsRemaining(playerHands: Card[][]): number[] {
  if (!playerHands || playerHands.length === 0) {
    throw new ValidationException('Player hands array cannot be empty');
  }

  return playerHands.map((hand) => hand.length);
}

/**
 * Calculates total card value for a hand (for tie-breaking)
 *
 * @param hand - Player's hand
 * @returns Total value of all cards in hand
 */
export function calculateTotalCardValue(hand: Card[]): number {
  if (!hand || !Array.isArray(hand)) {
    return 0;
  }

  return hand.reduce((total, card) => total + card.value, 0);
}

/**
 * Ranks players by card count (fewest = 2nd place)
 *
 * Rules:
 * - Winner (0 cards) = rank 1
 * - Fewest cards remaining = rank 2
 * - Second-most cards = rank 3
 * - Most cards = rank 4 (về bét)
 * - Tie-breaking: Compare total card values (higher value = worse position)
 *
 * @param playerHands - Array of player hands
 * @param winnerIndex - Index of the winner (0-based)
 * @returns Array of PlayerRanking sorted by rank
 */
export function rankPlayers(playerHands: Card[][], winnerIndex: number): PlayerRanking[] {
  if (!playerHands || playerHands.length === 0) {
    throw new ValidationException('Player hands array cannot be empty');
  }

  if (winnerIndex < 0 || winnerIndex >= playerHands.length) {
    throw new ValidationException(
      `Invalid winner index: ${winnerIndex}. Must be between 0 and ${playerHands.length - 1}.`,
    );
  }

  const numPlayers = playerHands.length;
  const rankings: PlayerRanking[] = [];

  // Create ranking entries for all players
  for (let i = 0; i < numPlayers; i++) {
    const hand = playerHands[i];
    const cardCount = hand.length;
    const totalCardValue = calculateTotalCardValue(hand);

    rankings.push({
      playerIndex: i,
      rank: 0, // Will be set later
      cardCount,
      totalCardValue,
    });
  }

  // Winner is rank 1
  rankings[winnerIndex].rank = 1;

  // Get losers (all players except winner)
  const losers = rankings.filter((r) => r.playerIndex !== winnerIndex);

  // Sort losers by card count (ascending), then by total card value (ascending for tie-breaking)
  // Lower card count = better rank (2nd place)
  // If same card count, lower total value = better rank
  losers.sort((a, b) => {
    if (a.cardCount !== b.cardCount) {
      return a.cardCount - b.cardCount; // Fewer cards = better
    }
    return a.totalCardValue - b.totalCardValue; // Lower value = better (for tie-breaking)
  });

  // Assign ranks to losers (2nd, 3rd, 4th place)
  for (let i = 0; i < losers.length; i++) {
    losers[i].rank = i + 2; // 2nd, 3rd, 4th place
  }

  // Return all rankings sorted by rank
  return rankings.sort((a, b) => a.rank - b.rank);
}

/**
 * Determines về bét (last place player)
 *
 * @param rankings - Array of player rankings
 * @returns Index of về bét player (highest rank, most cards)
 */
export function determineVeBet(rankings: PlayerRanking[]): number {
  if (!rankings || rankings.length === 0) {
    throw new ValidationException('Rankings array cannot be empty');
  }

  // Find player with highest rank (excluding winner)
  const losers = rankings.filter((r) => r.rank > 1);
  if (losers.length === 0) {
    throw new ValidationException('No losers found in rankings');
  }

  // Sort by rank descending to get last place
  losers.sort((a, b) => b.rank - a.rank);
  return losers[0].playerIndex;
}

/**
 * Tracks if a player has played any cards during the game
 *
 * @param playerIndex - Index of player to check (0-based)
 * @param playHistory - Array of plays made during the game (each entry has playerIndex and cards)
 * @returns true if player has played at least one card
 */
export function hasPlayerPlayedAnyCards(
  playerIndex: number,
  playHistory: Array<{ playerIndex: number; cards: Card[] }>,
): boolean {
  if (!playHistory || playHistory.length === 0) {
    return false;
  }

  return playHistory.some((play) => play.playerIndex === playerIndex && play.cards.length > 0);
}

/**
 * Detects cóng players (players who didn't play any cards)
 *
 * Rules:
 * - A player gets cóng if they haven't played any cards when someone else finishes
 * - Exception: In tới trắng (instant win) cases, no one gets cóng
 *
 * @param playerHands - Array of player hands
 * @param winnerIndex - Index of the winner (0-based)
 * @param playHistory - Array of plays made during the game
 * @param isInstantWin - Whether the game ended via instant win
 * @returns CongDetectionResult
 */
export function detectCong(
  playerHands: Card[][],
  winnerIndex: number,
  playHistory: Array<{ playerIndex: number; cards: Card[] }>,
  isInstantWin: boolean,
): CongDetectionResult {
  if (!playerHands || playerHands.length === 0) {
    throw new ValidationException('Player hands array cannot be empty');
  }

  if (winnerIndex < 0 || winnerIndex >= playerHands.length) {
    throw new ValidationException(
      `Invalid winner index: ${winnerIndex}. Must be between 0 and ${playerHands.length - 1}.`,
    );
  }

  // In instant win cases, no one gets cóng
  if (isInstantWin) {
    return {
      congPlayers: [],
      congCount: 0,
      isCong1Nha: false,
      isCong2Nha: false,
      isCong3Nha: false,
    };
  }

  const numPlayers = playerHands.length;
  const congPlayers: number[] = [];

  // Check each player (except winner) to see if they played any cards
  for (let i = 0; i < numPlayers; i++) {
    if (i === winnerIndex) {
      continue; // Skip winner
    }

    const hasPlayed = hasPlayerPlayedAnyCards(i, playHistory);
    if (!hasPlayed) {
      congPlayers.push(i);
    }
  }

  const congCount = congPlayers.length;

  return {
    congPlayers,
    congCount,
    isCong1Nha: congCount === 1,
    isCong2Nha: congCount === 2,
    isCong3Nha: congCount === 3,
  };
}

/**
 * Checks if a player has hàng (special combinations) in their hand
 *
 * Hàng includes:
 * - 3 đôi thông (3 consecutive pairs)
 * - Tứ quý (four of a kind)
 * - 4 đôi thông (4 consecutive pairs)
 *
 * @param hand - Player's hand
 * @returns true if hand contains any hàng
 */
export function hasHangInHand(hand: Card[]): boolean {
  if (!hand || hand.length === 0) {
    return false;
  }

  // Check for tứ quý (need at least 4 cards)
  if (hand.length >= 4) {
    // Check all possible 4-card combinations
    for (let i = 0; i <= hand.length - 4; i++) {
      const fourCards = hand.slice(i, i + 4);
      const fourOfKind = detectFourOfKind(fourCards);
      if (fourOfKind) {
        return true;
      }
    }
  }

  // Check for 3 đôi thông or 4 đôi thông
  // We need to check all possible subsets of 6, 8, 10, or 12 cards
  // that could form consecutive pairs
  if (hand.length >= 6) {
    // Check for 3 đôi thông (6 cards = 3 pairs)
    for (let i = 0; i <= hand.length - 6; i++) {
      for (let j = i + 6; j <= hand.length; j++) {
        const subset = hand.slice(i, j);
        if (subset.length === 6) {
          const consecutivePairs = detectConsecutivePairs(subset);
          if (consecutivePairs) {
            return true;
          }
        }
      }
    }
  }

  if (hand.length >= 8) {
    // Check for 4 đôi thông (8 cards = 4 pairs)
    for (let i = 0; i <= hand.length - 8; i++) {
      for (let j = i + 8; j <= hand.length; j++) {
        const subset = hand.slice(i, j);
        if (subset.length === 8) {
          const consecutivePairs = detectConsecutivePairs(subset);
          if (consecutivePairs) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * Checks if a player has heo (2s) in their hand
 *
 * @param hand - Player's hand
 * @returns true if hand contains any heo (rank '2')
 */
export function hasHeoInHand(hand: Card[]): boolean {
  if (!hand || hand.length === 0) {
    return false;
  }

  return hand.some((card) => card.rank === '2');
}

/**
 * Detects đền bài (players who had playable cards but didn't play)
 *
 * Rules:
 * - Only applies when cóng 3 nhà (3 players stuck)
 * - A player đền bài if they had playable cards during their turn but chose not to play
 * - Playable cards = cards that can legally beat the current play OR cut (chặt) the current play
 *
 * Note: This is a simplified implementation. In a full implementation, you would need to track
 * for each player's turn whether they had playable cards available but chose to pass.
 *
 * @param playerHands - Array of player hands at game end
 * @param winnerIndex - Index of the winner (0-based)
 * @param congResult - Result of cóng detection
 * @param playHistory - Array of plays made during the game
 * @returns DenBaiDetectionResult
 */
export function detectDenBai(
  playerHands: Card[][],
  winnerIndex: number,
  congResult: CongDetectionResult,
  playHistory: Array<{ playerIndex: number; cards: Card[] }>,
): DenBaiDetectionResult {
  if (!playerHands || playerHands.length === 0) {
    throw new ValidationException('Player hands array cannot be empty');
  }

  if (winnerIndex < 0 || winnerIndex >= playerHands.length) {
    throw new ValidationException(
      `Invalid winner index: ${winnerIndex}. Must be between 0 and ${playerHands.length - 1}.`,
    );
  }

  // Đền bài only applies when cóng 3 nhà
  if (!congResult.isCong3Nha) {
    return {
      denBaiPlayers: [],
      hasDenBai: false,
    };
  }

  // In a full implementation, you would need to track for each player's turn:
  // 1. What was the last play when it was their turn
  // 2. Did they have playable cards (valid moves or cutting moves)
  // 3. Did they choose to pass despite having playable cards
  //
  // For now, this is a placeholder that returns empty (no đền bài detected)
  // This would need to be implemented with full game state tracking

  const denBaiPlayers: number[] = [];

  // TODO: Implement full đền bài detection logic
  // This requires tracking:
  // - For each player's turn, what cards were playable
  // - Whether the player passed when they had playable cards
  // - Only count if cóng 3 nhà occurred
  // For now, playHistory is not used in this placeholder implementation
  void playHistory; // Suppress unused parameter warning

  return {
    denBaiPlayers,
    hasDenBai: denBaiPlayers.length > 0,
  };
}

/**
 * Calculates đền bài penalty
 *
 * Rules:
 * - The player who đền bài must pay the equivalent of all cóng penalties
 * - As if they were responsible for all stuck players
 * - Winner still receives full reward from all penalties
 *
 * @param congCount - Number of cóng players (1, 2, or 3)
 * @param numPlayers - Total number of players in the game
 * @returns Penalty value for đền bài
 */
export function calculateDenBaiPenalty(congCount: number, numPlayers: number): number {
  if (congCount < 1 || congCount > 3) {
    throw new ValidationException(`Invalid cóng count: ${congCount}. Must be between 1 and 3.`);
  }

  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  // Tới trắng penalty value: 13 points × number of players
  const toiTrangPenaltyPerPlayer = 13 * numPlayers;

  // Đền bài penalty = cóng penalty × cóng count
  return toiTrangPenaltyPerPlayer * congCount;
}
