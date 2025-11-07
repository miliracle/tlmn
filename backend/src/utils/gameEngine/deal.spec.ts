import { dealCards } from './deal';
import { generateDeck, generateShuffledDeck } from './deck';
import { Card } from '../../types/game';
import { ValidationException } from '../../common/exceptions';

describe('Card Distribution', () => {
  describe('dealCards', () => {
    it('should deal 13 cards to each player for 4 players', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 4);

      expect(result.playerHands).toHaveLength(4);
      for (let i = 0; i < 4; i++) {
        expect(result.playerHands[i]).toHaveLength(13);
      }
    });

    it('should deal 13 cards to each player for 3 players', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 3);

      expect(result.playerHands).toHaveLength(3);
      for (let i = 0; i < 3; i++) {
        expect(result.playerHands[i]).toHaveLength(13);
      }
    });

    it('should deal 13 cards to each player for 2 players', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 2);

      expect(result.playerHands).toHaveLength(2);
      for (let i = 0; i < 2; i++) {
        expect(result.playerHands[i]).toHaveLength(13);
      }
    });

    it('should have no unused cards for 4 players', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 4);

      expect(result.unusedCards).toHaveLength(0);
    });

    it('should have 13 unused cards for 3 players', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 3);

      expect(result.unusedCards).toHaveLength(13);
    });

    it('should have 26 unused cards for 2 players', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 2);

      expect(result.unusedCards).toHaveLength(26);
    });

    it('should distribute all cards correctly (no duplicates, no missing)', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 4);

      // Collect all dealt cards
      const allDealtCards: Card[] = [];
      for (const hand of result.playerHands) {
        allDealtCards.push(...hand);
      }
      allDealtCards.push(...result.unusedCards);

      // Check we have exactly 52 cards
      expect(allDealtCards).toHaveLength(52);

      // Check all cards are unique
      const cardIds = allDealtCards.map((card) => card.id);
      const uniqueIds = new Set(cardIds);
      expect(uniqueIds.size).toBe(52);

      // Check all original cards are present
      const originalIds = new Set(deck.map((card) => card.id));
      const dealtIds = new Set(cardIds);
      expect(originalIds.size).toBe(dealtIds.size);
      for (const id of originalIds) {
        expect(dealtIds).toContain(id);
      }
    });

    it('should distribute cards in round-robin fashion', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 3);

      // First card goes to player 0, second to player 1, third to player 2, fourth to player 0, etc.
      expect(result.playerHands[0][0]).toBe(deck[0]);
      expect(result.playerHands[1][0]).toBe(deck[1]);
      expect(result.playerHands[2][0]).toBe(deck[2]);
      expect(result.playerHands[0][1]).toBe(deck[3]);
      expect(result.playerHands[1][1]).toBe(deck[4]);
    });

    it('should throw ValidationException for invalid number of players (< 2)', () => {
      const deck = generateShuffledDeck();

      expect(() => dealCards(deck, 1)).toThrow(ValidationException);
      expect(() => dealCards(deck, 0)).toThrow(ValidationException);
      expect(() => dealCards(deck, -1)).toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid number of players (> 4)', () => {
      const deck = generateShuffledDeck();

      expect(() => dealCards(deck, 5)).toThrow(ValidationException);
      expect(() => dealCards(deck, 10)).toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid deck size', () => {
      const invalidDeck: Card[] = [];

      expect(() => dealCards(invalidDeck, 4)).toThrow(ValidationException);

      const shortDeck = generateDeck().slice(0, 51);
      expect(() => dealCards(shortDeck, 4)).toThrow(ValidationException);

      const longDeck = [...generateDeck(), generateDeck()[0]];
      expect(() => dealCards(longDeck, 4)).toThrow(ValidationException);
    });

    it('should validate that all players receive exactly 13 cards', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 4);

      for (let i = 0; i < 4; i++) {
        expect(result.playerHands[i].length).toBe(13);
      }
    });
  });
});
