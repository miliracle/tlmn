/**
 * Round Transition for Tiến Lên Miền Nam
 *
 * Handles transitioning from one round to the next, including:
 * - Determining next round leader (Hưởng Sái rule)
 * - Resetting round state
 * - Incrementing round counter
 * - Clearing played cards history
 */

import { ValidationException } from '../../common/exceptions';
import { RoundState, resetRoundState } from './roundState';
import { getPlayerToWinnersRight } from './roundEndDetection';
import { TurnOrderState, setCurrentPlayer } from './turnOrder';
import { VongState, resetVongState } from './vongDetection';
import { PassingState, resetPassedPlayers } from './passing';
import { SingleHeoTrackingState, resetSingleHeoTracking } from './singleHeoTracking';
import { CuttingChainState, resetCuttingChain } from './cuttingChain';

/**
 * Context for round transition
 */
export interface RoundTransitionContext {
  /** Current round state */
  roundState: RoundState;
  /** Current turn order state */
  turnOrderState: TurnOrderState;
  /** Current vòng state */
  vongState: VongState;
  /** Current passing state */
  passingState: PassingState;
  /** Current single heo tracking state */
  singleHeoTrackingState: SingleHeoTrackingState;
  /** Current cutting chain state */
  cuttingChainState: CuttingChainState;
}

/**
 * Result of round transition
 */
export interface RoundTransitionResult {
  /** Updated round state */
  roundState: RoundState;
  /** Updated turn order state */
  turnOrderState: TurnOrderState;
  /** Updated vòng state */
  vongState: VongState;
  /** Updated passing state */
  passingState: PassingState;
  /** Updated single heo tracking state */
  singleHeoTrackingState: SingleHeoTrackingState;
  /** Updated cutting chain state */
  cuttingChainState: CuttingChainState;
  /** Index of next round leader */
  nextRoundLeader: number;
}

/**
 * Determines the next round leader based on Hưởng Sái rule
 *
 * Rules:
 * - The player to the winner's right (next in counter-clockwise order) starts the next round
 * - This is the Hưởng Sái rule
 *
 * @param winnerIndex - Index of the round winner (0-based)
 * @param numPlayers - Total number of players (2-4)
 * @returns Index of next round leader
 */
export function determineNextRoundLeader(winnerIndex: number, numPlayers: number): number {
  return getPlayerToWinnersRight(winnerIndex, numPlayers);
}

/**
 * Transitions to the next round
 *
 * This function:
 * 1. Determines the next round leader (Hưởng Sái rule)
 * 2. Resets round state (passed players, last play, round winner)
 * 3. Increments round counter
 * 4. Resets all round-specific states (vòng, passing, single heo tracking, cutting chain)
 * 5. Sets the current player to the next round leader
 *
 * @param context - Round transition context
 * @param roundWinnerIndex - Index of the round winner (0-based)
 * @returns RoundTransitionResult with all updated states
 */
export function transitionToNextRound(
  context: RoundTransitionContext,
  roundWinnerIndex: number,
): RoundTransitionResult {
  const {
    roundState,
    turnOrderState,
    vongState,
    passingState,
    singleHeoTrackingState,
    cuttingChainState,
  } = context;
  const { numPlayers } = roundState;

  // Validate round winner index
  if (roundWinnerIndex < 0 || roundWinnerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid round winner index: ${roundWinnerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Determine next round leader (Hưởng Sái rule)
  const nextRoundLeader = determineNextRoundLeader(roundWinnerIndex, numPlayers);

  // Reset round state (this increments round number and clears round-specific data)
  const updatedRoundState = resetRoundState(roundState);

  // Reset vòng state with new first player
  const updatedVongState = resetVongState(vongState, nextRoundLeader);

  // Reset passing state
  const updatedPassingState = resetPassedPlayers(passingState);

  // Reset single heo tracking state
  const updatedSingleHeoTrackingState = resetSingleHeoTracking(singleHeoTrackingState);

  // Reset cutting chain state
  const updatedCuttingChainState = resetCuttingChain(cuttingChainState);

  // Set current player to next round leader
  const updatedTurnOrderState = setCurrentPlayer(turnOrderState, nextRoundLeader, true);

  return {
    roundState: updatedRoundState,
    turnOrderState: updatedTurnOrderState,
    vongState: updatedVongState,
    passingState: updatedPassingState,
    singleHeoTrackingState: updatedSingleHeoTrackingState,
    cuttingChainState: updatedCuttingChainState,
    nextRoundLeader,
  };
}

/**
 * Clears played cards history
 *
 * Note: This is a placeholder function. In a full implementation,
 * you would maintain a history of all plays in a round and clear it here.
 * For now, the lastPlay in RoundState serves as the "history" and is
 * already cleared by resetRoundState.
 *
 * @param roundState - Current round state
 * @returns Updated round state with cleared history
 */
export function clearPlayedCardsHistory(roundState: RoundState): RoundState {
  // The lastPlay is already cleared by resetRoundState
  // In a full implementation, you might have a separate playHistory array
  // that tracks all plays in the round for replay/debugging purposes
  return roundState;
}
