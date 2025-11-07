import { dealCards, hasTuQuyHeo } from './deal';
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

    it('should check for Tứ Quý Heo (all four 2s) in player hands', () => {
      const deck = generateDeck();

      // Manually arrange deck so player 0 gets all four 2s
      const heoCards = deck.filter((card) => card.rank === '2');
      const otherCards = deck.filter((card) => card.rank !== '2');

      // Place all four 2s at positions that will go to player 0 in round-robin
      // For 4 players: positions 0, 4, 8, 12 go to player 0
      const arrangedDeck: Card[] = [];
      arrangedDeck[0] = heoCards[0];
      arrangedDeck[4] = heoCards[1];
      arrangedDeck[8] = heoCards[2];
      arrangedDeck[12] = heoCards[3];

      // Fill remaining positions with other cards
      let otherIndex = 0;
      for (let i = 0; i < 52; i++) {
        if (!arrangedDeck[i]) {
          arrangedDeck[i] = otherCards[otherIndex++];
        }
      }

      const result = dealCards(arrangedDeck, 4);

      expect(result.instantWin.hasInstantWin).toBe(true);
      expect(result.instantWin.playerIndex).toBe(0);
      expect(result.instantWin.type).toBe('tu_quy_heo');
    });

    it('should not detect instant win when no player has all four 2s', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 4);

      // Very unlikely that all four 2s go to the same player in a random shuffle
      // But we'll check the structure is correct
      expect(result.instantWin).toHaveProperty('hasInstantWin');
      expect(result.instantWin).toHaveProperty('playerIndex');
      expect(result.instantWin).toHaveProperty('type');

      // If no instant win, playerIndex and type should be undefined
      if (!result.instantWin.hasInstantWin) {
        expect(result.instantWin.playerIndex).toBeUndefined();
        expect(result.instantWin.type).toBeUndefined();
      }
    });

    it('should return correct instant win structure', () => {
      const deck = generateShuffledDeck();
      const result = dealCards(deck, 4);

      expect(result.instantWin).toHaveProperty('hasInstantWin');
      expect(typeof result.instantWin.hasInstantWin).toBe('boolean');

      if (result.instantWin.hasInstantWin) {
        expect(result.instantWin.playerIndex).toBeDefined();
        expect(typeof result.instantWin.playerIndex).toBe('number');
        expect(result.instantWin.playerIndex).toBeGreaterThanOrEqual(0);
        expect(result.instantWin.playerIndex).toBeLessThan(4);
        expect(result.instantWin.type).toBe('tu_quy_heo');
      }
    });
  });

  describe('hasTuQuyHeo', () => {
    it('should return true when hand contains all four cards of rank 2', () => {
      const deck = generateDeck();
      const heoCards = deck.filter((card) => card.rank === '2');

      expect(hasTuQuyHeo(heoCards)).toBe(true);
    });

    it('should return false when hand contains only 3 cards of rank 2', () => {
      const deck = generateDeck();
      const heoCards = deck.filter((card) => card.rank === '2');

      expect(hasTuQuyHeo(heoCards.slice(0, 3))).toBe(false);
    });

    it('should return false when hand contains only 2 cards of rank 2', () => {
      const deck = generateDeck();
      const heoCards = deck.filter((card) => card.rank === '2');

      expect(hasTuQuyHeo(heoCards.slice(0, 2))).toBe(false);
    });

    it('should return false when hand contains only 1 card of rank 2', () => {
      const deck = generateDeck();
      const heoCards = deck.filter((card) => card.rank === '2');

      expect(hasTuQuyHeo(heoCards.slice(0, 1))).toBe(false);
    });

    it('should return false when hand contains no cards of rank 2', () => {
      const deck = generateDeck();
      const nonHeoCards = deck.filter((card) => card.rank !== '2');

      expect(hasTuQuyHeo(nonHeoCards.slice(0, 13))).toBe(false);
    });

    it('should return false when hand contains all four 2s plus other cards', () => {
      const deck = generateDeck();
      const heoCards = deck.filter((card) => card.rank === '2');
      const otherCards = deck.filter((card) => card.rank !== '2');
      const hand = [...heoCards, ...otherCards.slice(0, 9)];

      // Should still return true because it has all four 2s
      expect(hasTuQuyHeo(hand)).toBe(true);
    });

    it('should return false for empty hand', () => {
      expect(hasTuQuyHeo([])).toBe(false);
    });

    it('should correctly identify Tứ Quý Heo in a 13-card hand', () => {
      const deck = generateDeck();
      const heoCards = deck.filter((card) => card.rank === '2');
      const otherCards = deck.filter((card) => card.rank !== '2');

      // Create a hand with all four 2s
      const handWithTuQuyHeo = [...heoCards, ...otherCards.slice(0, 9)];
      expect(hasTuQuyHeo(handWithTuQuyHeo)).toBe(true);

      // Create a hand without all four 2s
      const handWithoutTuQuyHeo = [...heoCards.slice(0, 3), ...otherCards.slice(0, 10)];
      expect(hasTuQuyHeo(handWithoutTuQuyHeo)).toBe(false);
    });
  });
});
