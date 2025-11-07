import {
  findPlayerWithSpade3,
  findCombinationsWithSpade3,
  isInitialRound,
  canFormCombinationWithSpade3,
} from './firstRound';
import { createCard } from './testHelpers';
import {
  RANK_3,
  RANK_4,
  RANK_5,
  RANK_6,
  RANK_7,
  RANK_8,
  RANK_9,
  RANK_10,
  RANK_J,
  RANK_Q,
  RANK_K,
  RANK_A,
  RANK_2,
  SUIT_SPADES,
  SUIT_HEARTS,
  SUIT_DIAMONDS,
  SUIT_CLUBS,
} from '../../types/game';
import { ValidationException } from '../../common/exceptions';

describe('First Round Special Rules', () => {
  describe('findPlayerWithSpade3', () => {
    it('should find player with ♠3 in 2-player game', () => {
      const playerHands = [
        [
          createCard(RANK_3, SUIT_SPADES), // Player 0 has ♠3
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_CLUBS),
          createCard(RANK_7, SUIT_SPADES),
          createCard(RANK_8, SUIT_HEARTS),
          createCard(RANK_9, SUIT_DIAMONDS),
          createCard(RANK_10, SUIT_CLUBS),
          createCard(RANK_J, SUIT_SPADES),
          createCard(RANK_Q, SUIT_HEARTS),
          createCard(RANK_K, SUIT_DIAMONDS),
          createCard(RANK_A, SUIT_CLUBS),
          createCard(RANK_2, SUIT_SPADES),
        ],
        [
          createCard(RANK_3, SUIT_HEARTS),
          createCard(RANK_3, SUIT_DIAMONDS),
          createCard(RANK_3, SUIT_CLUBS),
          createCard(RANK_4, SUIT_SPADES),
          createCard(RANK_4, SUIT_CLUBS),
          createCard(RANK_5, SUIT_HEARTS),
          createCard(RANK_5, SUIT_SPADES),
          createCard(RANK_6, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_HEARTS),
          createCard(RANK_7, SUIT_CLUBS),
          createCard(RANK_7, SUIT_DIAMONDS),
          createCard(RANK_8, SUIT_SPADES),
          createCard(RANK_8, SUIT_CLUBS),
        ],
      ];

      const result = findPlayerWithSpade3(playerHands);

      expect(result.found).toBe(true);
      expect(result.playerIndex).toBe(0);
    });

    it('should find player with ♠3 in 3-player game', () => {
      const playerHands = [
        [
          createCard(RANK_3, SUIT_HEARTS),
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_CLUBS),
          createCard(RANK_7, SUIT_SPADES),
          createCard(RANK_8, SUIT_HEARTS),
          createCard(RANK_9, SUIT_DIAMONDS),
          createCard(RANK_10, SUIT_CLUBS),
          createCard(RANK_J, SUIT_SPADES),
          createCard(RANK_Q, SUIT_HEARTS),
          createCard(RANK_K, SUIT_DIAMONDS),
          createCard(RANK_A, SUIT_CLUBS),
          createCard(RANK_2, SUIT_SPADES),
        ],
        [
          createCard(RANK_3, SUIT_SPADES), // Player 1 has ♠3
          createCard(RANK_3, SUIT_DIAMONDS),
          createCard(RANK_3, SUIT_CLUBS),
          createCard(RANK_4, SUIT_SPADES),
          createCard(RANK_4, SUIT_CLUBS),
          createCard(RANK_5, SUIT_HEARTS),
          createCard(RANK_5, SUIT_SPADES),
          createCard(RANK_6, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_HEARTS),
          createCard(RANK_7, SUIT_CLUBS),
          createCard(RANK_7, SUIT_DIAMONDS),
          createCard(RANK_8, SUIT_SPADES),
          createCard(RANK_8, SUIT_CLUBS),
        ],
        [
          createCard(RANK_9, SUIT_SPADES),
          createCard(RANK_9, SUIT_HEARTS),
          createCard(RANK_9, SUIT_CLUBS),
          createCard(RANK_10, SUIT_SPADES),
          createCard(RANK_10, SUIT_HEARTS),
          createCard(RANK_10, SUIT_DIAMONDS),
          createCard(RANK_J, SUIT_HEARTS),
          createCard(RANK_J, SUIT_DIAMONDS),
          createCard(RANK_J, SUIT_CLUBS),
          createCard(RANK_Q, SUIT_SPADES),
          createCard(RANK_Q, SUIT_DIAMONDS),
          createCard(RANK_Q, SUIT_CLUBS),
          createCard(RANK_K, SUIT_SPADES),
        ],
      ];

      const result = findPlayerWithSpade3(playerHands);

      expect(result.found).toBe(true);
      expect(result.playerIndex).toBe(1);
    });

    it('should find player with ♠3 in 4-player game', () => {
      const playerHands = [
        [
          createCard(RANK_3, SUIT_HEARTS),
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_CLUBS),
          createCard(RANK_7, SUIT_SPADES),
          createCard(RANK_8, SUIT_HEARTS),
          createCard(RANK_9, SUIT_DIAMONDS),
          createCard(RANK_10, SUIT_CLUBS),
          createCard(RANK_J, SUIT_SPADES),
          createCard(RANK_Q, SUIT_HEARTS),
          createCard(RANK_K, SUIT_DIAMONDS),
          createCard(RANK_A, SUIT_CLUBS),
          createCard(RANK_2, SUIT_SPADES),
        ],
        [
          createCard(RANK_3, SUIT_DIAMONDS),
          createCard(RANK_3, SUIT_CLUBS),
          createCard(RANK_4, SUIT_SPADES),
          createCard(RANK_4, SUIT_CLUBS),
          createCard(RANK_5, SUIT_HEARTS),
          createCard(RANK_5, SUIT_SPADES),
          createCard(RANK_6, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_HEARTS),
          createCard(RANK_7, SUIT_CLUBS),
          createCard(RANK_7, SUIT_DIAMONDS),
          createCard(RANK_8, SUIT_SPADES),
          createCard(RANK_8, SUIT_CLUBS),
          createCard(RANK_9, SUIT_SPADES),
        ],
        [
          createCard(RANK_3, SUIT_SPADES), // Player 2 has ♠3
          createCard(RANK_9, SUIT_HEARTS),
          createCard(RANK_9, SUIT_CLUBS),
          createCard(RANK_10, SUIT_SPADES),
          createCard(RANK_10, SUIT_HEARTS),
          createCard(RANK_10, SUIT_DIAMONDS),
          createCard(RANK_J, SUIT_HEARTS),
          createCard(RANK_J, SUIT_DIAMONDS),
          createCard(RANK_J, SUIT_CLUBS),
          createCard(RANK_Q, SUIT_SPADES),
          createCard(RANK_Q, SUIT_DIAMONDS),
          createCard(RANK_Q, SUIT_CLUBS),
          createCard(RANK_K, SUIT_SPADES),
        ],
        [
          createCard(RANK_K, SUIT_HEARTS),
          createCard(RANK_K, SUIT_DIAMONDS),
          createCard(RANK_K, SUIT_CLUBS),
          createCard(RANK_A, SUIT_SPADES),
          createCard(RANK_A, SUIT_HEARTS),
          createCard(RANK_A, SUIT_DIAMONDS),
          createCard(RANK_2, SUIT_HEARTS),
          createCard(RANK_2, SUIT_DIAMONDS),
          createCard(RANK_2, SUIT_CLUBS),
          createCard(RANK_4, SUIT_DIAMONDS),
          createCard(RANK_5, SUIT_CLUBS),
          createCard(RANK_6, SUIT_SPADES),
          createCard(RANK_7, SUIT_HEARTS),
        ],
      ];

      const result = findPlayerWithSpade3(playerHands);

      expect(result.found).toBe(true);
      expect(result.playerIndex).toBe(2);
    });

    it('should return not found when no player has ♠3', () => {
      const playerHands = [
        [
          createCard(RANK_3, SUIT_HEARTS),
          createCard(RANK_4, SUIT_HEARTS),
          createCard(RANK_5, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_CLUBS),
          createCard(RANK_7, SUIT_SPADES),
          createCard(RANK_8, SUIT_HEARTS),
          createCard(RANK_9, SUIT_DIAMONDS),
          createCard(RANK_10, SUIT_CLUBS),
          createCard(RANK_J, SUIT_SPADES),
          createCard(RANK_Q, SUIT_HEARTS),
          createCard(RANK_K, SUIT_DIAMONDS),
          createCard(RANK_A, SUIT_CLUBS),
          createCard(RANK_2, SUIT_SPADES),
        ],
        [
          createCard(RANK_3, SUIT_DIAMONDS),
          createCard(RANK_3, SUIT_CLUBS),
          createCard(RANK_4, SUIT_SPADES),
          createCard(RANK_4, SUIT_CLUBS),
          createCard(RANK_5, SUIT_HEARTS),
          createCard(RANK_5, SUIT_SPADES),
          createCard(RANK_6, SUIT_DIAMONDS),
          createCard(RANK_6, SUIT_HEARTS),
          createCard(RANK_7, SUIT_CLUBS),
          createCard(RANK_7, SUIT_DIAMONDS),
          createCard(RANK_8, SUIT_SPADES),
          createCard(RANK_8, SUIT_CLUBS),
          createCard(RANK_9, SUIT_SPADES),
        ],
      ];

      const result = findPlayerWithSpade3(playerHands);

      expect(result.found).toBe(false);
      expect(result.playerIndex).toBe(-1);
    });

    it('should throw ValidationException when playerHands is empty', () => {
      expect(() => findPlayerWithSpade3([])).toThrow(ValidationException);
    });

    it('should throw ValidationException when playerHands is null', () => {
      expect(() => findPlayerWithSpade3(null as any)).toThrow(ValidationException);
    });

    it('should throw ValidationException when a player hand is not an array', () => {
      const playerHands = [
        [createCard(RANK_3, SUIT_HEARTS)], // First hand doesn't have ♠3, so it will check second hand
        null as any,
      ];

      expect(() => findPlayerWithSpade3(playerHands)).toThrow(ValidationException);
    });
  });

  describe('findCombinationsWithSpade3', () => {
    it('should find single combination when player only has ♠3 as single', () => {
      const playerHand = [
        createCard(RANK_3, SUIT_SPADES), // ♠3
        createCard(RANK_4, SUIT_HEARTS),
        createCard(RANK_5, SUIT_DIAMONDS),
        createCard(RANK_6, SUIT_CLUBS),
        createCard(RANK_7, SUIT_SPADES),
        createCard(RANK_8, SUIT_HEARTS),
        createCard(RANK_9, SUIT_DIAMONDS),
        createCard(RANK_10, SUIT_CLUBS),
        createCard(RANK_J, SUIT_SPADES),
        createCard(RANK_Q, SUIT_HEARTS),
        createCard(RANK_K, SUIT_DIAMONDS),
        createCard(RANK_A, SUIT_CLUBS),
        createCard(RANK_2, SUIT_SPADES),
      ];

      const combinations = findCombinationsWithSpade3(playerHand);

      // Should find at least the single card combination
      expect(combinations.length).toBeGreaterThan(0);
      const singleCombo = combinations.find((c) => c.type === 'single' && c.cards.length === 1);
      expect(singleCombo).toBeDefined();
      expect(singleCombo?.cards[0].rank).toBe(RANK_3);
      expect(singleCombo?.cards[0].suit).toBe(SUIT_SPADES);
    });

    it('should find pair combination when player has ♠3 and another 3', () => {
      const playerHand = [
        createCard(RANK_3, SUIT_SPADES), // ♠3
        createCard(RANK_3, SUIT_HEARTS), // ♥3
        createCard(RANK_4, SUIT_DIAMONDS),
        createCard(RANK_5, SUIT_CLUBS),
        createCard(RANK_6, SUIT_SPADES),
        createCard(RANK_7, SUIT_HEARTS),
        createCard(RANK_8, SUIT_DIAMONDS),
        createCard(RANK_9, SUIT_CLUBS),
        createCard(RANK_10, SUIT_SPADES),
        createCard(RANK_J, SUIT_HEARTS),
        createCard(RANK_Q, SUIT_DIAMONDS),
        createCard(RANK_K, SUIT_CLUBS),
        createCard(RANK_A, SUIT_SPADES),
      ];

      const combinations = findCombinationsWithSpade3(playerHand);

      // Should find pair combination
      const pairCombo = combinations.find((c) => c.type === 'pair' && c.cards.length === 2);
      expect(pairCombo).toBeDefined();
      expect(pairCombo?.cards.some((c) => c.rank === RANK_3 && c.suit === SUIT_SPADES)).toBe(true);
    });

    it('should find triple combination when player has all three 3s', () => {
      const playerHand = [
        createCard(RANK_3, SUIT_SPADES), // ♠3
        createCard(RANK_3, SUIT_HEARTS), // ♥3
        createCard(RANK_3, SUIT_DIAMONDS), // ♦3
        createCard(RANK_4, SUIT_CLUBS),
        createCard(RANK_5, SUIT_SPADES),
        createCard(RANK_6, SUIT_HEARTS),
        createCard(RANK_7, SUIT_DIAMONDS),
        createCard(RANK_8, SUIT_CLUBS),
        createCard(RANK_9, SUIT_SPADES),
        createCard(RANK_10, SUIT_HEARTS),
        createCard(RANK_J, SUIT_DIAMONDS),
        createCard(RANK_Q, SUIT_CLUBS),
        createCard(RANK_K, SUIT_SPADES),
      ];

      const combinations = findCombinationsWithSpade3(playerHand);

      // Should find triple combination
      const tripleCombo = combinations.find((c) => c.type === 'triple' && c.cards.length === 3);
      expect(tripleCombo).toBeDefined();
      expect(tripleCombo?.cards.some((c) => c.rank === RANK_3 && c.suit === SUIT_SPADES)).toBe(
        true,
      );
    });

    it('should find four of a kind when player has all four 3s', () => {
      const playerHand = [
        createCard(RANK_3, SUIT_SPADES), // ♠3
        createCard(RANK_3, SUIT_HEARTS), // ♥3
        createCard(RANK_3, SUIT_DIAMONDS), // ♦3
        createCard(RANK_3, SUIT_CLUBS), // ♣3
        createCard(RANK_4, SUIT_SPADES),
        createCard(RANK_5, SUIT_HEARTS),
        createCard(RANK_6, SUIT_DIAMONDS),
        createCard(RANK_7, SUIT_CLUBS),
        createCard(RANK_8, SUIT_SPADES),
        createCard(RANK_9, SUIT_HEARTS),
        createCard(RANK_10, SUIT_DIAMONDS),
        createCard(RANK_J, SUIT_CLUBS),
        createCard(RANK_Q, SUIT_SPADES),
      ];

      const combinations = findCombinationsWithSpade3(playerHand);

      // Should find four of a kind combination
      const fourOfKindCombo = combinations.find(
        (c) => c.type === 'four_of_kind' && c.cards.length === 4,
      );
      expect(fourOfKindCombo).toBeDefined();
      expect(fourOfKindCombo?.cards.some((c) => c.rank === RANK_3 && c.suit === SUIT_SPADES)).toBe(
        true,
      );
    });

    it('should find straight combination when ♠3 is part of a straight', () => {
      const playerHand = [
        createCard(RANK_3, SUIT_SPADES), // ♠3
        createCard(RANK_4, SUIT_HEARTS),
        createCard(RANK_5, SUIT_DIAMONDS),
        createCard(RANK_6, SUIT_CLUBS),
        createCard(RANK_7, SUIT_SPADES),
        createCard(RANK_8, SUIT_HEARTS),
        createCard(RANK_9, SUIT_DIAMONDS),
        createCard(RANK_10, SUIT_CLUBS),
        createCard(RANK_J, SUIT_SPADES),
        createCard(RANK_Q, SUIT_HEARTS),
        createCard(RANK_K, SUIT_DIAMONDS),
        createCard(RANK_A, SUIT_CLUBS),
        createCard(RANK_2, SUIT_SPADES),
      ];

      const combinations = findCombinationsWithSpade3(playerHand);

      // Should find straight combinations that include ♠3
      const straightCombos = combinations.filter((c) => c.type === 'straight');
      expect(straightCombos.length).toBeGreaterThan(0);
      straightCombos.forEach((combo) => {
        expect(combo.cards.some((c) => c.rank === RANK_3 && c.suit === SUIT_SPADES)).toBe(true);
      });
    });

    it('should return empty array when player does not have ♠3', () => {
      const playerHand = [
        createCard(RANK_3, SUIT_HEARTS),
        createCard(RANK_3, SUIT_DIAMONDS),
        createCard(RANK_3, SUIT_CLUBS),
        createCard(RANK_4, SUIT_SPADES),
        createCard(RANK_5, SUIT_HEARTS),
        createCard(RANK_6, SUIT_DIAMONDS),
        createCard(RANK_7, SUIT_CLUBS),
        createCard(RANK_8, SUIT_SPADES),
        createCard(RANK_9, SUIT_HEARTS),
        createCard(RANK_10, SUIT_DIAMONDS),
        createCard(RANK_J, SUIT_CLUBS),
        createCard(RANK_Q, SUIT_SPADES),
        createCard(RANK_K, SUIT_HEARTS),
      ];

      const combinations = findCombinationsWithSpade3(playerHand);

      expect(combinations).toEqual([]);
    });

    it('should throw ValidationException when playerHand is null', () => {
      expect(() => findCombinationsWithSpade3(null as any)).toThrow(ValidationException);
    });

    it('should throw ValidationException when playerHand is not an array', () => {
      expect(() => findCombinationsWithSpade3({} as any)).toThrow(ValidationException);
    });
  });

  describe('isInitialRound', () => {
    it('should return true for round 0', () => {
      expect(isInitialRound(0)).toBe(true);
    });

    it('should return false for round 1', () => {
      expect(isInitialRound(1)).toBe(false);
    });

    it('should return false for round 2', () => {
      expect(isInitialRound(2)).toBe(false);
    });

    it('should return false for any round greater than 0', () => {
      expect(isInitialRound(5)).toBe(false);
      expect(isInitialRound(10)).toBe(false);
      expect(isInitialRound(100)).toBe(false);
    });
  });

  describe('canFormCombinationWithSpade3', () => {
    it('should return true when player has ♠3', () => {
      const playerHand = [
        createCard(RANK_3, SUIT_SPADES),
        createCard(RANK_4, SUIT_HEARTS),
        createCard(RANK_5, SUIT_DIAMONDS),
        createCard(RANK_6, SUIT_CLUBS),
        createCard(RANK_7, SUIT_SPADES),
        createCard(RANK_8, SUIT_HEARTS),
        createCard(RANK_9, SUIT_DIAMONDS),
        createCard(RANK_10, SUIT_CLUBS),
        createCard(RANK_J, SUIT_SPADES),
        createCard(RANK_Q, SUIT_HEARTS),
        createCard(RANK_K, SUIT_DIAMONDS),
        createCard(RANK_A, SUIT_CLUBS),
        createCard(RANK_2, SUIT_SPADES),
      ];

      expect(canFormCombinationWithSpade3(playerHand)).toBe(true);
    });

    it('should return false when player does not have ♠3', () => {
      const playerHand = [
        createCard(RANK_3, SUIT_HEARTS),
        createCard(RANK_3, SUIT_DIAMONDS),
        createCard(RANK_3, SUIT_CLUBS),
        createCard(RANK_4, SUIT_SPADES),
        createCard(RANK_5, SUIT_HEARTS),
        createCard(RANK_6, SUIT_DIAMONDS),
        createCard(RANK_7, SUIT_CLUBS),
        createCard(RANK_8, SUIT_SPADES),
        createCard(RANK_9, SUIT_HEARTS),
        createCard(RANK_10, SUIT_DIAMONDS),
        createCard(RANK_J, SUIT_CLUBS),
        createCard(RANK_Q, SUIT_SPADES),
        createCard(RANK_K, SUIT_HEARTS),
      ];

      expect(canFormCombinationWithSpade3(playerHand)).toBe(false);
    });
  });
});
