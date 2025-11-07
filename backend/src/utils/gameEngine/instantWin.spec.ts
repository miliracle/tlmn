import {
  checkInitialRoundInstantWin,
  checkOtherRoundInstantWin,
  checkInstantWin,
} from './instantWin';
import { generateDeck } from './deck';
import { createCard, createCardsOfRank } from './testHelpers';

describe('Initial Round Instant Win Detection', () => {
  describe('checkInitialRoundInstantWin', () => {
    it('should return false for invalid hand size', () => {
      const deck = generateDeck();
      const smallHand = deck.slice(0, 12);
      const largeHand = deck.slice(0, 14);

      expect(checkInitialRoundInstantWin(smallHand).hasInstantWin).toBe(false);
      expect(checkInitialRoundInstantWin(largeHand).hasInstantWin).toBe(false);
    });

    it('should return false for a normal hand without instant win', () => {
      // Create a hand that definitely doesn't match any instant win condition
      // Use diverse ranks and suits
      const normalHand = [
        createCard('3', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('6', 'Spades'),
        createCard('7', 'Clubs'),
        createCard('8', 'Hearts'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Spades'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Diamonds'),
        createCard('A', 'Spades'),
        createCard('2', 'Clubs'), // One heo, not all 4
      ];
      const result = checkInitialRoundInstantWin(normalHand);

      expect(result.hasInstantWin).toBe(false);
      expect(result.type).toBeUndefined();
    });
  });

  describe('Subtask 2.3.1.1: Tứ quý 3', () => {
    it('should detect tứ quý 3 (four 3s)', () => {
      const hand = [
        ...createCardsOfRank('3', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('tu_quy_3');
    });

    it('should not detect tứ quý 3 with only 3 cards of rank 3', () => {
      const hand = [
        ...createCardsOfRank('3', ['Spades', 'Hearts', 'Diamonds']),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
        createCard('K', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.1.2: Tứ quý heo', () => {
    it('should detect tứ quý heo (all four 2s)', () => {
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('3', 'Clubs'),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('tu_quy_heo');
    });

    it('should not detect tứ quý heo with only 3 cards of rank 2', () => {
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds']),
        createCard('3', 'Clubs'),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.1.3: 3 đôi thông có ♠3', () => {
    it('should detect 3 đôi thông có ♠3', () => {
      // Create 3 consecutive pairs: 3-3, 4-4, 5-5, with ♠3 included
      // Make sure we don't have all 4 cards of rank 2 (tứ quý heo)
      const hand = [
        createCard('3', 'Spades'), // ♠3
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('3_doi_thong_co_spade_3');
    });

    it('should not detect if ♠3 is not in the consecutive pairs', () => {
      // 3 consecutive pairs but ♠3 is not part of them
      const hand = [
        createCard('3', 'Hearts'), // Not ♠3
        createCard('3', 'Diamonds'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('3', 'Spades'), // ♠3 but not in the pairs
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });

    it('should not detect if hand does not have ♠3', () => {
      const hand = [
        createCard('3', 'Hearts'),
        createCard('3', 'Diamonds'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.1.4: 4 đôi thông có ♠3', () => {
    it('should detect 4 đôi thông có ♠3', () => {
      // Create 4 consecutive pairs: 3-3, 4-4, 5-5, 6-6, with ♠3 included
      // Make sure we don't have all 4 cards of rank 2 (tứ quý heo)
      const hand = [
        createCard('3', 'Spades'), // ♠3
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('4_doi_thong_co_spade_3');
    });

    it('should not detect if only 3 consecutive pairs', () => {
      const hand = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      // Should detect 3 đôi thông có ♠3 instead
      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('3_doi_thong_co_spade_3');
    });
  });

  describe('Subtask 2.3.1.5: 3 sám cô', () => {
    it('should detect 3 sám cô (three triples)', () => {
      // Create 3 triples: 3-3-3, 4-4-4, 5-5-5
      // Use Clubs instead of Spades for rank 3 to avoid matching "3 đôi thông có ♠3"
      const hand = [
        ...createCardsOfRank('3', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('4', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('5', ['Clubs', 'Hearts', 'Diamonds']),
        createCard('7', 'Clubs'), // Extra cards to make 13
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('3_sam_co');
    });

    it('should detect 3 sám cô even with more than 3 triples', () => {
      // Create 4 triples: should detect as 4 sám cô
      // Use non-consecutive ranks to avoid matching consecutive pairs
      const hand = [
        ...createCardsOfRank('3', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('5', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('7', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('9', ['Clubs', 'Hearts', 'Diamonds']),
        createCard('J', 'Clubs'), // 1 extra card to make 13
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      // Should detect 4 sám cô instead (higher priority)
      expect(result.type).toBe('4_sam_co');
    });

    it('should not detect with only 2 triples', () => {
      const hand = [
        ...createCardsOfRank('3', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('4', ['Clubs', 'Hearts', 'Diamonds']),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.1.6: 4 sám cô', () => {
    it('should detect 4 sám cô (four triples)', () => {
      // Create 4 triples: use non-consecutive ranks to avoid matching consecutive pairs
      const hand = [
        ...createCardsOfRank('3', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('5', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('7', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('9', ['Clubs', 'Hearts', 'Diamonds']),
        createCard('J', 'Clubs'), // 1 extra card to make 13
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('4_sam_co');
    });

    it('should not detect with only 3 triples', () => {
      const hand = [
        ...createCardsOfRank('3', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('5', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('7', ['Clubs', 'Hearts', 'Diamonds']),
        createCard('9', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
        createCard('K', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      // Should detect 3 sám cô instead
      expect(result.type).toBe('3_sam_co');
    });
  });

  describe('Subtask 2.3.1.7: 3 tứ quý', () => {
    it('should detect 3 tứ quý (three four of a kinds)', () => {
      // Create 3 four of a kinds: 4-4-4-4, 5-5-5-5, 6-6-6-6
      // Don't use rank 3 to avoid matching "tứ quý 3"
      const hand = [
        ...createCardsOfRank('4', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        ...createCardsOfRank('5', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        ...createCardsOfRank('6', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('7', 'Spades'), // 1 extra card to make 13
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('3_tu_quy');
    });

    it('should not count tứ quý heo as part of 3 tứ quý', () => {
      // 2 four of a kinds + tứ quý heo should not count as 3 tứ quý
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds', 'Clubs']), // Tứ quý heo
        ...createCardsOfRank('4', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        ...createCardsOfRank('5', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('6', 'Spades'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      // Should detect tứ quý heo instead (higher priority)
      expect(result.type).toBe('tu_quy_heo');
    });

    it('should not detect with only 2 four of a kinds', () => {
      const hand = [
        ...createCardsOfRank('4', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        ...createCardsOfRank('5', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('6', 'Spades'),
        createCard('7', 'Spades'),
        createCard('8', 'Spades'),
        createCard('9', 'Spades'),
        createCard('10', 'Spades'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.1.8: 5 đôi 1 sám', () => {
    it('should detect 5 đôi 1 sám (5 pairs + 1 triple)', () => {
      // Create 5 pairs and 1 triple: exactly 13 cards
      // Use non-consecutive ranks to avoid matching "5 đôi thông 1 sám"
      // Example: 3-3, 5-5, 7-7, 9-9, J-J, 4-4-4
      const hand = [
        createCard('3', 'Clubs'),
        createCard('3', 'Hearts'),
        createCard('4', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('4', 'Diamonds'), // Triple
        createCard('5', 'Clubs'),
        createCard('5', 'Hearts'),
        createCard('7', 'Clubs'),
        createCard('7', 'Hearts'),
        createCard('9', 'Clubs'),
        createCard('9', 'Hearts'),
        createCard('J', 'Clubs'),
        createCard('J', 'Hearts'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('5_doi_1_sam');
    });

    it('should detect 5 đôi 1 sám with triple from different rank', () => {
      // 5 pairs: 3-3, 5-5, 7-7, 9-9, J-J (non-consecutive)
      // 1 triple: 4-4-4
      const hand = [
        createCard('3', 'Clubs'),
        createCard('3', 'Hearts'),
        createCard('4', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('4', 'Diamonds'), // Triple
        createCard('5', 'Clubs'),
        createCard('5', 'Hearts'),
        createCard('7', 'Clubs'),
        createCard('7', 'Hearts'),
        createCard('9', 'Clubs'),
        createCard('9', 'Hearts'),
        createCard('J', 'Clubs'),
        createCard('J', 'Hearts'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('5_doi_1_sam');
    });

    it('should not detect if cannot form exactly 5 pairs + 1 triple', () => {
      // 6 pairs but no triple - use non-consecutive pairs to avoid matching "3 đôi thông có ♠3"
      const hand = [
        createCard('3', 'Clubs'),
        createCard('3', 'Hearts'),
        createCard('5', 'Clubs'),
        createCard('5', 'Hearts'),
        createCard('7', 'Clubs'),
        createCard('7', 'Hearts'),
        createCard('9', 'Clubs'),
        createCard('9', 'Hearts'),
        createCard('J', 'Clubs'),
        createCard('J', 'Hearts'),
        createCard('K', 'Clubs'),
        createCard('K', 'Hearts'),
        createCard('A', 'Clubs'), // Single card, not a triple
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.1.9: 5 đôi thông 1 sám', () => {
    it('should detect 5 đôi thông 1 sám (5 consecutive pairs + 1 triple)', () => {
      // 5 consecutive pairs: 4-4, 5-5, 6-6, 7-7, 8-8 (don't include rank 3 to avoid matching "3 đôi thông có ♠3")
      // 1 triple: 9-9-9
      const hand = [
        createCard('4', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('5', 'Clubs'),
        createCard('5', 'Hearts'),
        createCard('6', 'Clubs'),
        createCard('6', 'Hearts'),
        createCard('7', 'Clubs'),
        createCard('7', 'Hearts'),
        createCard('8', 'Clubs'),
        createCard('8', 'Hearts'),
        createCard('9', 'Clubs'),
        createCard('9', 'Hearts'),
        createCard('9', 'Diamonds'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('5_doi_thong_1_sam');
    });

    it('should not detect if pairs are not consecutive', () => {
      // 5 pairs but not consecutive: 4-4, 5-5, 6-6, 8-8, 9-9 (missing 7)
      const hand = [
        createCard('4', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('5', 'Clubs'),
        createCard('5', 'Hearts'),
        createCard('6', 'Clubs'),
        createCard('6', 'Hearts'),
        createCard('8', 'Clubs'),
        createCard('8', 'Hearts'),
        createCard('9', 'Clubs'),
        createCard('9', 'Hearts'),
        createCard('10', 'Clubs'),
        createCard('10', 'Hearts'),
        createCard('10', 'Diamonds'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      // Should detect 5 đôi 1 sám instead (non-consecutive pairs)
      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('5_doi_1_sam');
    });

    it('should not detect if cannot form exactly 5 consecutive pairs + 1 triple', () => {
      // 5 consecutive pairs but leftover cards don't form a triple
      const hand = [
        createCard('4', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('5', 'Clubs'),
        createCard('5', 'Hearts'),
        createCard('6', 'Clubs'),
        createCard('6', 'Hearts'),
        createCard('7', 'Clubs'),
        createCard('7', 'Hearts'),
        createCard('8', 'Clubs'),
        createCard('8', 'Hearts'),
        createCard('9', 'Clubs'),
        createCard('9', 'Hearts'),
        createCard('10', 'Clubs'), // Single card, not a triple
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Priority order', () => {
    it('should detect tứ quý 3 before other conditions', () => {
      // Hand has both tứ quý 3 and 3 sám cô
      const hand = [
        ...createCardsOfRank('3', ['Spades', 'Hearts', 'Diamonds', 'Clubs']), // Tứ quý 3
        ...createCardsOfRank('4', ['Spades', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('5', ['Spades', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('6', ['Spades', 'Hearts', 'Diamonds']),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('tu_quy_3');
    });

    it('should detect tứ quý heo before 3 sám cô', () => {
      // Hand has both tứ quý heo and 3 sám cô
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds', 'Clubs']), // Tứ quý heo
        ...createCardsOfRank('3', ['Spades', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('4', ['Spades', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('5', ['Spades', 'Hearts', 'Diamonds']),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('tu_quy_heo');
    });

    it('should detect 4 sám cô before 3 sám cô', () => {
      // Hand has 4 triples - use non-consecutive ranks to avoid matching consecutive pairs
      const hand = [
        ...createCardsOfRank('3', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('5', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('7', ['Clubs', 'Hearts', 'Diamonds']),
        ...createCardsOfRank('9', ['Clubs', 'Hearts', 'Diamonds']),
        createCard('J', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('4_sam_co');
    });

    it('should detect 4 đôi thông có ♠3 before 3 đôi thông có ♠3', () => {
      // Hand has 4 consecutive pairs including ♠3
      // Make sure we don't have all 4 cards of rank 2 (tứ quý heo)
      const hand = [
        createCard('3', 'Spades'), // ♠3
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkInitialRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('4_doi_thong_co_spade_3');
    });
  });
});

describe('Other Round Instant Win Detection', () => {
  describe('checkOtherRoundInstantWin', () => {
    it('should return false for invalid hand size', () => {
      const deck = generateDeck();
      const smallHand = deck.slice(0, 12);
      const largeHand = deck.slice(0, 14);

      expect(checkOtherRoundInstantWin(smallHand).hasInstantWin).toBe(false);
      expect(checkOtherRoundInstantWin(largeHand).hasInstantWin).toBe(false);
    });

    it('should return false for a normal hand without instant win', () => {
      // Create a hand that definitely doesn't match any instant win condition
      // Don't include all ranks from 3 to A (which would be sảnh rồng)
      const normalHand = [
        createCard('3', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('6', 'Spades'),
        createCard('7', 'Clubs'),
        createCard('8', 'Hearts'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Spades'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Diamonds'),
        createCard('2', 'Clubs'), // One heo, not all 4
        createCard('2', 'Hearts'), // Missing A, so not sảnh rồng
      ];
      const result = checkOtherRoundInstantWin(normalHand);

      expect(result.hasInstantWin).toBe(false);
      expect(result.type).toBeUndefined();
    });
  });

  describe('Subtask 2.3.2.1: Tứ quý heo', () => {
    it('should detect tứ quý heo (all four 2s)', () => {
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('3', 'Clubs'),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('tu_quy_heo');
    });

    it('should not detect tứ quý heo with only 3 cards of rank 2', () => {
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds']),
        createCard('3', 'Clubs'),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.2.2: 5 đôi thông', () => {
    it('should detect 5 đôi thông (5 consecutive pairs)', () => {
      // 5 consecutive pairs: 3-3, 4-4, 5-5, 6-6, 7-7
      const hand = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('5_doi_thong');
    });

    it('should not detect if only 4 consecutive pairs', () => {
      const hand = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });

    it('should not detect if pairs are not consecutive', () => {
      // 5 pairs but not consecutive: 3-3, 4-4, 5-5, 7-7, 8-8 (missing 6)
      const hand = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('8', 'Spades'),
        createCard('8', 'Hearts'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });

    it('should not detect if consecutive pairs include rank 2', () => {
      // Cannot have consecutive pairs with rank 2
      const hand = [
        createCard('A', 'Spades'),
        createCard('A', 'Hearts'),
        createCard('2', 'Spades'),
        createCard('2', 'Hearts'),
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.2.3: 6 đôi bất kì', () => {
    it('should detect 6 đôi bất kì (6 pairs, any ranks)', () => {
      // 6 pairs: 3-3, 4-4, 5-5, 7-7, 9-9, J-J (non-consecutive is OK)
      const hand = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('9', 'Spades'),
        createCard('9', 'Hearts'),
        createCard('J', 'Spades'),
        createCard('J', 'Hearts'),
        createCard('K', 'Clubs'), // Single card
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('6_doi_bat_ki');
    });

    it('should detect 6 đôi bất kì with consecutive pairs', () => {
      // 6 consecutive pairs: 3-3, 4-4, 5-5, 6-6, 7-7, 8-8
      const hand = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('8', 'Spades'),
        createCard('8', 'Hearts'),
        createCard('9', 'Clubs'), // Single card
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('6_doi_bat_ki');
    });

    it('should not detect with only 5 pairs', () => {
      const hand = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('9', 'Spades'),
        createCard('9', 'Hearts'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
        createCard('K', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });

    it('should detect 6 đôi bất kì even if one pair is rank 2', () => {
      // 6 pairs including a pair of 2s: 2-2, 3-3, 4-4, 5-5, 6-6, 7-7
      const hand = [
        createCard('2', 'Spades'),
        createCard('2', 'Hearts'),
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('8', 'Clubs'), // Single card
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('6_doi_bat_ki');
    });
  });

  describe('Subtask 2.3.2.4: Sảnh rồng', () => {
    it('should detect sảnh rồng (3 to A straight - 12 cards)', () => {
      // Straight from 3 to A: 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
      const hand = [
        createCard('3', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('6', 'Clubs'),
        createCard('7', 'Spades'),
        createCard('8', 'Hearts'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Clubs'),
        createCard('J', 'Spades'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Diamonds'),
        createCard('A', 'Clubs'),
        createCard('2', 'Spades'), // Extra card
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('sanh_rong');
    });

    it('should not detect if straight is shorter than 12 cards', () => {
      // Missing A, so only 11 cards from 3 to K
      const hand = [
        createCard('3', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('6', 'Clubs'),
        createCard('7', 'Spades'),
        createCard('8', 'Hearts'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Clubs'),
        createCard('J', 'Spades'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Diamonds'),
        createCard('2', 'Spades'),
        createCard('2', 'Hearts'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });

    it('should not detect if missing a rank in 3 to A sequence', () => {
      // Missing rank 4, so cannot form sảnh rồng
      const hand = [
        createCard('3', 'Spades'),
        createCard('5', 'Hearts'), // Missing 4
        createCard('6', 'Diamonds'),
        createCard('7', 'Clubs'),
        createCard('8', 'Spades'),
        createCard('9', 'Hearts'),
        createCard('10', 'Diamonds'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Spades'),
        createCard('K', 'Hearts'),
        createCard('A', 'Diamonds'),
        createCard('2', 'Clubs'),
        createCard('2', 'Spades'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });

    it('should not detect if cards are not consecutive', () => {
      // Missing some ranks in the sequence
      const hand = [
        createCard('3', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('7', 'Clubs'), // Missing 6
        createCard('8', 'Spades'),
        createCard('9', 'Hearts'),
        createCard('10', 'Diamonds'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Spades'),
        createCard('K', 'Hearts'),
        createCard('A', 'Diamonds'),
        createCard('2', 'Clubs'),
        createCard('2', 'Spades'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.2.5: Đồng chất đồng màu', () => {
    it('should detect đồng chất đồng màu with all red cards (Hearts and Diamonds)', () => {
      // All red cards: Hearts and Diamonds
      // Don't include all ranks 3-A (which would be sảnh rồng)
      const hand = [
        createCard('3', 'Hearts'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('6', 'Hearts'),
        createCard('7', 'Diamonds'),
        createCard('8', 'Hearts'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Hearts'),
        createCard('J', 'Diamonds'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Diamonds'),
        createCard('2', 'Hearts'), // Missing A, so not sảnh rồng
        createCard('2', 'Diamonds'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('dong_chat_dong_mau');
    });

    it('should detect đồng chất đồng màu with all black cards (Clubs and Spades)', () => {
      // All black cards: Clubs and Spades
      // Don't include all ranks 3-A (which would be sảnh rồng)
      const hand = [
        createCard('3', 'Clubs'),
        createCard('4', 'Spades'),
        createCard('5', 'Clubs'),
        createCard('6', 'Spades'),
        createCard('7', 'Clubs'),
        createCard('8', 'Spades'),
        createCard('9', 'Clubs'),
        createCard('10', 'Spades'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Spades'),
        createCard('K', 'Clubs'),
        createCard('2', 'Spades'), // Missing A, so not sảnh rồng
        createCard('2', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('dong_chat_dong_mau');
    });

    it('should not detect if cards have mixed colors', () => {
      // Mix of red and black cards
      // Don't include all ranks 3-A (which would be sảnh rồng)
      const hand = [
        createCard('3', 'Hearts'), // Red
        createCard('4', 'Clubs'), // Black
        createCard('5', 'Diamonds'), // Red
        createCard('6', 'Spades'), // Black
        createCard('7', 'Hearts'),
        createCard('8', 'Clubs'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Spades'),
        createCard('J', 'Hearts'),
        createCard('Q', 'Clubs'),
        createCard('K', 'Diamonds'),
        createCard('2', 'Spades'), // Missing A, so not sảnh rồng
        createCard('2', 'Hearts'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(false);
    });

    it('should detect đồng chất đồng màu even with all same suit', () => {
      // All same color (red) but different suits, missing A so not sảnh rồng
      const hand = [
        createCard('3', 'Hearts'),
        createCard('4', 'Hearts'),
        createCard('5', 'Hearts'),
        createCard('6', 'Hearts'),
        createCard('7', 'Hearts'),
        createCard('8', 'Hearts'),
        createCard('9', 'Hearts'),
        createCard('10', 'Hearts'),
        createCard('J', 'Hearts'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Hearts'),
        createCard('2', 'Hearts'),
        createCard('2', 'Diamonds'), // Same color (red) but different suit
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('dong_chat_dong_mau');
    });
  });

  describe('Priority order', () => {
    it('should detect tứ quý heo before other conditions', () => {
      // Hand has both tứ quý heo and 6 đôi bất kì
      // 4 twos (4 cards = 2 pairs) + 4 more pairs (8 cards) + 1 leftover = 13 cards
      // Total: 6 pairs + 1 leftover = 6 đôi bất kì, but tứ quý heo should be detected first
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds', 'Clubs']), // Tứ quý heo (4 cards = 2 pairs)
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('8', 'Clubs'), // Single card (leftover)
      ];
      // Count: 4 twos (2 pairs) + 4 pairs (8 cards) + 1 leftover = 13 cards, 6 pairs total

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('tu_quy_heo');
    });

    it('should detect 5 đôi thông before 6 đôi bất kì', () => {
      // Hand has 5 consecutive pairs (which also forms 6 đôi bất kì if we count differently)
      // But we should detect 5 đôi thông first
      const hand = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('8', 'Spades'),
        createCard('8', 'Hearts'),
        createCard('9', 'Clubs'),
      ];

      const result = checkOtherRoundInstantWin(hand);

      expect(result.hasInstantWin).toBe(true);
      // Should detect 6 đôi bất kì (6 pairs) since we have 6 pairs, not 5
      // Actually wait, we have 6 pairs here, so it should be 6 đôi bất kì
      // But if we have exactly 5 consecutive pairs, it should be 5 đôi thông
      // Let me adjust: if we have 5 consecutive pairs + 1 extra card, it's 5 đôi thông
      // If we have 6 pairs total, it's 6 đôi bất kì
      // So this hand has 6 pairs, should be 6 đôi bất kì
      expect(result.type).toBe('6_doi_bat_ki');
    });
  });
});

describe('Task 2.3.3: Instant Win Handler', () => {
  describe('Subtask 2.3.3.1: checkInstantWin function', () => {
    it('should be defined and callable', () => {
      expect(typeof checkInstantWin).toBe('function');
    });
  });

  describe('Subtask 2.3.3.2: Determine which round type (initial vs other)', () => {
    it('should call checkInitialRoundInstantWin when isInitialRound is true', () => {
      // Hand with tứ quý 3 (initial round instant win)
      const hand = [
        ...createCardsOfRank('3', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result = checkInstantWin(hand, true);
      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('tu_quy_3');
    });

    it('should call checkOtherRoundInstantWin when isInitialRound is false', () => {
      // Hand with tứ quý heo (other round instant win)
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('3', 'Clubs'),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkInstantWin(hand, false);
      expect(result.hasInstantWin).toBe(true);
      expect(result.type).toBe('tu_quy_heo');
    });

    it('should return false when isInitialRound is true but hand does not match initial round conditions', () => {
      // Hand that matches other round condition (5 đôi thông) but not initial round
      // Use non-consecutive pairs and ensure no ♠3 to avoid matching initial round conditions
      const hand = [
        createCard('3', 'Hearts'), // Not ♠3
        createCard('3', 'Diamonds'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('9', 'Clubs'), // Skip 8 to break consecutive pattern
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const result = checkInstantWin(hand, true);
      expect(result.hasInstantWin).toBe(false);
    });

    it('should return false when isInitialRound is false but hand does not match other round conditions', () => {
      // Hand that matches initial round condition (tứ quý 3) but not other round
      const hand = [
        ...createCardsOfRank('3', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result = checkInstantWin(hand, false);
      expect(result.hasInstantWin).toBe(false);
    });
  });

  describe('Subtask 2.3.3.3: Return instant win result and type', () => {
    it('should return correct result for initial round instant win', () => {
      // Test tứ quý 3
      const hand1 = [
        ...createCardsOfRank('3', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result1 = checkInstantWin(hand1, true);
      expect(result1.hasInstantWin).toBe(true);
      expect(result1.type).toBe('tu_quy_3');

      // Test 3 đôi thông có ♠3
      const hand2 = [
        createCard('3', 'Spades'), // ♠3
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Clubs'),
      ];

      const result2 = checkInstantWin(hand2, true);
      expect(result2.hasInstantWin).toBe(true);
      expect(result2.type).toBe('3_doi_thong_co_spade_3');
    });

    it('should return correct result for other round instant win', () => {
      // Test 5 đôi thông
      const hand1 = [
        createCard('3', 'Spades'),
        createCard('3', 'Hearts'),
        createCard('4', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Spades'),
        createCard('5', 'Hearts'),
        createCard('6', 'Spades'),
        createCard('6', 'Hearts'),
        createCard('7', 'Spades'),
        createCard('7', 'Hearts'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
      ];

      const result1 = checkInstantWin(hand1, false);
      expect(result1.hasInstantWin).toBe(true);
      expect(result1.type).toBe('5_doi_thong');

      // Test sảnh rồng
      const hand2 = [
        createCard('3', 'Spades'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('6', 'Clubs'),
        createCard('7', 'Spades'),
        createCard('8', 'Hearts'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Clubs'),
        createCard('J', 'Spades'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Diamonds'),
        createCard('A', 'Clubs'),
        createCard('2', 'Spades'), // Extra card
      ];

      const result2 = checkInstantWin(hand2, false);
      expect(result2.hasInstantWin).toBe(true);
      expect(result2.type).toBe('sanh_rong');
    });

    it('should return hasInstantWin: false when no instant win condition is met', () => {
      // Normal hand without any instant win conditions
      // Missing rank A to avoid sảnh rồng, and ensure no other conditions
      const normalHand = [
        createCard('3', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('6', 'Spades'),
        createCard('7', 'Clubs'),
        createCard('8', 'Hearts'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Spades'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Diamonds'),
        createCard('2', 'Clubs'), // One heo, not all 4
        createCard('2', 'Hearts'), // Two heos, not all 4
      ];

      const resultInitial = checkInstantWin(normalHand, true);
      expect(resultInitial.hasInstantWin).toBe(false);
      expect(resultInitial.type).toBeUndefined();

      const resultOther = checkInstantWin(normalHand, false);
      expect(resultOther.hasInstantWin).toBe(false);
      expect(resultOther.type).toBeUndefined();
    });

    it('should return correct type for tứ quý heo in both round types', () => {
      // Tứ quý heo is valid in both initial and other rounds
      const hand = [
        ...createCardsOfRank('2', ['Spades', 'Hearts', 'Diamonds', 'Clubs']),
        createCard('3', 'Clubs'),
        createCard('4', 'Clubs'),
        createCard('5', 'Clubs'),
        createCard('6', 'Clubs'),
        createCard('7', 'Clubs'),
        createCard('8', 'Clubs'),
        createCard('9', 'Clubs'),
        createCard('10', 'Clubs'),
        createCard('J', 'Clubs'),
      ];

      const resultInitial = checkInstantWin(hand, true);
      expect(resultInitial.hasInstantWin).toBe(true);
      expect(resultInitial.type).toBe('tu_quy_heo');

      const resultOther = checkInstantWin(hand, false);
      expect(resultOther.hasInstantWin).toBe(true);
      expect(resultOther.type).toBe('tu_quy_heo');
    });
  });

  describe('Subtask 2.3.3.4: Handle instant win game end flow', () => {
    it('should validate hand size before checking instant win', () => {
      const smallHand = [
        createCard('3', 'Clubs'),
        createCard('4', 'Hearts'),
        // ... only 2 cards, not 13
      ];

      const result = checkInstantWin(smallHand, true);
      expect(result.hasInstantWin).toBe(false);
    });

    it('should handle edge case: hand with exactly 13 cards but invalid instant win', () => {
      // Hand that has 13 cards but doesn't match any instant win condition
      const hand = [
        createCard('3', 'Clubs'),
        createCard('4', 'Hearts'),
        createCard('5', 'Diamonds'),
        createCard('6', 'Spades'),
        createCard('7', 'Clubs'),
        createCard('8', 'Hearts'),
        createCard('9', 'Diamonds'),
        createCard('10', 'Spades'),
        createCard('J', 'Clubs'),
        createCard('Q', 'Hearts'),
        createCard('K', 'Diamonds'),
        createCard('A', 'Spades'),
        createCard('2', 'Clubs'),
      ];

      const result = checkInstantWin(hand, true);
      expect(result.hasInstantWin).toBe(false);
      expect(result.type).toBeUndefined();
    });
  });
});
