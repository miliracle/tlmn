import { CardCombination } from '../utils/gameEngine/combinations';

// Game types placeholder
export interface Card {
  id: string;
  rank: string;
  suit: string;
  value: number;
  points: number;
}

export const CARD_RANKS = [
  '2', // Highest
  'A',
  'K',
  'Q',
  'J',
  '10',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3', // Lowest
];

export const CARD_RANK_ORDER: { [rank: string]: number } = {
  '2': 12,
  A: 11,
  K: 10,
  Q: 9,
  J: 8,
  '10': 7,
  '9': 6,
  '8': 5,
  '7': 4,
  '6': 3,
  '5': 2,
  '4': 1,
  '3': 0,
};

export const CARD_SUITS = [
  'Hearts', // Highest
  'Diamonds',
  'Clubs',
  'Spades', // Lowest
];

export const CARD_SUIT_ORDER: { [suit: string]: number } = {
  Hearts: 3,
  Diamonds: 2,
  Clubs: 1,
  Spades: 0,
};

export type GameState = {
  deck: Card[];
  // players: Player[];
  currentPlayerIndex: number;
  currentRoundIndex: number;
  currentTurnIndex: number;
  currentCombination: CardCombination;
  currentScore: number;
  currentRoundScore: number;
  currentTurnScore: number;
};

export const RANK_2 = CARD_RANKS[0];
export const RANK_A = CARD_RANKS[1];
export const RANK_K = CARD_RANKS[2];
export const RANK_Q = CARD_RANKS[3];
export const RANK_J = CARD_RANKS[4];
export const RANK_10 = CARD_RANKS[5];
export const RANK_9 = CARD_RANKS[6];
export const RANK_8 = CARD_RANKS[7];
export const RANK_7 = CARD_RANKS[8];
export const RANK_6 = CARD_RANKS[9];
export const RANK_5 = CARD_RANKS[10];
export const RANK_4 = CARD_RANKS[11];
export const RANK_3 = CARD_RANKS[12];

export const SUIT_HEARTS = CARD_SUITS[0];
export const SUIT_DIAMONDS = CARD_SUITS[1];
export const SUIT_CLUBS = CARD_SUITS[2];
export const SUIT_SPADES = CARD_SUITS[3];
