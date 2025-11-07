import { Card, RANK_3, SUIT_SPADES } from '../../types/game';
import { detectCombination, compareCombinations, CardCombination } from './combinations';

/**
 * Move validation error codes
 */
export const MOVE_VALIDATION_ERROR_CODES = {
  NO_CARDS_SELECTED: 'NO_CARDS_SELECTED',
  CARDS_NOT_IN_HAND: 'CARDS_NOT_IN_HAND',
  INVALID_COMBINATION: 'INVALID_COMBINATION',
  MISSING_SPADE_3: 'MISSING_SPADE_3',
  INVALID_STATE: 'INVALID_STATE',
  COMBINATION_TYPE_MISMATCH: 'COMBINATION_TYPE_MISMATCH',
  COMBINATION_TOO_LOW: 'COMBINATION_TOO_LOW',
} as const;

/**
 * Move validation error messages
 */
export const MOVE_VALIDATION_ERROR_MESSAGES = {
  NO_CARDS_SELECTED: 'No cards selected to play',
  CARDS_NOT_IN_HAND: 'Some selected cards are not in player hand',
  INVALID_COMBINATION: 'Selected cards do not form a valid combination',
  MISSING_SPADE_3: 'First play in initial round must include ♠3 (3 Spades)',
  INVALID_STATE: 'No last play found but not first player in round',
  COMBINATION_TYPE_MISMATCH: (expectedType: string, actualType: string) =>
    `Combination type mismatch. Expected ${expectedType}, got ${actualType}`,
  COMBINATION_TOO_LOW:
    'Combination does not beat last play. Must be higher value than the last play',
} as const;

/**
 * Result of move validation
 */
export interface MoveValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: string;
  metadata?: Record<string, any>;
}

/**
 * Context for move validation
 */
export interface MoveValidationContext {
  /** Cards the player wants to play */
  cardsToPlay: Card[];
  /** Player's current hand */
  playerHand: Card[];
  /** Last play in the current round (null if first player) */
  lastPlay: CardCombination | null;
  /** Whether this is the first player in the current round */
  isFirstPlayerInRound: boolean;
  /** Whether this is the initial round (ván khởi đầu) */
  isInitialRound: boolean;
}

/**
 * Validates if a move is legal in Tiến Lên Miền Nam
 *
 * Validation rules:
 * 1. Player must have all selected cards in their hand
 * 2. Cards must form a valid combination
 * 3. If first player in round:
 *    - Can play any valid combination
 *    - If initial round: must include ♠3 (3 Spades)
 * 4. If not first player:
 *    - Combination type must match last play
 *    - Combination must beat last play (higher value)
 *
 * @param context - Move validation context
 * @returns MoveValidationResult with validation status and error details
 */
export function isValidMove(context: MoveValidationContext): MoveValidationResult {
  const { cardsToPlay, playerHand, lastPlay, isFirstPlayerInRound, isInitialRound } = context;

  // Subtask 2.4.1.5: Validate player has selected cards in hand
  const handValidation = validateCardsInHand(cardsToPlay, playerHand);
  if (!handValidation.isValid) {
    return handValidation;
  }

  // Detect combination from cards
  const combination = detectCombination(cardsToPlay);
  if (!combination) {
    return {
      isValid: false,
      error: MOVE_VALIDATION_ERROR_MESSAGES.INVALID_COMBINATION,
      errorCode: MOVE_VALIDATION_ERROR_CODES.INVALID_COMBINATION,
      metadata: {
        cards: cardsToPlay.map((c) => ({ rank: c.rank, suit: c.suit })),
      },
    };
  }

  // Subtask 2.4.1.4: Handle first player in round (no restrictions except ♠3 rule)
  if (isFirstPlayerInRound) {
    // If initial round, must include ♠3
    if (isInitialRound) {
      const hasSpade3 = cardsToPlay.some(
        (card) => card.rank === RANK_3 && card.suit === SUIT_SPADES,
      );
      if (!hasSpade3) {
        return {
          isValid: false,
          error: MOVE_VALIDATION_ERROR_MESSAGES.MISSING_SPADE_3,
          errorCode: MOVE_VALIDATION_ERROR_CODES.MISSING_SPADE_3,
          metadata: {
            isInitialRound: true,
            combinationType: combination.type,
          },
        };
      }
    }

    // First player can play any valid combination
    return {
      isValid: true,
    };
  }

  // Not first player - must match and beat last play
  if (!lastPlay) {
    return {
      isValid: false,
      error: MOVE_VALIDATION_ERROR_MESSAGES.INVALID_STATE,
      errorCode: MOVE_VALIDATION_ERROR_CODES.INVALID_STATE,
      metadata: {
        isFirstPlayerInRound,
      },
    };
  }

  // Subtask 2.4.1.2: Validate combination type matches last play
  if (combination.type !== lastPlay.type) {
    return {
      isValid: false,
      error: MOVE_VALIDATION_ERROR_MESSAGES.COMBINATION_TYPE_MISMATCH(
        lastPlay.type,
        combination.type,
      ),
      errorCode: MOVE_VALIDATION_ERROR_CODES.COMBINATION_TYPE_MISMATCH,
      metadata: {
        expectedType: lastPlay.type,
        actualType: combination.type,
        lastPlayCards: lastPlay.cards.map((c) => ({ rank: c.rank, suit: c.suit })),
        playedCards: cardsToPlay.map((c) => ({ rank: c.rank, suit: c.suit })),
      },
    };
  }

  // Subtask 2.4.1.3: Validate combination beats last play (higher value)
  const comparison = compareCombinations(combination, lastPlay);
  if (comparison <= 0) {
    return {
      isValid: false,
      error: MOVE_VALIDATION_ERROR_MESSAGES.COMBINATION_TOO_LOW,
      errorCode: MOVE_VALIDATION_ERROR_CODES.COMBINATION_TOO_LOW,
      metadata: {
        combinationType: combination.type,
        combinationRank: combination.rank,
        lastPlayRank: lastPlay.rank,
        comparisonResult: comparison,
        lastPlayCards: lastPlay.cards.map((c) => ({ rank: c.rank, suit: c.suit })),
        playedCards: cardsToPlay.map((c) => ({ rank: c.rank, suit: c.suit })),
      },
    };
  }

  // All validations passed
  return {
    isValid: true,
  };
}

/**
 * Validates that all cards to play are in the player's hand
 *
 * @param cardsToPlay - Cards the player wants to play
 * @param playerHand - Player's current hand
 * @returns MoveValidationResult
 */
function validateCardsInHand(cardsToPlay: Card[], playerHand: Card[]): MoveValidationResult {
  if (!cardsToPlay || cardsToPlay.length === 0) {
    return {
      isValid: false,
      error: MOVE_VALIDATION_ERROR_MESSAGES.NO_CARDS_SELECTED,
      errorCode: MOVE_VALIDATION_ERROR_CODES.NO_CARDS_SELECTED,
    };
  }

  // Create a map of card IDs in hand for quick lookup
  const handCardMap = new Map<string, number>();
  for (const card of playerHand) {
    const key = getCardKey(card);
    handCardMap.set(key, (handCardMap.get(key) || 0) + 1);
  }

  // Check each card to play
  const missingCards: Card[] = [];
  const playCardMap = new Map<string, number>();
  for (const card of cardsToPlay) {
    const key = getCardKey(card);
    playCardMap.set(key, (playCardMap.get(key) || 0) + 1);

    const countInHand = handCardMap.get(key) || 0;
    const countToPlay = playCardMap.get(key) || 0;

    if (countToPlay > countInHand) {
      missingCards.push(card);
    }
  }

  if (missingCards.length > 0) {
    return {
      isValid: false,
      error: MOVE_VALIDATION_ERROR_MESSAGES.CARDS_NOT_IN_HAND,
      errorCode: MOVE_VALIDATION_ERROR_CODES.CARDS_NOT_IN_HAND,
      metadata: {
        missingCards: missingCards.map((c) => ({ rank: c.rank, suit: c.suit, id: c.id })),
        playerHandSize: playerHand.length,
        cardsToPlaySize: cardsToPlay.length,
      },
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Generates a unique key for a card based on rank, suit, and id
 * This helps identify duplicate cards
 *
 * @param card - Card to generate key for
 * @returns Unique key string
 */
function getCardKey(card: Card): string {
  // Use id if available, otherwise use rank+suit
  return card.id || `${card.rank}-${card.suit}`;
}
