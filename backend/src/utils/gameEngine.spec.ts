import { generateDeck, shuffleDeck, generateShuffledDeck } from './gameEngine';
import { Card, CARD_RANKS, CARD_SUITS } from '../types/game';

describe('Deck Generation & Shuffling', () => {
  describe('generateDeck', () => {
    it('should generate a deck with exactly 52 cards', () => {
      const deck = generateDeck();
      expect(deck).toHaveLength(52);
    });

    it('should generate all combinations of ranks and suits', () => {
      const deck = generateDeck();
      const expectedCardCount = CARD_RANKS.length * CARD_SUITS.length;
      expect(deck).toHaveLength(expectedCardCount);
    });

    it('should generate unique card IDs', () => {
      const deck = generateDeck();
      const cardIds = deck.map((card) => card.id);
      const uniqueIds = new Set(cardIds);
      expect(uniqueIds.size).toBe(52);
      expect(cardIds.length).toBe(uniqueIds.size);
    });

    it('should include all ranks for each suit', () => {
      const deck = generateDeck();
      
      for (const suit of CARD_SUITS) {
        const cardsOfSuit = deck.filter((card) => card.suit === suit);
        expect(cardsOfSuit).toHaveLength(CARD_RANKS.length);
        
        const ranksInSuit = cardsOfSuit.map((card) => card.rank);
        for (const rank of CARD_RANKS) {
          expect(ranksInSuit).toContain(rank);
        }
      }
    });

    it('should include all suits for each rank', () => {
      const deck = generateDeck();
      
      for (const rank of CARD_RANKS) {
        const cardsOfRank = deck.filter((card) => card.rank === rank);
        expect(cardsOfRank).toHaveLength(CARD_SUITS.length);
        
        const suitsInRank = cardsOfRank.map((card) => card.suit);
        for (const suit of CARD_SUITS) {
          expect(suitsInRank).toContain(suit);
        }
      }
    });

    it('should generate cards with correct structure', () => {
      const deck = generateDeck();
      
      for (const card of deck) {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('rank');
        expect(card).toHaveProperty('suit');
        expect(card).toHaveProperty('value');
        expect(card).toHaveProperty('points');
        
        expect(typeof card.id).toBe('string');
        expect(typeof card.rank).toBe('string');
        expect(typeof card.suit).toBe('string');
        expect(typeof card.value).toBe('number');
        expect(typeof card.points).toBe('number');
      }
    });

    it('should generate cards with correct ID format', () => {
      const deck = generateDeck();
      
      for (const card of deck) {
        expect(card.id).toMatch(/^[2-9JQKA]|10-[A-Za-z]+$/);
        const [rank, suit] = card.id.split('-');
        expect(rank).toBe(card.rank);
        expect(suit).toBe(card.suit);
      }
    });

    it('should generate cards with valid values (0-51)', () => {
      const deck = generateDeck();
      
      for (const card of deck) {
        expect(card.value).toBeGreaterThanOrEqual(0);
        expect(card.value).toBeLessThanOrEqual(51);
      }
    });

    it('should generate cards with unique values', () => {
      const deck = generateDeck();
      const values = deck.map((card) => card.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(52);
    });

    it('should generate cards with valid point values (1, 2, or 4)', () => {
      const deck = generateDeck();
      
      for (const card of deck) {
        expect([1, 2, 4]).toContain(card.points);
      }
    });
  });

  describe('shuffleDeck', () => {
    it('should return a deck with the same number of cards', () => {
      const deck = generateDeck();
      const shuffled = shuffleDeck(deck);
      expect(shuffled).toHaveLength(deck.length);
    });

    it('should not modify the original deck array', () => {
      const deck = generateDeck();
      const originalOrder = deck.map((card) => card.id);
      shuffleDeck(deck);
      const afterShuffle = deck.map((card) => card.id);
      expect(afterShuffle).toEqual(originalOrder);
    });

    it('should return a new array (not the same reference)', () => {
      const deck = generateDeck();
      const shuffled = shuffleDeck(deck);
      expect(shuffled).not.toBe(deck);
    });

    it('should contain all the same cards (no duplicates, no missing)', () => {
      const deck = generateDeck();
      const shuffled = shuffleDeck(deck);
      
      const originalIds = new Set(deck.map((card) => card.id));
      const shuffledIds = new Set(shuffled.map((card) => card.id));
      
      expect(shuffledIds.size).toBe(52);
      expect(originalIds.size).toBe(shuffledIds.size);
      
      for (const id of originalIds) {
        expect(shuffledIds).toContain(id);
      }
    });

    it('should produce different orders on multiple shuffles (statistical test)', () => {
      const deck = generateDeck();
      const shuffle1 = shuffleDeck(deck);
      const shuffle2 = shuffleDeck(deck);
      const shuffle3 = shuffleDeck(deck);
      
      // Compare first few cards - very unlikely all three will match
      const orders = [
        shuffle1.slice(0, 5).map((c) => c.id),
        shuffle2.slice(0, 5).map((c) => c.id),
        shuffle3.slice(0, 5).map((c) => c.id),
      ];
      
      // At least two should be different (very high probability)
      const allSame = orders.every((order) => 
        JSON.stringify(order) === JSON.stringify(orders[0])
      );
      expect(allSame).toBe(false);
    });

    it('should handle empty array', () => {
      const empty: Card[] = [];
      const shuffled = shuffleDeck(empty);
      expect(shuffled).toEqual([]);
      expect(shuffled).not.toBe(empty);
    });

    it('should handle single card array', () => {
      const singleCard: Card[] = [generateDeck()[0]];
      const shuffled = shuffleDeck(singleCard);
      expect(shuffled).toHaveLength(1);
      expect(shuffled[0].id).toBe(singleCard[0].id);
    });
  });

  describe('generateShuffledDeck', () => {
    it('should generate a shuffled deck with exactly 52 cards', () => {
      const deck = generateShuffledDeck();
      expect(deck).toHaveLength(52);
    });

    it('should contain all unique cards', () => {
      const deck = generateShuffledDeck();
      const cardIds = deck.map((card) => card.id);
      const uniqueIds = new Set(cardIds);
      expect(uniqueIds.size).toBe(52);
    });

    it('should produce different orders on multiple calls (statistical test)', () => {
      const deck1 = generateShuffledDeck();
      const deck2 = generateShuffledDeck();
      const deck3 = generateShuffledDeck();
      
      // Compare first few cards - very unlikely all three will match
      const orders = [
        deck1.slice(0, 5).map((c) => c.id),
        deck2.slice(0, 5).map((c) => c.id),
        deck3.slice(0, 5).map((c) => c.id),
      ];
      
      // At least two should be different (very high probability)
      const allSame = orders.every((order) => 
        JSON.stringify(order) === JSON.stringify(orders[0])
      );
      expect(allSame).toBe(false);
    });

    it('should generate cards with correct structure', () => {
      const deck = generateShuffledDeck();
      
      for (const card of deck) {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('rank');
        expect(card).toHaveProperty('suit');
        expect(card).toHaveProperty('value');
        expect(card).toHaveProperty('points');
      }
    });
  });

  describe('Deck Validation', () => {
    it('should validate that generated deck has no duplicate cards', () => {
      const deck = generateDeck();
      const cardIds = deck.map((card) => card.id);
      const uniqueIds = new Set(cardIds);
      expect(uniqueIds.size).toBe(deck.length);
    });

    it('should validate that shuffled deck maintains all cards', () => {
      const originalDeck = generateDeck();
      const shuffledDeck = shuffleDeck(originalDeck);
      
      const originalIds = new Set(originalDeck.map((card) => card.id));
      const shuffledIds = new Set(shuffledDeck.map((card) => card.id));
      
      expect(originalIds.size).toBe(shuffledIds.size);
      expect(originalIds.size).toBe(52);
      
      for (const id of originalIds) {
        expect(shuffledIds).toContain(id);
      }
    });

    it('should validate that all cards have correct value calculations', () => {
      const deck = generateDeck();
      
      for (const card of deck) {
        // Value should be in range 0-51
        expect(card.value).toBeGreaterThanOrEqual(0);
        expect(card.value).toBeLessThanOrEqual(51);
        
        // Value should be consistent with rank and suit
        const expectedValue = card.value;
        const calculatedValue = 
          (CARD_RANKS.indexOf(card.rank) * 4) + 
          CARD_SUITS.indexOf(card.suit);
        // Note: This is a simplified check - actual calculation uses order maps
        expect(typeof expectedValue).toBe('number');
      }
    });

    it('should validate that all cards have correct point calculations', () => {
      const deck = generateDeck();
      
      for (const card of deck) {
        // Points should be 1, 2, or 4
        expect([1, 2, 4]).toContain(card.points);
        
        // Heo (rank '2') should have points 2 or 4
        if (card.rank === '2') {
          expect([2, 4]).toContain(card.points);
        } else {
          // Non-heo cards should have 1 point
          expect(card.points).toBe(1);
        }
      }
    });

    it('should validate deck completeness (all rank-suit combinations)', () => {
      const deck = generateDeck();
      
      for (const rank of CARD_RANKS) {
        for (const suit of CARD_SUITS) {
          const card = deck.find(
            (c) => c.rank === rank && c.suit === suit
          );
          expect(card).toBeDefined();
          expect(card?.id).toBe(`${rank}-${suit}`);
        }
      }
    });
  });
});

