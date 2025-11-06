import { Card } from '../../types/game';
import { ValidationException } from '../../common/exceptions';

/**
 * Result of dealing cards to players.
 */
export interface DealCardsResult {
  /** Array of player hands, each containing exactly 13 cards */
  playerHands: Card[][];
  /** Cards not dealt (for 2-3 player games) */
  unusedCards: Card[];
  /** Instant win information if Tứ Quý Heo is detected */
  instantWin: {
    hasInstantWin: boolean;
    playerIndex?: number;
    type?: string;
  };
}

/**
 * Checks if a player's hand contains Tứ Quý Heo (all four cards of rank '2').
 *
 * Tứ Quý Heo is an instant win condition where a player receives all 4 cards
 * of rank '2' (heo: ♠2, ♣2, ♦2, ♥2) during the deal.
 *
 * @param hand - The player's hand (array of cards)
 * @returns true if the hand contains all four cards of rank '2', false otherwise
 */
export function hasTuQuyHeo(hand: Card[]): boolean {
  const heoCards = hand.filter((card) => card.rank === '2');
  return heoCards.length === 4;
}

/**
 * Deals cards from a shuffled deck to players.
 *
 * Distribution rules:
 * - Each player receives exactly 13 cards
 * - Cards are dealt in round-robin fashion (one card per player, then repeat)
 * - For 2-3 player games, unused cards are set aside
 *   - 2 players: 26 cards unused (2 × 13 = 26 cards dealt)
 *   - 3 players: 13 cards unused (3 × 13 = 39 cards dealt)
 *   - 4 players: 0 cards unused (4 × 13 = 52 cards dealt)
 *
 * Special rule - Tứ Quý Heo:
 * If all 4 cards of rank '2' (heo) are dealt to a single player,
 * that player wins immediately (tới trắng).
 *
 * @param deck - Shuffled deck of cards (should be 52 cards)
 * @param numPlayers - Number of players (2, 3, or 4)
 * @returns DealCardsResult containing player hands, unused cards, and instant win info
 * @throws ValidationException if deck is invalid or numPlayers is out of range
 */
export function dealCards(deck: Card[], numPlayers: number): DealCardsResult {
  // Validate number of players
  if (numPlayers < 2 || numPlayers > 4) {
    throw new ValidationException(
      `Invalid number of players: ${numPlayers}. Must be between 2 and 4.`,
      undefined,
      { numPlayers, validRange: [2, 3, 4] },
    );
  }

  // Validate deck size
  if (deck.length !== 52) {
    throw new ValidationException(
      `Invalid deck size: ${deck.length}. Expected 52 cards.`,
      undefined,
      { deckSize: deck.length, expectedSize: 52 },
    );
  }

  // Calculate cards needed
  const cardsPerPlayer = 13;
  const totalCardsNeeded = numPlayers * cardsPerPlayer;

  // Validate we have enough cards
  if (totalCardsNeeded > deck.length) {
    throw new ValidationException(
      `Not enough cards in deck. Need ${totalCardsNeeded} cards for ${numPlayers} players, but deck only has ${deck.length} cards.`,
      undefined,
      { numPlayers, cardsPerPlayer, totalCardsNeeded, deckSize: deck.length },
    );
  }

  // Initialize player hands
  const playerHands: Card[][] = [];
  for (let i = 0; i < numPlayers; i++) {
    playerHands.push([]);
  }

  // Deal cards in round-robin fashion (one card per player, then repeat)
  for (let i = 0; i < totalCardsNeeded; i++) {
    const playerIndex = i % numPlayers;
    playerHands[playerIndex].push(deck[i]);
  }

  // Get unused cards (for 2-3 player games)
  const unusedCards = deck.slice(totalCardsNeeded);

  // Validate card distribution
  for (let i = 0; i < numPlayers; i++) {
    if (playerHands[i].length !== cardsPerPlayer) {
      throw new ValidationException(
        `Invalid card distribution: Player ${i} received ${playerHands[i].length} cards, expected ${cardsPerPlayer}.`,
        undefined,
        { playerIndex: i, received: playerHands[i].length, expected: cardsPerPlayer },
      );
    }
  }

  // Check for Tứ Quý Heo (instant win condition)
  let instantWinPlayerIndex: number | undefined;
  for (let i = 0; i < numPlayers; i++) {
    if (hasTuQuyHeo(playerHands[i])) {
      instantWinPlayerIndex = i;
      break;
    }
  }

  return {
    playerHands,
    unusedCards,
    instantWin: {
      hasInstantWin: instantWinPlayerIndex !== undefined,
      playerIndex: instantWinPlayerIndex,
      type: instantWinPlayerIndex !== undefined ? 'tu_quy_heo' : undefined,
    },
  };
}

