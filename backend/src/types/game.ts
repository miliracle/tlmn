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
    'A': 11,
    'K': 10,
    'Q': 9,
    'J': 8,
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
    'Hearts',    // Highest
    'Diamonds',
    'Clubs',
    'Spades',    // Lowest
];

export const CARD_SUIT_ORDER: { [suit: string]: number } = {
    'Hearts': 3,
    'Diamonds': 2,
    'Clubs': 1,
    'Spades': 0,
};

export type GameState = {};

