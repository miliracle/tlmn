/**
 * Chặt Penalty Calculation for Tiến Lên Miền Nam
 *
 * Implements penalty calculation for cutting (chặt) actions.
 * Penalties are calculated based on what was cut (heo or hàng).
 *
 * Task 2.8.1: Chặt Penalty Calculation
 */

import {
  Card,
  RANK_2,
  SUIT_SPADES,
  SUIT_CLUBS,
  SUIT_DIAMONDS,
  SUIT_HEARTS,
} from '../../types/game';
import { CardCombination } from './combinations';
import { SingleHeoTrackingState, getConsecutiveSingleHeos, isDoiHeo } from './singleHeoTracking';
import { ValidationException } from '../../common/exceptions';

/**
 * Penalty tracking state for a single player
 */
export interface PlayerPenaltyState {
  /** Total penalties paid by this player (negative points) */
  penaltiesPaid: number;
  /** Total penalties received by this player (positive points) */
  penaltiesReceived: number;
}

/**
 * Penalty tracking state for all players in the game
 */
export interface GamePenaltyState {
  /** Map of player index to their penalty state */
  playerPenalties: Map<number, PlayerPenaltyState>;
  /** Total number of players */
  numPlayers: number;
}

/**
 * Gets the penalty point value for a single heo card based on suit
 *
 * Subtask 2.8.1.1: Calculate penalty for cutting 1 heo (1-2 points)
 *
 * Penalty values from core_concept.md:
 * - Heo bích (♠2) = 1 point
 * - Heo chuồn (♣2) = 1 point
 * - Heo rô (♦2) = 2 points
 * - Heo cơ (♥2) = 2 points
 *
 * @param suit - The suit of the heo card
 * @returns Penalty points (1 or 2)
 * @throws ValidationException if suit is invalid
 */
export function getHeoPenaltyValue(suit: string): number {
  if (suit === SUIT_SPADES || suit === SUIT_CLUBS) {
    return 1;
  }
  if (suit === SUIT_DIAMONDS || suit === SUIT_HEARTS) {
    return 2;
  }
  throw new ValidationException(`Invalid suit for heo penalty: ${suit}`, undefined, {
    suit,
    validSuits: [SUIT_SPADES, SUIT_CLUBS, SUIT_DIAMONDS, SUIT_HEARTS],
  });
}

/**
 * Calculates penalty for cutting 1 heo
 *
 * Subtask 2.8.1.1: Calculate penalty for cutting 1 heo (1-2 points)
 *
 * @param heoCard - The single heo card that was cut
 * @returns Penalty points (1 or 2)
 */
export function calculateSingleHeoPenalty(heoCard: Card): number {
  if (heoCard.rank !== RANK_2) {
    throw new ValidationException(
      'Card must be a heo (rank 2) for single heo penalty calculation',
      undefined,
      {
        cardRank: heoCard.rank,
      },
    );
  }
  return getHeoPenaltyValue(heoCard.suit);
}

/**
 * Calculates penalty for cutting 2-4 consecutive single heos
 *
 * Subtask 2.8.1.2: Calculate penalty for cutting 2-4 heo (sum of values)
 *
 * @param singleHeoTracking - Single heo tracking state containing consecutive heos
 * @returns Total penalty points (sum of all heo values, 2-8 points)
 */
export function calculateMultipleHeoPenalty(singleHeoTracking: SingleHeoTrackingState): number {
  const consecutiveHeos = getConsecutiveSingleHeos(singleHeoTracking);

  if (consecutiveHeos.length === 0) {
    return 0;
  }

  if (consecutiveHeos.length > 4) {
    throw new ValidationException(
      `Cannot cut more than 4 consecutive single heos. Found: ${consecutiveHeos.length}`,
      undefined,
      { heoCount: consecutiveHeos.length },
    );
  }

  let total = 0;
  for (const heo of consecutiveHeos) {
    total += getHeoPenaltyValue(heo.suit);
  }

  return total;
}

/**
 * Calculates penalty for cutting đôi heo (pair of 2s)
 *
 * Subtask 2.8.1.3: Calculate penalty for cutting đôi heo (2 × heo value)
 *
 * According to core_concept.md:
 * - Cutting đôi heo: Pay 2 × (heo value) = 4-8 points total (depending on suits)
 * - This means: sum of both heo values (each heo is 1-2 points)
 *
 * @param doiHeoCombination - The đôi heo combination that was cut
 * @returns Total penalty points (sum of both heo values, 2-4 points)
 */
export function calculateDoiHeoPenalty(doiHeoCombination: CardCombination): number {
  if (!isDoiHeo(doiHeoCombination)) {
    throw new ValidationException(
      'Combination must be đôi heo (pair of 2s) for đôi heo penalty calculation',
      undefined,
      { combinationType: doiHeoCombination.type },
    );
  }

  if (doiHeoCombination.cards.length !== 2) {
    throw new ValidationException('Đôi heo must contain exactly 2 cards', undefined, {
      cardCount: doiHeoCombination.cards.length,
    });
  }

  let total = 0;
  for (const card of doiHeoCombination.cards) {
    if (card.rank !== RANK_2) {
      throw new ValidationException('All cards in đôi heo must be rank 2', undefined, {
        cardRank: card.rank,
      });
    }
    total += getHeoPenaltyValue(card.suit);
  }

  return total;
}

/**
 * Calculates penalty for cutting hàng (special combinations)
 *
 * Subtask 2.8.1.4: Calculate penalty for cutting hàng (4 points)
 *
 * Hàng combinations that can be cut:
 * - 3 đôi thông (3 consecutive pairs)
 * - Tứ quý (four of a kind)
 * - 4 đôi thông (4 consecutive pairs)
 *
 * All hàng penalties are 4 points.
 *
 * @param hangCombination - The hàng combination that was cut
 * @returns Penalty points (always 4)
 */
export function calculateHangPenalty(hangCombination: CardCombination): number {
  const hangTypes: string[] = ['consecutive_pairs', 'four_of_kind'];

  if (!hangTypes.includes(hangCombination.type)) {
    throw new ValidationException(
      'Combination must be a hàng (3 đôi thông, tứ quý, or 4 đôi thông) for hàng penalty calculation',
      undefined,
      { combinationType: hangCombination.type },
    );
  }

  // For consecutive pairs, must be 3 or 4 pairs
  if (hangCombination.type === 'consecutive_pairs') {
    const pairCount = hangCombination.cards.length / 2;
    if (pairCount < 3 || pairCount > 4) {
      throw new ValidationException(
        'Consecutive pairs must be 3 or 4 pairs to be considered hàng',
        undefined,
        { pairCount },
      );
    }
  }

  // All hàng penalties are 4 points
  return 4;
}

/**
 * Calculates the penalty for a cutting action
 *
 * This is the main function that determines the penalty based on what was cut.
 *
 * @param cuttingCombination - The combination used to cut (not used for calculation, but for validation)
 * @param targetCombination - The combination that was cut
 * @param singleHeoTracking - Single heo tracking state (for cutting multiple heos)
 * @returns Penalty points that the cut player must pay
 */
export function calculateChatPenalty(
  cuttingCombination: CardCombination,
  targetCombination: CardCombination,
  singleHeoTracking: SingleHeoTrackingState,
): number {
  // Check if cutting single heos (1-4 consecutive)
  const consecutiveHeos = getConsecutiveSingleHeos(singleHeoTracking);
  if (consecutiveHeos.length > 0) {
    return calculateMultipleHeoPenalty(singleHeoTracking);
  }

  // Check if cutting đôi heo
  if (isDoiHeo(targetCombination)) {
    return calculateDoiHeoPenalty(targetCombination);
  }

  // Check if cutting hàng (3 đôi thông, tứ quý, or 4 đôi thông)
  if (targetCombination.type === 'consecutive_pairs' || targetCombination.type === 'four_of_kind') {
    return calculateHangPenalty(targetCombination);
  }

  // If none of the above, this shouldn't be a cutting action
  throw new ValidationException(
    'Invalid target combination for cutting penalty calculation',
    undefined,
    { targetType: targetCombination.type },
  );
}

/**
 * Initializes penalty tracking state for a game
 *
 * Subtask 2.8.1.5: Track penalties per player during game
 *
 * @param numPlayers - Total number of players (2-4)
 * @returns Initialized GamePenaltyState
 */
export function initializePenaltyTracking(numPlayers: number): GamePenaltyState {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
      undefined,
      { numPlayers },
    );
  }

  const playerPenalties = new Map<number, PlayerPenaltyState>();
  for (let i = 0; i < numPlayers; i++) {
    playerPenalties.set(i, {
      penaltiesPaid: 0,
      penaltiesReceived: 0,
    });
  }

  return {
    playerPenalties,
    numPlayers,
  };
}

/**
 * Records a penalty payment (player was cut)
 *
 * Subtask 2.8.1.5: Track penalties per player during game
 *
 * @param penaltyState - Current penalty tracking state
 * @param playerIndex - Index of player who was cut (pays penalty)
 * @param penaltyPoints - Penalty points to add
 * @returns Updated GamePenaltyState
 */
export function recordPenaltyPayment(
  penaltyState: GamePenaltyState,
  playerIndex: number,
  penaltyPoints: number,
): GamePenaltyState {
  if (playerIndex < 0 || playerIndex >= penaltyState.numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${penaltyState.numPlayers - 1}.`,
      undefined,
      { playerIndex, numPlayers: penaltyState.numPlayers },
    );
  }

  if (penaltyPoints < 0) {
    throw new ValidationException('Penalty points must be non-negative', undefined, {
      penaltyPoints,
    });
  }

  const playerState = penaltyState.playerPenalties.get(playerIndex);
  if (!playerState) {
    throw new ValidationException(
      `Player ${playerIndex} not found in penalty tracking`,
      undefined,
      {
        playerIndex,
      },
    );
  }

  const updatedPlayerPenalties = new Map(penaltyState.playerPenalties);
  updatedPlayerPenalties.set(playerIndex, {
    ...playerState,
    penaltiesPaid: playerState.penaltiesPaid + penaltyPoints,
  });

  return {
    ...penaltyState,
    playerPenalties: updatedPlayerPenalties,
  };
}

/**
 * Records a penalty receipt (player performed cutting)
 *
 * Subtask 2.8.1.5: Track penalties per player during game
 *
 * @param penaltyState - Current penalty tracking state
 * @param playerIndex - Index of player who performed cutting (receives penalty)
 * @param penaltyPoints - Penalty points to add
 * @returns Updated GamePenaltyState
 */
export function recordPenaltyReceipt(
  penaltyState: GamePenaltyState,
  playerIndex: number,
  penaltyPoints: number,
): GamePenaltyState {
  if (playerIndex < 0 || playerIndex >= penaltyState.numPlayers) {
    throw new ValidationException(
      `Invalid player index: ${playerIndex}. Must be between 0 and ${penaltyState.numPlayers - 1}.`,
      undefined,
      { playerIndex, numPlayers: penaltyState.numPlayers },
    );
  }

  if (penaltyPoints < 0) {
    throw new ValidationException('Penalty points must be non-negative', undefined, {
      penaltyPoints,
    });
  }

  const playerState = penaltyState.playerPenalties.get(playerIndex);
  if (!playerState) {
    throw new ValidationException(
      `Player ${playerIndex} not found in penalty tracking`,
      undefined,
      {
        playerIndex,
      },
    );
  }

  const updatedPlayerPenalties = new Map(penaltyState.playerPenalties);
  updatedPlayerPenalties.set(playerIndex, {
    ...playerState,
    penaltiesReceived: playerState.penaltiesReceived + penaltyPoints,
  });

  return {
    ...penaltyState,
    playerPenalties: updatedPlayerPenalties,
  };
}

/**
 * Records a cutting action with penalty transfer (chặt chồng)
 *
 * Subtask 2.8.1.6: Handle penalty transfer (chặt chồng)
 *
 * This function integrates with the cutting chain system to handle
 * penalty transfers when multiple cuts occur in sequence.
 *
 * @param penaltyState - Current penalty tracking state
 * @param cutPlayerIndex - Index of player who was cut
 * @param cuttingPlayerIndex - Index of player who performed cutting
 * @param penaltyPoints - Penalty points for this cut
 * @param transferredPenalties - Additional penalties transferred from previous cuts in chain
 * @returns Updated GamePenaltyState
 */
export function recordCuttingWithTransfer(
  penaltyState: GamePenaltyState,
  cutPlayerIndex: number,
  cuttingPlayerIndex: number,
  penaltyPoints: number,
  transferredPenalties: number = 0,
): GamePenaltyState {
  if (cutPlayerIndex < 0 || cutPlayerIndex >= penaltyState.numPlayers) {
    throw new ValidationException(
      `Invalid cut player index: ${cutPlayerIndex}. Must be between 0 and ${penaltyState.numPlayers - 1}.`,
      undefined,
      { cutPlayerIndex, numPlayers: penaltyState.numPlayers },
    );
  }

  if (cuttingPlayerIndex < 0 || cuttingPlayerIndex >= penaltyState.numPlayers) {
    throw new ValidationException(
      `Invalid cutting player index: ${cuttingPlayerIndex}. Must be between 0 and ${penaltyState.numPlayers - 1}.`,
      undefined,
      { cuttingPlayerIndex, numPlayers: penaltyState.numPlayers },
    );
  }

  if (cutPlayerIndex === cuttingPlayerIndex) {
    throw new ValidationException('A player cannot cut themselves', undefined, {
      playerIndex: cutPlayerIndex,
    });
  }

  if (penaltyPoints < 0 || transferredPenalties < 0) {
    throw new ValidationException('Penalty points must be non-negative', undefined, {
      penaltyPoints,
      transferredPenalties,
    });
  }

  const totalPenalty = penaltyPoints + transferredPenalties;

  // The cut player pays the total penalty (including transferred)
  let updatedState = recordPenaltyPayment(penaltyState, cutPlayerIndex, totalPenalty);

  // The cutting player receives the total penalty
  updatedState = recordPenaltyReceipt(updatedState, cuttingPlayerIndex, totalPenalty);

  return updatedState;
}

/**
 * Gets the total penalties paid by a player
 *
 * @param penaltyState - Current penalty tracking state
 * @param playerIndex - Index of player
 * @returns Total penalties paid (negative points for scoring)
 */
export function getPlayerPenaltiesPaid(
  penaltyState: GamePenaltyState,
  playerIndex: number,
): number {
  const playerState = penaltyState.playerPenalties.get(playerIndex);
  if (!playerState) {
    throw new ValidationException(
      `Player ${playerIndex} not found in penalty tracking`,
      undefined,
      {
        playerIndex,
      },
    );
  }
  return playerState.penaltiesPaid;
}

/**
 * Gets the total penalties received by a player
 *
 * @param penaltyState - Current penalty tracking state
 * @param playerIndex - Index of player
 * @returns Total penalties received (positive points for scoring)
 */
export function getPlayerPenaltiesReceived(
  penaltyState: GamePenaltyState,
  playerIndex: number,
): number {
  const playerState = penaltyState.playerPenalties.get(playerIndex);
  if (!playerState) {
    throw new ValidationException(
      `Player ${playerIndex} not found in penalty tracking`,
      undefined,
      {
        playerIndex,
      },
    );
  }
  return playerState.penaltiesReceived;
}

/**
 * Gets the net penalty score for a player (received - paid)
 *
 * @param penaltyState - Current penalty tracking state
 * @param playerIndex - Index of player
 * @returns Net penalty score (positive if received more, negative if paid more)
 */
export function getPlayerNetPenaltyScore(
  penaltyState: GamePenaltyState,
  playerIndex: number,
): number {
  const received = getPlayerPenaltiesReceived(penaltyState, playerIndex);
  const paid = getPlayerPenaltiesPaid(penaltyState, playerIndex);
  return received - paid;
}
