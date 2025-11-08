// Card-related types
import type { Card } from './game';

export type CardRank = '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | '2';
export type CardSuit = '♠' | '♥' | '♦' | '♣';

// Suit mapping between symbol format (frontend) and name format (backend)
export const SUIT_SYMBOL_TO_NAME: Record<string, string> = {
  '♠': 'Spades',
  '♥': 'Hearts',
  '♦': 'Diamonds',
  '♣': 'Clubs',
};

export const SUIT_NAME_TO_SYMBOL: Record<string, string> = {
  Spades: '♠',
  Hearts: '♥',
  Diamonds: '♦',
  Clubs: '♣',
};

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

