import { CARD_RANK_ORDER, CARD_SUIT_ORDER } from '../../types/game';
import { ValidationException } from '../../common/exceptions';

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
export function getCardValue(card: { rank: string; suit: string }): number {
  return calculateCardValue(card.rank, card.suit);
}
