import { Card, CARD_RANKS, CARD_SUITS, CARD_RANK_ORDER, CARD_SUIT_ORDER } from '../types/game';
import { ValidationException } from '../common/exceptions';

/**
 * Calculates the numeric value of a card for comparison purposes.
 * 
 * Value calculation formula: (rank_order * 4) + suit_order
 * - Rank is the primary factor (2 > A > K > ... > 3)
 * - Suit is the secondary factor for tie-breaking (Hearts > Diamonds > Clubs > Spades)
 * - Result range: 0-51 (unique value for each of the 52 cards)
 * 
 * Examples:
 * - 3♠ (lowest) = (0 * 4) + 0 = 0
 * - 3♥ = (0 * 4) + 3 = 3
 * - 2♠ = (12 * 4) + 0 = 48
 * - 2♥ (highest) = (12 * 4) + 3 = 51
 * 
 * @param rank - The card rank ('2', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3')
 * @param suit - The card suit ('Hearts', 'Diamonds', 'Clubs', 'Spades')
 * @returns The numeric value of the card (0-51)
 * @throws ValidationException if rank or suit is invalid
 */
export function calculateCardValue(rank: string, suit: string): number {
  const rankOrder = CARD_RANK_ORDER[rank];
  const suitOrder = CARD_SUIT_ORDER[suit];

  if (rankOrder === undefined) {
    throw new ValidationException(`Invalid card rank: ${rank}`, undefined, {
      rank,
      validRanks: Object.keys(CARD_RANK_ORDER),
    });
  }

  if (suitOrder === undefined) {
    throw new ValidationException(`Invalid card suit: ${suit}`, undefined, {
      suit,
      validSuits: Object.keys(CARD_SUIT_ORDER),
    });
  }

  // Value = (rank_order * 4) + suit_order
  // This ensures rank always takes precedence (min difference of 4 between ranks)
  // and suit breaks ties within the same rank
  return rankOrder * 4 + suitOrder;
}

/**
 * Calculates the value for a Card object and returns it.
 * 
 * @param card - The card object with rank and suit properties
 * @returns The numeric value of the card (0-51)
 */
export function getCardValue(card: Pick<Card, 'rank' | 'suit'>): number {
  return calculateCardValue(card.rank, card.suit);
}

/**
 * Calculates the point value of a card for scoring purposes.
 * 
 * Point calculation rules:
 * - Regular cards (non-2s): 1 point each
 * - Heo (2s):
 *   - Spades (♠2) = 4 point
 *   - Clubs (♣2) = 4 point
 *   - Diamonds (♦2) = 2 point
 *   - Hearts (♥2) = 2 point
 * 
 * These point values are used for:
 * - Card points (1 point per card remaining in losers' hands)
 * - Chặt penalties (cutting heo)
 * - Thúi penalties (ending last with heo in hand)
 * 
 * @param rank - The card rank ('2', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3')
 * @param suit - The card suit ('Hearts', 'Diamonds', 'Clubs', 'Spades')
 * @returns The point value of the card (1, 2, or 4)
 * @throws ValidationException if rank or suit is invalid
 */
export function calculateCardPoints(rank: string, suit: string): number {
  // Validate rank and suit (reuse validation from calculateCardValue)
  const rankOrder = CARD_RANK_ORDER[rank];
  const suitOrder = CARD_SUIT_ORDER[suit];

  if (rankOrder === undefined) {
    throw new ValidationException(`Invalid card rank: ${rank}`, undefined, {
      rank,
      validRanks: Object.keys(CARD_RANK_ORDER),
    });
  }

  if (suitOrder === undefined) {
    throw new ValidationException(`Invalid card suit: ${suit}`, undefined, {
      suit,
      validSuits: Object.keys(CARD_SUIT_ORDER),
    });
  }

  // Heo (rank '2') have special point values based on suit
  if (rank === '2') {
    // Diamonds (♦2) and Hearts (♥2) = 2 points
    // Spades (♠2) and Clubs (♣2) = 1 point
    if (suit === 'Diamonds' || suit === 'Hearts') {
      return 4;
    }
    // Spades or Clubs
    return 2;
  }

  // All other cards = 1 point
  return 1;
}

/**
 * Calculates the point value for a Card object and returns it.
 * 
 * @param card - The card object with rank and suit properties
 * @returns The point value of the card (1 or 2)
 */
export function getCardPoints(card: Pick<Card, 'rank' | 'suit'>): number {
  return calculateCardPoints(card.rank, card.suit);
}

/**
 * Generates a standard 52-card deck.
 * 
 * Creates all combinations of 13 ranks and 4 suits, resulting in 52 unique cards.
 * Each card includes:
 * - id: Unique identifier (format: "{rank}-{suit}")
 * - rank: Card rank ('3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2')
 * - suit: Card suit ('Hearts', 'Diamonds', 'Clubs', 'Spades')
 * - value: Numeric value for comparison (calculated via calculateCardValue)
 * - points: Point value for scoring (calculated via calculateCardPoints)
 * 
 * @returns Array of 52 Card objects representing a complete deck
 */
export function generateDeck(): Card[] {
  const deck: Card[] = [];

  for (const rank of CARD_RANKS) {
    for (const suit of CARD_SUITS) {
      const card: Card = {
        id: `${rank}-${suit}`,
        rank,
        suit,
        value: calculateCardValue(rank, suit),
        points: calculateCardPoints(rank, suit),
      };
      deck.push(card);
    }
  }

  return deck;
}

/**
 * Shuffles an array of cards using the Fisher-Yates shuffle algorithm.
 * 
 * The Fisher-Yates shuffle is an unbiased algorithm that produces a truly random
 * permutation of the array. It works by:
 * 1. Starting from the last element
 * 2. Picking a random index from 0 to current position (inclusive)
 * 3. Swapping the current element with the randomly selected element
 * 4. Moving to the previous element and repeating
 * 
 * This algorithm ensures each permutation has equal probability (1/n!).
 * 
 * @param deck - Array of cards to shuffle (will be modified in place)
 * @returns The shuffled deck (same array reference, shuffled in place)
 */
export function shuffleDeck(deck: Card[]): Card[] {
  // Create a copy to avoid mutating the original array
  const shuffled = [...deck];

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at positions i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Generates a shuffled 52-card deck.
 * 
 * Convenience function that combines generateDeck() and shuffleDeck().
 * 
 * @returns A shuffled array of 52 Card objects
 */
export function generateShuffledDeck(): Card[] {
  const deck = generateDeck();
  return shuffleDeck(deck);
}

// Game engine utilities
export const gameEngine = {
  calculateCardValue,
  getCardValue,
  calculateCardPoints,
  getCardPoints,
  generateDeck,
  shuffleDeck,
  generateShuffledDeck,
};

