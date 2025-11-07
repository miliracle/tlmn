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
export {
  isValidMove,
  MOVE_VALIDATION_ERROR_CODES,
  MOVE_VALIDATION_ERROR_MESSAGES,
  type MoveValidationResult,
  type MoveValidationContext,
} from './moveValidation';
export {
  getNextPlayerIndex,
  getPreviousPlayerIndex,
  initializeTurnOrder,
  advanceTurn,
  isTurnTimedOut,
  getRemainingTurnTime,
  updateTurnStartTime,
  setCurrentPlayer,
  TURN_TIMEOUT_MS,
  type TurnOrderState,
  type AdvanceTurnResult,
} from './turnOrder';
export {
  initializePassingState,
  passTurn,
  hasPassed,
  resetPassedPlayers,
  getPassedPlayersCount,
  getPassedPlayers,
  hasAllButOnePassed,
  hasConsecutivePasses,
  type PassingState,
  type PassTurnResult,
} from './passing';
export {
  findPlayerWithSpade3,
  findCombinationsWithSpade3,
  isInitialRound,
  canFormCombinationWithSpade3,
  type FindSpade3Result,
} from './firstRound';
export {
  initializeVongState,
  markPlayerPlayed,
  hasVong,
  resetVongState,
  hasAnyPlayerPlayed,
  getFirstPlayerIndex,
  type VongState,
} from './vongDetection';
export {
  initializeSingleHeoTracking,
  recordPlay,
  isSingleHeo,
  isDoiHeo,
  isBaConHeo,
  getConsecutiveSingleHeoCount,
  getConsecutiveSingleHeos,
  resetSingleHeoTracking,
  type SingleHeoTrackingState,
} from './singleHeoTracking';
export { canCut, type CanCutResult } from './cuttingRules';
export {
  initializeCuttingChain,
  addCutToChain,
  markCutPlayerFinished,
  calculateCumulativePenalties,
  getPenaltyReceiver,
  resetCuttingChain,
  getCuttingChain,
  getChainLength,
  type CuttingChainState,
  type CutEntry,
} from './cuttingChain';

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
