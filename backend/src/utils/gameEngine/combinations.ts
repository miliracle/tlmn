import { Card, CARD_RANK_ORDER, RANK_2 } from '../../types/game';
import { ValidationException } from '../../common/exceptions';
import { getCardValue } from './cardValue';

/**
 * Combination types in Tiến Lên Miền Nam
 */
export type CombinationType =
  | 'single'
  | 'pair'
  | 'triple'
  | 'straight'
  | 'consecutive_pairs'
  | 'four_of_kind';

/**
 * Represents a detected card combination
 */
export interface CardCombination {
  type: CombinationType;
  cards: Card[];
  rank?: number; // For comparison purposes
  highestCard?: Card; // Highest card in the combination
}

/**
 * Detects if cards form a single card combination
 * @param cards - Array of cards (should be exactly 1)
 * @returns CardCombination if valid, null otherwise
 */
export function detectSingle(cards: Card[]): CardCombination | null {
  if (cards.length !== 1) {
    return null;
  }

  return {
    type: 'single',
    cards,
    rank: getCardValue(cards[0]),
    highestCard: cards[0],
  };
}

/**
 * Detects if cards form a pair (đôi)
 * @param cards - Array of cards (should be exactly 2)
 * @returns CardCombination if valid, null otherwise
 */
export function detectPair(cards: Card[]): CardCombination | null {
  if (cards.length !== 2) {
    return null;
  }

  // Check if both cards have the same rank
  if (cards[0].rank !== cards[1].rank) {
    return null;
  }

  // Find the highest card (by suit)
  const highestCard = getCardValue(cards[0]) > getCardValue(cards[1]) ? cards[0] : cards[1];

  return {
    type: 'pair',
    cards,
    rank: getCardValue(highestCard),
    highestCard,
  };
}

/**
 * Detects if cards form a triple (ba/sám cô)
 * @param cards - Array of cards (should be exactly 3)
 * @returns CardCombination if valid, null otherwise
 */
export function detectTriple(cards: Card[]): CardCombination | null {
  if (cards.length !== 3) {
    return null;
  }

  // Check if all three cards have the same rank
  const ranks = cards.map((card) => card.rank);
  if (ranks[0] !== ranks[1] || ranks[1] !== ranks[2]) {
    return null;
  }

  // Find the highest card (by suit)
  const sortedByValue = [...cards].sort((a, b) => getCardValue(b) - getCardValue(a));
  const highestCard = sortedByValue[0];

  return {
    type: 'triple',
    cards,
    rank: getCardValue(highestCard),
    highestCard,
  };
}

/**
 * Detects if cards form a straight (sảnh)
 * Rules:
 * - Minimum 3 cards, maximum 12 cards
 * - Consecutive ranks (cannot include rank 2)
 * - Any suits allowed
 * @param cards - Array of cards
 * @returns CardCombination if valid, null otherwise
 */
export function detectStraight(cards: Card[]): CardCombination | null {
  if (cards.length < 3 || cards.length > 12) {
    return null;
  }

  // Sort cards by rank order
  const sortedCards = [...cards].sort((a, b) => {
    const rankOrderA = CARD_RANK_ORDER[a.rank] ?? -1;
    const rankOrderB = CARD_RANK_ORDER[b.rank] ?? -1;
    return rankOrderA - rankOrderB;
  });

  // Check if any card is rank 2 (heo) - straights cannot include 2
  if (sortedCards.some((card) => card.rank === '2')) {
    return null;
  }

  // Check if ranks are consecutive
  for (let i = 0; i < sortedCards.length - 1; i++) {
    const currentRankOrder = CARD_RANK_ORDER[sortedCards[i].rank];
    const nextRankOrder = CARD_RANK_ORDER[sortedCards[i + 1].rank];

    if (currentRankOrder === undefined || nextRankOrder === undefined) {
      return null;
    }

    // Check if next rank is exactly 1 more than current rank
    if (nextRankOrder !== currentRankOrder + 1) {
      return null;
    }
  }

  // Find the highest card (by rank first, then suit)
  const highestCard = sortedCards[sortedCards.length - 1];

  return {
    type: 'straight',
    cards: sortedCards,
    rank: getCardValue(highestCard),
    highestCard,
  };
}

/**
 * Detects if cards form consecutive pairs (đôi thông)
 * Rules:
 * - Minimum 3 pairs, maximum 6 pairs
 * - Consecutive ranks (cannot include rank 2)
 * - Each rank must have exactly 2 cards
 * @param cards - Array of cards
 * @returns CardCombination if valid, null otherwise
 */
export function detectConsecutivePairs(cards: Card[]): CardCombination | null {
  // Must have even number of cards (pairs)
  if (cards.length < 6 || cards.length > 12 || cards.length % 2 !== 0) {
    return null;
  }

  const pairCount = cards.length / 2;
  if (pairCount < 3 || pairCount > 6) {
    return null;
  }

  // Group cards by rank
  const cardsByRank: { [rank: string]: Card[] } = {};
  for (const card of cards) {
    if (!cardsByRank[card.rank]) {
      cardsByRank[card.rank] = [];
    }
    cardsByRank[card.rank].push(card);
  }

  // Check if any rank is 2 (heo) - consecutive pairs cannot include 2
  if (cardsByRank['2']) {
    return null;
  }

  // Check if each rank has exactly 2 cards
  const ranks = Object.keys(cardsByRank);
  for (const rank of ranks) {
    if (cardsByRank[rank].length !== 2) {
      return null;
    }
  }

  // Check if ranks are consecutive
  const sortedRanks = ranks.sort((a, b) => {
    const orderA = CARD_RANK_ORDER[a] ?? -1;
    const orderB = CARD_RANK_ORDER[b] ?? -1;
    return orderA - orderB;
  });

  for (let i = 0; i < sortedRanks.length - 1; i++) {
    const currentRankOrder = CARD_RANK_ORDER[sortedRanks[i]];
    const nextRankOrder = CARD_RANK_ORDER[sortedRanks[i + 1]];

    if (currentRankOrder === undefined || nextRankOrder === undefined) {
      return null;
    }

    if (nextRankOrder !== currentRankOrder + 1) {
      return null;
    }
  }

  // Find the highest pair's highest card
  const highestRank = sortedRanks[sortedRanks.length - 1];
  const highestPair = cardsByRank[highestRank];
  const highestCard =
    getCardValue(highestPair[0]) > getCardValue(highestPair[1]) ? highestPair[0] : highestPair[1];

  return {
    type: 'consecutive_pairs',
    cards,
    rank: getCardValue(highestCard),
    highestCard,
  };
}

/**
 * Detects if cards form four of a kind (tứ quý)
 * Rules:
 * - Exactly 4 cards
 * - All cards must have the same rank
 * - Cannot be formed with rank 2 (heo) - that's an instant win condition
 * @param cards - Array of cards (should be exactly 4)
 * @returns CardCombination if valid, null otherwise
 */
export function detectFourOfKind(cards: Card[]): CardCombination | null {
  if (cards.length !== 4) {
    return null;
  }

  // Check if all cards have the same rank
  const ranks = cards.map((card) => card.rank);
  if (ranks[0] !== ranks[1] || ranks[1] !== ranks[2] || ranks[2] !== ranks[3]) {
    return null;
  }

  // Cannot be formed with rank 2 (heo) - that's an instant win condition
  if (cards[0].rank === RANK_2) {
    return null;
  }

  // Find the highest card (by suit)
  const sortedByValue = [...cards].sort((a, b) => getCardValue(b) - getCardValue(a));
  const highestCard = sortedByValue[0];

  return {
    type: 'four_of_kind',
    cards,
    rank: CARD_RANK_ORDER[cards[0].rank] ?? 0, // Use rank order for comparison
    highestCard,
  };
}

/**
 * Detects the combination type from an array of cards
 * Tries all combination types in order of specificity
 * @param cards - Array of cards to analyze
 * @returns CardCombination if valid, null otherwise
 */
export function detectCombination(cards: Card[]): CardCombination | null {
  if (!cards || cards.length === 0) {
    return null;
  }

  // Try more specific combinations first
  const fourOfKind = detectFourOfKind(cards);
  if (fourOfKind) return fourOfKind;

  const consecutivePairs = detectConsecutivePairs(cards);
  if (consecutivePairs) return consecutivePairs;

  const straight = detectStraight(cards);
  if (straight) return straight;

  const triple = detectTriple(cards);
  if (triple) return triple;

  const pair = detectPair(cards);
  if (pair) return pair;

  const single = detectSingle(cards);
  if (single) return single;

  return null;
}

/**
 * Compares two combinations to determine which is higher
 * Rules:
 * - Combinations must be of the same type (except for cutting rules)
 * - For straights and consecutive pairs: longer beats shorter
 * - For same-length: compare by rank, then suit
 * @param combo1 - First combination
 * @param combo2 - Second combination
 * @returns 1 if combo1 > combo2, -1 if combo1 < combo2, 0 if equal
 */
export function compareCombinations(combo1: CardCombination, combo2: CardCombination): number {
  // Same type required for comparison (cutting rules handled separately)
  if (combo1.type !== combo2.type) {
    throw new ValidationException('Cannot compare combinations of different types', undefined, {
      combo1Type: combo1.type,
      combo2Type: combo2.type,
    });
  }

  // Special comparison for straights: longer beats shorter
  if (combo1.type === 'straight') {
    if (combo1.cards.length > combo2.cards.length) {
      return 1;
    }
    if (combo1.cards.length < combo2.cards.length) {
      return -1;
    }
    // Same length: compare by highest card
    if (combo1.rank !== undefined && combo2.rank !== undefined) {
      if (combo1.rank > combo2.rank) return 1;
      if (combo1.rank < combo2.rank) return -1;
    }
    return 0;
  }

  // Special comparison for consecutive pairs: longer beats shorter
  if (combo1.type === 'consecutive_pairs') {
    const pairs1 = combo1.cards.length / 2;
    const pairs2 = combo2.cards.length / 2;
    if (pairs1 > pairs2) {
      return 1;
    }
    if (pairs1 < pairs2) {
      return -1;
    }
    // Same length: compare by highest pair's highest card
    if (combo1.rank !== undefined && combo2.rank !== undefined) {
      if (combo1.rank > combo2.rank) return 1;
      if (combo1.rank < combo2.rank) return -1;
    }
    return 0;
  }

  // For other types (single, pair, triple, four_of_kind): compare by rank
  if (combo1.rank !== undefined && combo2.rank !== undefined) {
    if (combo1.rank > combo2.rank) return 1;
    if (combo1.rank < combo2.rank) return -1;
  }

  return 0;
}

/**
 * Validates if a combination can beat another combination
 * @param newCombo - The combination being played
 * @param lastCombo - The last combination played
 * @returns true if newCombo beats lastCombo, false otherwise
 */
export function canBeatCombination(newCombo: CardCombination, lastCombo: CardCombination): boolean {
  return compareCombinations(newCombo, lastCombo) > 0;
}
