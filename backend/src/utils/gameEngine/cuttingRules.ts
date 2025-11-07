/**
 * Cutting Rules (Chặt) for Tiến Lên Miền Nam
 *
 * Implements the cutting rules where special combinations (hàng) can cut
 * heo (2s) or other special combinations, even if they are not the same type.
 */

import { CardCombination } from './combinations';
import { VongState, hasVong } from './vongDetection';
import {
  SingleHeoTrackingState,
  getConsecutiveSingleHeoCount,
  isDoiHeo,
  isBaConHeo,
} from './singleHeoTracking';
import { getCardPoints } from './cardPoints';
import { compareCombinations } from './combinations';

/**
 * Result of checking if a combination can cut another
 */
export interface CanCutResult {
  /** Whether the cutting combination can cut the target combination */
  canCut: boolean;
  /** Reason why it cannot cut (if canCut is false) */
  reason?: string;
  /** Penalty points that would be paid if the cut is successful */
  penaltyPoints?: number;
  /** Number of heo being cut (1-4 for single heos, or 0 for other cuts) */
  heoCount?: number;
}

/**
 * Checks if a combination can cut another combination
 *
 * Cutting Rules:
 * - 3 đôi thông can cut: 1-4 single heos, or 3 đôi thông of smaller rank (requires vòng)
 * - Tứ quý can cut: 1-4 single heos, 3 đôi thông, or tứ quý of smaller rank (requires vòng)
 * - 4 đôi thông can cut: 1 heo, đôi heo, 3 đôi thông, tứ quý, or 4 đôi thông of smaller rank (no vòng requirement)
 * - 3 con heo cannot be cut by any hàng
 *
 * @param cuttingCombination - The combination attempting to cut
 * @param targetCombination - The combination being cut
 * @param vongState - Current vòng state
 * @param currentPlayerIndex - Index of current player attempting to cut
 * @param singleHeoTracking - Current single heo tracking state
 * @returns CanCutResult with whether the cut is valid and penalty information
 */
export function canCut(
  cuttingCombination: CardCombination,
  targetCombination: CardCombination,
  vongState: VongState,
  currentPlayerIndex: number,
  singleHeoTracking: SingleHeoTrackingState,
): CanCutResult {
  // Subtask 2.5.3.4: Validate 3 con heo cannot be cut
  if (isBaConHeo(targetCombination)) {
    return {
      canCut: false,
      reason: '3 con heo (triple of 2s) cannot be cut by any hàng',
    };
  }

  const cuttingType = cuttingCombination.type;

  // Check cutting rules based on the type of cutting combination
  if (cuttingType === 'consecutive_pairs') {
    return canCutWithConsecutivePairs(
      cuttingCombination,
      targetCombination,
      vongState,
      currentPlayerIndex,
      singleHeoTracking,
    );
  }

  if (cuttingType === 'four_of_kind') {
    return canCutWithFourOfKind(
      cuttingCombination,
      targetCombination,
      vongState,
      currentPlayerIndex,
      singleHeoTracking,
    );
  }

  // Only consecutive_pairs and four_of_kind can cut
  return {
    canCut: false,
    reason: `Combination type ${cuttingType} cannot cut other combinations`,
  };
}

/**
 * Checks if 3 đôi thông or 4 đôi thông can cut a target combination
 *
 * @param cuttingCombination - The consecutive pairs combination attempting to cut
 * @param targetCombination - The combination being cut
 * @param vongState - Current vòng state
 * @param currentPlayerIndex - Index of current player attempting to cut
 * @param singleHeoTracking - Current single heo tracking state
 * @returns CanCutResult
 */
function canCutWithConsecutivePairs(
  cuttingCombination: CardCombination,
  targetCombination: CardCombination,
  vongState: VongState,
  currentPlayerIndex: number,
  singleHeoTracking: SingleHeoTrackingState,
): CanCutResult {
  const cuttingLength = cuttingCombination.cards.length / 2; // Number of pairs
  const is3DoiThong = cuttingLength === 3;
  const is4DoiThong = cuttingLength === 4;

  if (!is3DoiThong && !is4DoiThong) {
    return {
      canCut: false,
      reason: 'Only 3 đôi thông or 4 đôi thông can cut',
    };
  }

  // Check vòng requirement (4 đôi thông doesn't need vòng)
  if (is3DoiThong && !hasVong(vongState, currentPlayerIndex)) {
    return {
      canCut: false,
      reason: '3 đôi thông requires vòng to cut',
    };
  }

  const targetType = targetCombination.type;

  // Check if cutting single heos
  if (targetType === 'single' && targetCombination.cards[0].rank === '2') {
    const heoCount = getConsecutiveSingleHeoCount(singleHeoTracking);
    if (heoCount === 0) {
      // This shouldn't happen if tracking is correct, but handle it
      return {
        canCut: false,
        reason: 'No consecutive single heos tracked',
      };
    }

    if (is3DoiThong) {
      // 3 đôi thông can cut 1-4 single heos
      if (heoCount < 1 || heoCount > 4) {
        return {
          canCut: false,
          reason: `3 đôi thông can only cut 1-4 single heos, but ${heoCount} are tracked`,
        };
      }
    } else if (is4DoiThong) {
      // 4 đôi thông can cut 1 single heo
      if (heoCount !== 1) {
        return {
          canCut: false,
          reason: `4 đôi thông can only cut 1 single heo, but ${heoCount} are tracked`,
        };
      }
    }

    // Calculate penalty: sum of all heo values
    const penaltyPoints = calculateHeoPenalty(singleHeoTracking);
    return {
      canCut: true,
      penaltyPoints,
      heoCount,
    };
  }

  // Check if cutting đôi heo (only 4 đôi thông can do this)
  if (isDoiHeo(targetCombination)) {
    if (!is4DoiThong) {
      return {
        canCut: false,
        reason: 'Only 4 đôi thông can cut đôi heo',
      };
    }

    // Calculate penalty: 2 × heo value (sum of both heo values)
    const penaltyPoints = calculateDoiHeoPenalty(targetCombination);
    return {
      canCut: true,
      penaltyPoints,
      heoCount: 0, // Not single heos
    };
  }

  // Check if cutting 3 đôi thông
  if (targetType === 'consecutive_pairs' && targetCombination.cards.length === 6) {
    if (is3DoiThong) {
      // 3 đôi thông can cut 3 đôi thông of smaller rank
      const comparison = compareCombinations(cuttingCombination, targetCombination);
      if (comparison <= 0) {
        return {
          canCut: false,
          reason: '3 đôi thông can only cut 3 đôi thông of smaller rank',
        };
      }
      return {
        canCut: true,
        penaltyPoints: 4, // Hàng penalty
        heoCount: 0,
      };
    } else if (is4DoiThong) {
      // 4 đôi thông can cut 3 đôi thông of any rank
      return {
        canCut: true,
        penaltyPoints: 4, // Hàng penalty
        heoCount: 0,
      };
    }
  }

  // Check if cutting tứ quý (only 4 đôi thông can do this)
  if (targetType === 'four_of_kind') {
    if (!is4DoiThong) {
      return {
        canCut: false,
        reason: 'Only 4 đôi thông can cut tứ quý',
      };
    }
    return {
      canCut: true,
      penaltyPoints: 4, // Hàng penalty
      heoCount: 0,
    };
  }

  // Check if cutting 4 đôi thông (only 4 đôi thông can do this, and must be smaller rank)
  if (targetType === 'consecutive_pairs' && targetCombination.cards.length === 8) {
    if (!is4DoiThong) {
      return {
        canCut: false,
        reason: 'Only 4 đôi thông can cut 4 đôi thông',
      };
    }
    const comparison = compareCombinations(cuttingCombination, targetCombination);
    if (comparison <= 0) {
      return {
        canCut: false,
        reason: '4 đôi thông can only cut 4 đôi thông of smaller rank',
      };
    }
    return {
      canCut: true,
      penaltyPoints: 4, // Hàng penalty
      heoCount: 0,
    };
  }

  return {
    canCut: false,
    reason: `Consecutive pairs cannot cut combination type ${targetType}`,
  };
}

/**
 * Checks if tứ quý can cut a target combination
 *
 * @param cuttingCombination - The tứ quý attempting to cut
 * @param targetCombination - The combination being cut
 * @param vongState - Current vòng state
 * @param currentPlayerIndex - Index of current player attempting to cut
 * @param singleHeoTracking - Current single heo tracking state
 * @returns CanCutResult
 */
function canCutWithFourOfKind(
  cuttingCombination: CardCombination,
  targetCombination: CardCombination,
  vongState: VongState,
  currentPlayerIndex: number,
  singleHeoTracking: SingleHeoTrackingState,
): CanCutResult {
  // Subtask 2.5.3.2: Implement tứ quý cutting rules
  // Tứ quý requires vòng
  if (!hasVong(vongState, currentPlayerIndex)) {
    return {
      canCut: false,
      reason: 'Tứ quý requires vòng to cut',
    };
  }

  const targetType = targetCombination.type;

  // Check if cutting single heos
  if (targetType === 'single' && targetCombination.cards[0].rank === '2') {
    const heoCount = getConsecutiveSingleHeoCount(singleHeoTracking);
    if (heoCount === 0) {
      return {
        canCut: false,
        reason: 'No consecutive single heos tracked',
      };
    }

    // Tứ quý can cut 1-4 single heos
    if (heoCount < 1 || heoCount > 4) {
      return {
        canCut: false,
        reason: `Tứ quý can only cut 1-4 single heos, but ${heoCount} are tracked`,
      };
    }

    // Calculate penalty: sum of all heo values
    const penaltyPoints = calculateHeoPenalty(singleHeoTracking);
    return {
      canCut: true,
      penaltyPoints,
      heoCount,
    };
  }

  // Check if cutting 3 đôi thông
  if (targetType === 'consecutive_pairs' && targetCombination.cards.length === 6) {
    // Tứ quý can cut 3 đôi thông of any rank
    return {
      canCut: true,
      penaltyPoints: 4, // Hàng penalty
      heoCount: 0,
    };
  }

  // Check if cutting tứ quý
  if (targetType === 'four_of_kind') {
    // Tứ quý can cut tứ quý of smaller rank
    const comparison = compareCombinations(cuttingCombination, targetCombination);
    if (comparison <= 0) {
      return {
        canCut: false,
        reason: 'Tứ quý can only cut tứ quý of smaller rank',
      };
    }
    return {
      canCut: true,
      penaltyPoints: 4, // Hàng penalty
      heoCount: 0,
    };
  }

  return {
    canCut: false,
    reason: `Tứ quý cannot cut combination type ${targetType}`,
  };
}

/**
 * Calculates penalty points for cutting consecutive single heos
 *
 * @param singleHeoTracking - Current single heo tracking state
 * @returns Total penalty points (sum of all heo values)
 */
function calculateHeoPenalty(singleHeoTracking: SingleHeoTrackingState): number {
  let total = 0;
  for (const heo of singleHeoTracking.consecutiveSingleHeos) {
    total += getCardPoints(heo);
  }
  return total;
}

/**
 * Calculates penalty points for cutting đôi heo
 *
 * @param doiHeoCombination - The đôi heo combination
 * @returns Total penalty points (sum of both heo values)
 */
function calculateDoiHeoPenalty(doiHeoCombination: CardCombination): number {
  let total = 0;
  for (const card of doiHeoCombination.cards) {
    total += getCardPoints(card);
  }
  return total;
}
