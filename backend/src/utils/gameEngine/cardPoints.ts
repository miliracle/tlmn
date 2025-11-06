import { CARD_RANK_ORDER, CARD_SUIT_ORDER } from '../../types/game';
import { ValidationException } from '../../common/exceptions';

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
export function getCardPoints(card: { rank: string; suit: string }): number {
  return calculateCardPoints(card.rank, card.suit);
}

