import { Card, RANK_3, SUIT_SPADES } from '../../types/game';
import { ValidationException } from '../../common/exceptions';
import { detectCombination, CardCombination } from './combinations';

/**
 * Result of finding player with ♠3
 */
export interface FindSpade3Result {
  /** Player index (0-based) who has ♠3, or -1 if not found */
  playerIndex: number;
  /** Whether ♠3 was found */
  found: boolean;
}

/**
 * Subtask 2.4.4.1: Find player with ♠3
 *
 * Searches through all player hands to find which player has the ♠3 (3 Spades) card.
 * This is used to determine who starts the initial round (Ván Khởi Đầu).
 *
 * @param playerHands - Array of player hands, each containing 13 cards
 * @returns FindSpade3Result with player index and found status
 * @throws ValidationException if playerHands is invalid
 */
export function findPlayerWithSpade3(playerHands: Card[][]): FindSpade3Result {
  if (!playerHands || playerHands.length === 0) {
    throw new ValidationException('Player hands array cannot be empty');
  }

  // Search through each player's hand
  for (let i = 0; i < playerHands.length; i++) {
    const hand = playerHands[i];
    if (!hand || !Array.isArray(hand)) {
      throw new ValidationException(`Invalid hand for player ${i}: must be an array`);
    }

    // Check if this player has ♠3
    const hasSpade3 = hand.some((card) => card.rank === RANK_3 && card.suit === SUIT_SPADES);

    if (hasSpade3) {
      return {
        playerIndex: i,
        found: true,
      };
    }
  }

  // ♠3 not found in any hand (should not happen in a valid game)
  return {
    playerIndex: -1,
    found: false,
  };
}

/**
 * Subtask 2.4.4.3: Handle player cannot form combination with ♠3 (play as single)
 *
 * Checks if a player can form any valid combination that includes ♠3.
 * If not, the player must play ♠3 as a single card.
 *
 * This function tries to find all possible combinations that include ♠3:
 * - Single (just ♠3)
 * - Pair (♠3 with another 3)
 * - Triple (♠3 with two other 3s)
 * - Straight (♠3 in a straight sequence)
 * - Consecutive pairs (♠3 in consecutive pairs)
 * - Four of a kind (all four 3s)
 *
 * @param playerHand - Player's hand containing 13 cards
 * @returns Array of valid combinations that include ♠3, or empty array if none found
 * @throws ValidationException if playerHand is invalid
 */
export function findCombinationsWithSpade3(playerHand: Card[]): CardCombination[] {
  if (!playerHand || !Array.isArray(playerHand)) {
    throw new ValidationException('Player hand must be an array');
  }

  // Find ♠3 in the hand
  const spade3 = playerHand.find((card) => card.rank === RANK_3 && card.suit === SUIT_SPADES);

  if (!spade3) {
    // Player doesn't have ♠3, return empty array
    return [];
  }

  const combinations: CardCombination[] = [];

  // Try all possible combinations that include ♠3
  // We'll check all subsets of the hand that include ♠3
  const handSize = playerHand.length;
  const maxCombinationSize = Math.min(handSize, 13); // Maximum combination size

  // Generate all possible subsets that include ♠3
  // We'll use a recursive approach to find all combinations
  const subsets = generateSubsetsWithCard(playerHand, spade3, maxCombinationSize);

  // Check each subset to see if it forms a valid combination
  for (const subset of subsets) {
    const combination = detectCombination(subset);
    if (combination) {
      combinations.push(combination);
    }
  }

  // Remove duplicates (same type and same cards)
  const uniqueCombinations = removeDuplicateCombinations(combinations);

  return uniqueCombinations;
}

/**
 * Generates all possible subsets of cards that include a specific card
 *
 * @param hand - Player's hand
 * @param requiredCard - Card that must be included in all subsets
 * @param maxSize - Maximum size of subsets to generate
 * @returns Array of card subsets
 */
function generateSubsetsWithCard(hand: Card[], requiredCard: Card, maxSize: number): Card[][] {
  const subsets: Card[][] = [];

  // Find index of required card
  const requiredCardIndex = hand.findIndex(
    (card) =>
      card.id === requiredCard.id ||
      (card.rank === requiredCard.rank && card.suit === requiredCard.suit),
  );

  if (requiredCardIndex === -1) {
    return [];
  }

  // Generate subsets of different sizes (1 to maxSize)
  for (let size = 1; size <= maxSize; size++) {
    // Generate all combinations of this size that include the required card
    const otherCards = hand.filter((_, index) => index !== requiredCardIndex);
    const otherSubsets = generateCombinations(otherCards, size - 1);

    // Add required card to each subset
    for (const subset of otherSubsets) {
      subsets.push([requiredCard, ...subset]);
    }
  }

  return subsets;
}

/**
 * Generates all combinations of a specific size from an array
 *
 * @param items - Array of items
 * @param size - Size of combinations to generate
 * @returns Array of combinations
 */
function generateCombinations<T>(items: T[], size: number): T[][] {
  if (size === 0) {
    return [[]];
  }

  if (size > items.length) {
    return [];
  }

  if (size === items.length) {
    return [[...items]];
  }

  const combinations: T[][] = [];

  // Recursive approach
  for (let i = 0; i <= items.length - size; i++) {
    const item = items[i];
    const remaining = items.slice(i + 1);
    const smallerCombinations = generateCombinations(remaining, size - 1);

    for (const smaller of smallerCombinations) {
      combinations.push([item, ...smaller]);
    }
  }

  return combinations;
}

/**
 * Removes duplicate combinations (same type and same cards)
 *
 * @param combinations - Array of combinations
 * @returns Array of unique combinations
 */
function removeDuplicateCombinations(combinations: CardCombination[]): CardCombination[] {
  const seen = new Set<string>();
  const unique: CardCombination[] = [];

  for (const combo of combinations) {
    // Create a unique key based on type and sorted card IDs
    const cardIds = combo.cards
      .map((c) => c.id || `${c.rank}-${c.suit}`)
      .sort()
      .join(',');
    const key = `${combo.type}:${cardIds}`;

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(combo);
    }
  }

  return unique;
}

/**
 * Subtask 2.4.4.4: Set initial round flag
 *
 * Determines if the current round is the initial round (Ván Khởi Đầu).
 * The initial round is the first round of a new game, or the first round
 * after an instant win (tới trắng) in a previous game.
 *
 * @param roundIndex - Current round index (0-based)
 * @returns true if this is the initial round, false otherwise
 */
export function isInitialRound(roundIndex: number): boolean {
  // Round 0 is always the initial round
  return roundIndex === 0;
}

/**
 * Checks if a player can form any valid combination with ♠3
 *
 * This is a convenience function that returns true if findCombinationsWithSpade3
 * returns at least one combination (even if it's just a single card).
 *
 * @param playerHand - Player's hand containing 13 cards
 * @returns true if player can form at least one combination with ♠3, false otherwise
 */
export function canFormCombinationWithSpade3(playerHand: Card[]): boolean {
  const combinations = findCombinationsWithSpade3(playerHand);
  return combinations.length > 0;
}
