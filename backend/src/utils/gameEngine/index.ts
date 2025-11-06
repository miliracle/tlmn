// Re-export all game engine functions for backward compatibility
export { calculateCardValue, getCardValue } from './cardValue';
export { calculateCardPoints, getCardPoints } from './cardPoints';
export { generateDeck, shuffleDeck, generateShuffledDeck } from './deck';
export { dealCards, hasTuQuyHeo, type DealCardsResult } from './deal';

// Game engine utilities object for backward compatibility
import { calculateCardValue, getCardValue } from './cardValue';
import { calculateCardPoints, getCardPoints } from './cardPoints';
import { generateDeck, shuffleDeck, generateShuffledDeck } from './deck';
import { dealCards, hasTuQuyHeo } from './deal';

export const gameEngine = {
  calculateCardValue,
  getCardValue,
  calculateCardPoints,
  getCardPoints,
  generateDeck,
  shuffleDeck,
  generateShuffledDeck,
  dealCards,
  hasTuQuyHeo,
};

