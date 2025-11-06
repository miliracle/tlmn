import {
  detectSingle,
  detectPair,
  detectTriple,
  detectStraight,
  detectConsecutivePairs,
  detectFourOfKind,
  detectCombination,
  compareCombinations,
  canBeatCombination,
} from './combinations';
import { generateDeck } from './deck';
import { Card } from '../../types/game';
import { ValidationException } from '../../common/exceptions';

describe('Combination Detection', () => {
  describe('detectSingle', () => {
    it('should detect a single card', () => {
      const deck = generateDeck();
      const card = deck[0];
      const result = detectSingle([card]);

      expect(result).not.toBeNull();
      expect(result?.type).toBe('single');
      expect(result?.cards).toHaveLength(1);
      expect(result?.cards[0]).toBe(card);
    });

    it('should return null for multiple cards', () => {
      const deck = generateDeck();
      const result = detectSingle([deck[0], deck[1]]);
      expect(result).toBeNull();
    });

    it('should return null for empty array', () => {
      const result = detectSingle([]);
      expect(result).toBeNull();
    });
  });

  describe('detectPair', () => {
    it('should detect a valid pair', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!;
      const result = detectPair([card1, card2]);

      expect(result).not.toBeNull();
      expect(result?.type).toBe('pair');
      expect(result?.cards).toHaveLength(2);
    });

    it('should return null for cards of different ranks', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === '4' && c.suit === 'Spades')!;
      const result = detectPair([card1, card2]);
      expect(result).toBeNull();
    });

    it('should return null for wrong number of cards', () => {
      const deck = generateDeck();
      const result1 = detectPair([deck[0]]);
      const result2 = detectPair([deck[0], deck[1], deck[2]]);
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('detectTriple', () => {
    it('should detect a valid triple', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!;
      const card3 = deck.find((c) => c.rank === '3' && c.suit === 'Diamonds')!;
      const result = detectTriple([card1, card2, card3]);

      expect(result).not.toBeNull();
      expect(result?.type).toBe('triple');
      expect(result?.cards).toHaveLength(3);
    });

    it('should return null for cards of different ranks', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!;
      const card3 = deck.find((c) => c.rank === '4' && c.suit === 'Spades')!;
      const result = detectTriple([card1, card2, card3]);
      expect(result).toBeNull();
    });

    it('should return null for wrong number of cards', () => {
      const deck = generateDeck();
      const result1 = detectTriple([deck[0], deck[1]]);
      const result2 = detectTriple([deck[0], deck[1], deck[2], deck[3]]);
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('detectStraight', () => {
    it('should detect a valid 3-card straight', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!;
      const card3 = deck.find((c) => c.rank === '5' && c.suit === 'Diamonds')!;
      const result = detectStraight([card1, card2, card3]);

      expect(result).not.toBeNull();
      expect(result?.type).toBe('straight');
      expect(result?.cards).toHaveLength(3);
    });

    it('should detect a valid 5-card straight', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Diamonds')!,
        deck.find((c) => c.rank === '6' && c.suit === 'Clubs')!,
        deck.find((c) => c.rank === '7' && c.suit === 'Spades')!,
      ];
      const result = detectStraight(cards);

      expect(result).not.toBeNull();
      expect(result?.type).toBe('straight');
      expect(result?.cards).toHaveLength(5);
    });

    it('should return null if straight includes rank 2', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === 'A' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === 'K' && c.suit === 'Hearts')!;
      const card3 = deck.find((c) => c.rank === '2' && c.suit === 'Diamonds')!;
      const result = detectStraight([card1, card2, card3]);
      expect(result).toBeNull();
    });

    it('should return null for non-consecutive ranks', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!;
      const card3 = deck.find((c) => c.rank === '6' && c.suit === 'Diamonds')!;
      const result = detectStraight([card1, card2, card3]);
      expect(result).toBeNull();
    });

    it('should return null for less than 3 cards', () => {
      const deck = generateDeck();
      const result = detectStraight([deck[0], deck[1]]);
      expect(result).toBeNull();
    });

    it('should return null for more than 12 cards', () => {
      const deck = generateDeck();
      const cards = deck.filter((c) => c.rank !== '2').slice(0, 13);
      const result = detectStraight(cards);
      expect(result).toBeNull();
    });
  });

  describe('detectConsecutivePairs', () => {
    it('should detect 3 consecutive pairs', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Hearts')!,
      ];
      const result = detectConsecutivePairs(cards);

      expect(result).not.toBeNull();
      expect(result?.type).toBe('consecutive_pairs');
      expect(result?.cards).toHaveLength(6);
    });

    it('should detect 4 consecutive pairs', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '6' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '6' && c.suit === 'Hearts')!,
      ];
      const result = detectConsecutivePairs(cards);

      expect(result).not.toBeNull();
      expect(result?.type).toBe('consecutive_pairs');
      expect(result?.cards).toHaveLength(8);
    });

    it('should return null if consecutive pairs include rank 2', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === 'A' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === 'A' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === 'K' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === 'K' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '2' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '2' && c.suit === 'Hearts')!,
      ];
      const result = detectConsecutivePairs(cards);
      expect(result).toBeNull();
    });

    it('should return null for non-consecutive pairs', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '6' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '6' && c.suit === 'Hearts')!,
      ];
      const result = detectConsecutivePairs(cards);
      expect(result).toBeNull();
    });

    it('should return null for less than 3 pairs', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
      ];
      const result = detectConsecutivePairs(cards);
      expect(result).toBeNull();
    });

    it('should return null for more than 6 pairs', () => {
      const deck = generateDeck();
      const cards: Card[] = [];
      const ranks = ['3', '4', '5', '6', '7', '8', '9'];
      for (const rank of ranks) {
        const pair = deck.filter((c) => c.rank === rank).slice(0, 2);
        cards.push(...pair);
      }
      const result = detectConsecutivePairs(cards);
      expect(result).toBeNull();
    });

    it('should return null if a rank has more than 2 cards', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Diamonds')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Hearts')!,
      ];
      const result = detectConsecutivePairs(cards);
      expect(result).toBeNull();
    });
  });

  describe('detectFourOfKind', () => {
    it('should detect a valid four of a kind', () => {
      const deck = generateDeck();
      const cards = deck.filter((c) => c.rank === '3');
      const result = detectFourOfKind(cards);

      expect(result).not.toBeNull();
      expect(result?.type).toBe('four_of_kind');
      expect(result?.cards).toHaveLength(4);
    });

    it('should return null for four of a kind with rank 2', () => {
      const deck = generateDeck();
      const cards = deck.filter((c) => c.rank === '2');
      const result = detectFourOfKind(cards);
      expect(result).toBeNull();
    });

    it('should return null for cards of different ranks', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Diamonds')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
      ];
      const result = detectFourOfKind(cards);
      expect(result).toBeNull();
    });

    it('should return null for wrong number of cards', () => {
      const deck = generateDeck();
      const cards3 = deck.filter((c) => c.rank === '3').slice(0, 3);
      // Create 5 cards by adding a different rank card
      const cards5 = [...deck.filter((c) => c.rank === '3'), deck.find((c) => c.rank === '4')!];
      const result1 = detectFourOfKind(cards3);
      const result2 = detectFourOfKind(cards5);
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('detectCombination', () => {
    it('should detect single card', () => {
      const deck = generateDeck();
      const result = detectCombination([deck[0]]);
      expect(result?.type).toBe('single');
    });

    it('should detect pair over single', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!;
      const result = detectCombination([card1, card2]);
      expect(result?.type).toBe('pair');
    });

    it('should detect triple over pair', () => {
      const deck = generateDeck();
      const cards = deck.filter((c) => c.rank === '3').slice(0, 3);
      const result = detectCombination(cards);
      expect(result?.type).toBe('triple');
    });

    it('should detect straight over triple', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Diamonds')!,
      ];
      const result = detectCombination(cards);
      expect(result?.type).toBe('straight');
    });

    it('should detect consecutive pairs over straight', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Hearts')!,
      ];
      const result = detectCombination(cards);
      expect(result?.type).toBe('consecutive_pairs');
    });

    it('should detect four of a kind over consecutive pairs', () => {
      const deck = generateDeck();
      const cards = deck.filter((c) => c.rank === '3');
      const result = detectCombination(cards);
      expect(result?.type).toBe('four_of_kind');
    });

    it('should return null for invalid combination', () => {
      const deck = generateDeck();
      const cards = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '7' && c.suit === 'Diamonds')!,
      ];
      const result = detectCombination(cards);
      expect(result).toBeNull();
    });
  });

  describe('compareCombinations', () => {
    it('should compare single cards correctly', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === 'A' && c.suit === 'Hearts')!;
      const card2 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const combo1 = detectSingle([card1])!;
      const combo2 = detectSingle([card2])!;

      expect(compareCombinations(combo1, combo2)).toBeGreaterThan(0);
      expect(compareCombinations(combo2, combo1)).toBeLessThan(0);
    });

    it('should compare pairs correctly', () => {
      const deck = generateDeck();
      const pair1 = [
        deck.find((c) => c.rank === 'A' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === 'A' && c.suit === 'Diamonds')!,
      ];
      const pair2 = [
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Diamonds')!,
      ];
      const combo1 = detectPair(pair1)!;
      const combo2 = detectPair(pair2)!;

      expect(compareCombinations(combo1, combo2)).toBeGreaterThan(0);
      expect(compareCombinations(combo2, combo1)).toBeLessThan(0);
    });

    it('should compare straights: longer beats shorter', () => {
      const deck = generateDeck();
      const straight3 = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Diamonds')!,
      ];
      const straight5 = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Diamonds')!,
        deck.find((c) => c.rank === '6' && c.suit === 'Clubs')!,
        deck.find((c) => c.rank === '7' && c.suit === 'Spades')!,
      ];
      const combo1 = detectStraight(straight5)!;
      const combo2 = detectStraight(straight3)!;

      expect(compareCombinations(combo1, combo2)).toBeGreaterThan(0);
      expect(compareCombinations(combo2, combo1)).toBeLessThan(0);
    });

    it('should compare same-length straights by highest card', () => {
      const deck = generateDeck();
      const straight1 = [
        deck.find((c) => c.rank === 'A' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === 'K' && c.suit === 'Diamonds')!,
        deck.find((c) => c.rank === 'Q' && c.suit === 'Clubs')!,
      ];
      const straight2 = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Diamonds')!,
      ];
      const combo1 = detectStraight(straight1)!;
      const combo2 = detectStraight(straight2)!;

      expect(compareCombinations(combo1, combo2)).toBeGreaterThan(0);
      expect(compareCombinations(combo2, combo1)).toBeLessThan(0);
    });

    it('should compare consecutive pairs: longer beats shorter', () => {
      const deck = generateDeck();
      const pairs3 = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Hearts')!,
      ];
      const pairs4 = [
        deck.find((c) => c.rank === '3' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '3' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '4' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '5' && c.suit === 'Hearts')!,
        deck.find((c) => c.rank === '6' && c.suit === 'Spades')!,
        deck.find((c) => c.rank === '6' && c.suit === 'Hearts')!,
      ];
      const combo1 = detectConsecutivePairs(pairs4)!;
      const combo2 = detectConsecutivePairs(pairs3)!;

      expect(compareCombinations(combo1, combo2)).toBeGreaterThan(0);
      expect(compareCombinations(combo2, combo1)).toBeLessThan(0);
    });

    it('should compare four of a kind by rank', () => {
      const deck = generateDeck();
      const fourA = deck.filter((c) => c.rank === 'A');
      const four3 = deck.filter((c) => c.rank === '3');
      const combo1 = detectFourOfKind(fourA)!;
      const combo2 = detectFourOfKind(four3)!;

      expect(compareCombinations(combo1, combo2)).toBeGreaterThan(0);
      expect(compareCombinations(combo2, combo1)).toBeLessThan(0);
    });

    it('should throw error when comparing different types', () => {
      const deck = generateDeck();
      const combo1 = detectSingle([deck[0]])!;
      const combo2 = detectPair([deck[0], deck[1]])!;

      expect(() => compareCombinations(combo1, combo2)).toThrow(ValidationException);
    });
  });

  describe('canBeatCombination', () => {
    it('should return true if new combination beats last', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === 'A' && c.suit === 'Hearts')!;
      const card2 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const combo1 = detectSingle([card1])!;
      const combo2 = detectSingle([card2])!;

      expect(canBeatCombination(combo1, combo2)).toBe(true);
      expect(canBeatCombination(combo2, combo1)).toBe(false);
    });

    it('should return false if new combination does not beat last', () => {
      const deck = generateDeck();
      const card1 = deck.find((c) => c.rank === '3' && c.suit === 'Spades')!;
      const card2 = deck.find((c) => c.rank === 'A' && c.suit === 'Hearts')!;
      const combo1 = detectSingle([card1])!;
      const combo2 = detectSingle([card2])!;

      expect(canBeatCombination(combo1, combo2)).toBe(false);
    });
  });
});
