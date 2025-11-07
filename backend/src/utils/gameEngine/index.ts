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
export {
  initializeRoundState,
  getCurrentRoundNumber,
  setLastPlay,
  getLastPlay,
  addPassedPlayer,
  getRoundPassedPlayers,
  hasPlayerPassed,
  setRoundWinner,
  getRoundWinner,
  hasRoundWinner,
  resetRoundState,
  incrementRoundNumber,
  type RoundState,
} from './roundState';
export {
  hasThreeConsecutivePasses,
  hasAllRemainingPassed,
  determineRoundWinnerFromPasses,
  determineRoundWinnerFromPassesWithLastPlayer,
  hasPlayerWonGame,
  detectRoundEnd,
  getPlayerToWinnersRight,
  type RoundEndDetectionContext,
  type RoundEndDetectionResult,
  type RoundEndReason,
} from './roundEndDetection';
export {
  determineNextRoundLeader,
  transitionToNextRound,
  clearPlayedCardsHistory,
  type RoundTransitionContext,
  type RoundTransitionResult,
} from './roundTransition';
export {
  detectGameEnd,
  hasPlayerWonGame as hasPlayerWonGameByHands,
  countCardsRemaining,
  calculateTotalCardValue,
  rankPlayers,
  determineVeBet,
  hasPlayerPlayedAnyCards,
  detectCong,
  hasHangInHand,
  hasHeoInHand,
  detectDenBai,
  calculateDenBaiPenalty,
  type GameEndDetectionContext,
  type GameEndDetectionResult,
  type PlayerRanking,
  type CongDetectionResult,
  type DenBaiDetectionResult,
} from './gameEndDetection';

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
