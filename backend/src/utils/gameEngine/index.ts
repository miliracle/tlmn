// Re-export all game engine functions for backward compatibility
export { calculateCardValue, getCardValue } from './cardValue';
export { calculateCardPoints, getCardPoints } from './cardPoints';
export { generateDeck, shuffleDeck, generateShuffledDeck } from './deck';
export { dealCards, type DealCardsResult } from './deal';
export {
  detectSingle,
  detectPair,
  detectTriple,
  detectStraight,
  detectConsecutivePairs,
  detectFourOfKind,
  detectCombination,
  compareCombinations,
  canBeatCombination,
  type CombinationType,
  type CardCombination,
} from './combinations';
export {
  checkInitialRoundInstantWin,
  checkOtherRoundInstantWin,
  checkInstantWin,
  type InitialRoundInstantWinType,
  type OtherRoundInstantWinType,
  type InstantWinResult,
} from './instantWin';

// Game engine utilities object for backward compatibility
import { calculateCardValue, getCardValue } from './cardValue';
import { calculateCardPoints, getCardPoints } from './cardPoints';
import { generateDeck, shuffleDeck, generateShuffledDeck } from './deck';
import { dealCards } from './deal';
import {
  detectSingle,
  detectPair,
  detectTriple,
  detectStraight,
  detectConsecutivePairs,
  detectFourOfKind,
  detectCombination,
  compareCombinations,
  canBeatCombination,
} from './combinations';

export const gameEngine = {
  calculateCardValue,
  getCardValue,
  calculateCardPoints,
  getCardPoints,
  generateDeck,
  shuffleDeck,
  generateShuffledDeck,
  dealCards,
  detectSingle,
  detectPair,
  detectTriple,
  detectStraight,
  detectConsecutivePairs,
  detectFourOfKind,
  detectCombination,
  compareCombinations,
  canBeatCombination,
};
