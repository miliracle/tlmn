// Card-related types
export type CardRank = '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | '2';
export type CardSuit = '♠' | '♥' | '♦' | '♣';

export interface CardCombination {
  type: 'single' | 'pair' | 'triple' | 'straight' | 'consecutive_pairs' | 'four_of_kind';
  cards: Card[];
  rank?: number;
}

