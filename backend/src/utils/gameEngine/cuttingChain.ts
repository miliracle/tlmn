/**
 * Chặt Chồng (Stacked Cutting) for Tiến Lên Miền Nam
 *
 * Tracks cutting chains where multiple cuts occur in sequence.
 * The last person cut in a chain pays penalties for all cuts in that chain.
 */

import { ValidationException } from '../../common/exceptions';

/**
 * Represents a single cut in the chain
 */
export interface CutEntry {
  /** Index of player who was cut */
  cutPlayerIndex: number;
  /** Index of player who performed the cutting */
  cuttingPlayerIndex: number;
  /** Penalty points for this cut */
  penaltyPoints: number;
  /** Number of heo cut (0 if not cutting heo) */
  heoCount: number;
  /** Whether the cut player finished immediately after (chặt and finish) */
  finishedAfterCut?: boolean;
}

/**
 * Cutting chain state interface
 */
export interface CuttingChainState {
  /** Array of cuts in the current chain (most recent first) */
  chain: CutEntry[];
  /** Total number of players in the game */
  numPlayers: number;
}

/**
 * Initializes cutting chain state for a new round
 *
 * @param numPlayers - Total number of players (2-4)
 * @returns Initialized CuttingChainState
 */
export function initializeCuttingChain(numPlayers: number): CuttingChainState {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
    );
  }

  return {
    chain: [],
    numPlayers,
  };
}

/**
 * Adds a cut to the chain
 *
 * @param chainState - Current cutting chain state
 * @param cutPlayerIndex - Index of player who was cut
 * @param cuttingPlayerIndex - Index of player who performed the cutting
 * @param penaltyPoints - Penalty points for this cut
 * @param heoCount - Number of heo cut (0 if not cutting heo)
 * @returns Updated CuttingChainState
 */
export function addCutToChain(
  chainState: CuttingChainState,
  cutPlayerIndex: number,
  cuttingPlayerIndex: number,
  penaltyPoints: number,
  heoCount: number = 0,
): CuttingChainState {
  const { chain, numPlayers } = chainState;

  // Validate player indices
  if (cutPlayerIndex < 0 || cutPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid cut player index: ${cutPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  if (cuttingPlayerIndex < 0 || cuttingPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid cutting player index: ${cuttingPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  if (cutPlayerIndex === cuttingPlayerIndex) {
    throw new ValidationException('A player cannot cut themselves');
  }

  // Add new cut to the beginning of the chain (most recent first)
  const newCut: CutEntry = {
    cutPlayerIndex,
    cuttingPlayerIndex,
    penaltyPoints,
    heoCount,
  };

  return {
    ...chainState,
    chain: [newCut, ...chain],
  };
}

/**
 * Marks that a cut player finished immediately after being cut
 *
 * Subtask 2.5.4.4: Handle chặt and finish rule (no penalty if winner finishes)
 * If the person being cut finishes immediately after, no one pays or receives penalties.
 *
 * @param chainState - Current cutting chain state
 * @param cutPlayerIndex - Index of player who finished after being cut
 * @returns Updated CuttingChainState with finished flag set
 */
export function markCutPlayerFinished(
  chainState: CuttingChainState,
  cutPlayerIndex: number,
): CuttingChainState {
  const { chain, numPlayers } = chainState;

  if (cutPlayerIndex < 0 || cutPlayerIndex >= numPlayers) {
    throw new ValidationException(
      `Invalid cut player index: ${cutPlayerIndex}. Must be between 0 and ${numPlayers - 1}.`,
    );
  }

  // Find the most recent cut where this player was cut
  const updatedChain = chain.map((cut) => {
    if (cut.cutPlayerIndex === cutPlayerIndex && !cut.finishedAfterCut) {
      return {
        ...cut,
        finishedAfterCut: true,
      };
    }
    return cut;
  });

  return {
    ...chainState,
    chain: updatedChain,
  };
}

/**
 * Calculates cumulative penalties for the last person cut in the chain
 *
 * Subtask 2.5.4.3: Calculate cumulative penalties for last person cut
 * The last person cut in a chain pays penalties for:
 * 1. Being cut themselves
 * 2. All previous cuts in the chain (from players they cut who were subsequently cut)
 *
 * @param chainState - Current cutting chain state
 * @returns Map of player index to total penalty points they must pay
 */
export function calculateCumulativePenalties(chainState: CuttingChainState): Map<number, number> {
  const { chain } = chainState;
  const penaltyMap = new Map<number, number>();

  if (chain.length === 0) {
    return penaltyMap;
  }

  // Find the last person cut in the chain (first entry, as chain is most recent first)
  const lastCut = chain[0];
  if (lastCut.finishedAfterCut) {
    // Subtask 2.5.4.4: Handle chặt and finish rule
    // If the last person cut finished, no penalties are paid
    return penaltyMap;
  }

  const lastCutPlayerIndex = lastCut.cutPlayerIndex;
  let totalPenalty = 0;

  // Add penalty for being cut themselves
  totalPenalty += lastCut.penaltyPoints;

  // Recursively calculate penalties from all previous cuts in the chain
  // We need to find all cuts where the last cut player was the cutter,
  // and those players were subsequently cut
  const calculateTransferredPenalties = (cutIndex: number, targetPlayerIndex: number): number => {
    let transferred = 0;

    // Look through all cuts after this one (earlier in the chain)
    for (let i = cutIndex + 1; i < chain.length; i++) {
      const previousCut = chain[i];

      // If this previous cut was made by the target player, and that player was cut,
      // we need to transfer the penalty
      if (previousCut.cuttingPlayerIndex === targetPlayerIndex) {
        // The target player cut someone, and then was cut themselves
        // The penalty from the cut they made transfers to them
        if (!previousCut.finishedAfterCut) {
          transferred += previousCut.penaltyPoints;
          // Also add any penalties that were transferred to the player they cut
          transferred += calculateTransferredPenalties(i, previousCut.cutPlayerIndex);
        }
      }
    }

    return transferred;
  };

  // Add all transferred penalties
  totalPenalty += calculateTransferredPenalties(0, lastCutPlayerIndex);

  penaltyMap.set(lastCutPlayerIndex, totalPenalty);

  return penaltyMap;
}

/**
 * Gets the player who receives penalties from the cutting chain
 *
 * @param chainState - Current cutting chain state
 * @returns Index of player who receives penalties (the one who performed the last cut), or null if no cuts
 */
export function getPenaltyReceiver(chainState: CuttingChainState): number | null {
  const { chain } = chainState;
  if (chain.length === 0) {
    return null;
  }

  const lastCut = chain[0];
  if (lastCut.finishedAfterCut) {
    // If the cut player finished, no one receives penalties
    return null;
  }

  return lastCut.cuttingPlayerIndex;
}

/**
 * Resets the cutting chain for a new round
 *
 * @param chainState - Current cutting chain state
 * @returns Updated CuttingChainState with empty chain
 */
export function resetCuttingChain(chainState: CuttingChainState): CuttingChainState {
  return {
    ...chainState,
    chain: [],
  };
}

/**
 * Gets the current cutting chain
 *
 * @param chainState - Current cutting chain state
 * @returns Array of cut entries (copy to prevent mutation)
 */
export function getCuttingChain(chainState: CuttingChainState): CutEntry[] {
  return [...chainState.chain];
}

/**
 * Gets the number of cuts in the current chain
 *
 * @param chainState - Current cutting chain state
 * @returns Number of cuts in the chain
 */
export function getChainLength(chainState: CuttingChainState): number {
  return chainState.chain.length;
}
