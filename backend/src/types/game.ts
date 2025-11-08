/**
 * Re-export game types and constants from shared package
 * This file maintains backward compatibility for existing imports
 * while using the shared types as the source of truth
 */
export {
  Card,
  CARD_RANKS,
  CARD_RANK_ORDER,
  CARD_SUITS,
  CARD_SUIT_ORDER,
  RANK_2,
  RANK_A,
  RANK_K,
  RANK_Q,
  RANK_J,
  RANK_10,
  RANK_9,
  RANK_8,
  RANK_7,
  RANK_6,
  RANK_5,
  RANK_4,
  RANK_3,
  SUIT_HEARTS,
  SUIT_DIAMONDS,
  SUIT_CLUBS,
  SUIT_SPADES,
  GameState,
} from 'shared';

// Re-export CardCombination from shared
export { CardCombination, CombinationType } from 'shared';
