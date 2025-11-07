import { generateDeck } from './deck';
import { Card } from '../../types/game';
import { NotFoundException } from '../../common/exceptions';

/**
 * Helper function to create a card by rank and suit
 * @param rank - Card rank (e.g., '3', 'A', '2')
 * @param suit - Card suit (e.g., 'Spades', 'Hearts', 'Diamonds', 'Clubs')
 * @returns Card object matching the specified rank and suit
 * @throws NotFoundException if card not found in deck
 */
export function createCard(rank: string, suit: string): Card {
  const deck = generateDeck();
  const card = deck.find((c) => c.rank === rank && c.suit === suit);
  if (!card) {
    throw new NotFoundException('Card', `${rank}${suit}`);
  }
  return card;
}

/**
 * Helper function to create multiple cards of the same rank with different suits
 * @param rank - Card rank (e.g., '3', 'A', '2')
 * @param suits - Array of suits to create cards for
 * @returns Array of Card objects with the specified rank and suits
 */
export function createCardsOfRank(rank: string, suits: string[]): Card[] {
  return suits.map((suit) => createCard(rank, suit));
}
