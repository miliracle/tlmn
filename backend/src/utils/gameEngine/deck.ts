import { Card, CARD_RANKS, CARD_SUITS } from '../../types/game';
import { calculateCardValue } from './cardValue';
import { calculateCardPoints } from './cardPoints';

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
