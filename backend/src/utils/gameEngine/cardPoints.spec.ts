import { calculateCardPoints, getCardPoints } from './cardPoints';
import {
  RANK_2,
  RANK_A,
  RANK_K,
  RANK_3,
  SUIT_HEARTS,
  SUIT_DIAMONDS,
  SUIT_CLUBS,
  SUIT_SPADES,
  CARD_RANKS,
  CARD_SUITS,
} from '../../types/game';
import { ValidationException } from '../../common/exceptions';

describe('Card Points Calculation', () => {
  describe('calculateCardPoints', () => {
    describe('Regular cards (non-2s)', () => {
      it('should return 1 point for all non-2 cards', () => {
        const nonTwoRanks = CARD_RANKS.filter((rank) => rank !== RANK_2);

        for (const rank of nonTwoRanks) {
          for (const suit of CARD_SUITS) {
            const points = calculateCardPoints(rank, suit);
            expect(points).toBe(1);
          }
        }
      });

      it('should return 1 point for Ace', () => {
        expect(calculateCardPoints(RANK_A, SUIT_HEARTS)).toBe(1);
        expect(calculateCardPoints(RANK_A, SUIT_SPADES)).toBe(1);
        expect(calculateCardPoints(RANK_A, SUIT_DIAMONDS)).toBe(1);
        expect(calculateCardPoints(RANK_A, SUIT_CLUBS)).toBe(1);
      });

      it('should return 1 point for King', () => {
        expect(calculateCardPoints(RANK_K, SUIT_HEARTS)).toBe(1);
        expect(calculateCardPoints(RANK_K, SUIT_SPADES)).toBe(1);
      });

      it('should return 1 point for 3', () => {
        expect(calculateCardPoints(RANK_3, SUIT_HEARTS)).toBe(1);
        expect(calculateCardPoints(RANK_3, SUIT_SPADES)).toBe(1);
      });
    });

    describe('Heo (rank 2)', () => {
      it('should return 4 points for Diamonds 2', () => {
        expect(calculateCardPoints(RANK_2, SUIT_DIAMONDS)).toBe(4);
      });

      it('should return 4 points for Hearts 2', () => {
        expect(calculateCardPoints(RANK_2, SUIT_HEARTS)).toBe(4);
      });

      it('should return 2 points for Spades 2', () => {
        expect(calculateCardPoints(RANK_2, SUIT_SPADES)).toBe(2);
      });

      it('should return 2 points for Clubs 2', () => {
        expect(calculateCardPoints(RANK_2, SUIT_CLUBS)).toBe(2);
      });

      it('should have correct point distribution for all 2s', () => {
        const diamonds2 = calculateCardPoints(RANK_2, SUIT_DIAMONDS);
        const hearts2 = calculateCardPoints(RANK_2, SUIT_HEARTS);
        const spades2 = calculateCardPoints('2', 'Spades');
        const clubs2 = calculateCardPoints('2', 'Clubs');

        expect(diamonds2).toBe(4);
        expect(hearts2).toBe(4);
        expect(spades2).toBe(2);
        expect(clubs2).toBe(2);
      });
    });

    describe('Point value validation', () => {
      it('should only return 1, 2, or 4 as point values', () => {
        for (const rank of CARD_RANKS) {
          for (const suit of CARD_SUITS) {
            const points = calculateCardPoints(rank, suit);
            expect([1, 2, 4]).toContain(points);
          }
        }
      });

      it('should return 2 or 4 for rank 2 cards only', () => {
        for (const suit of CARD_SUITS) {
          const points = calculateCardPoints('2', suit);
          expect([2, 4]).toContain(points);
        }
      });

      it('should return 1 for all non-2 rank cards', () => {
        const nonTwoRanks = CARD_RANKS.filter((rank) => rank !== '2');

        for (const rank of nonTwoRanks) {
          for (const suit of CARD_SUITS) {
            const points = calculateCardPoints(rank, suit);
            expect(points).toBe(1);
          }
        }
      });
    });

    describe('Error handling', () => {
      it('should throw ValidationException for invalid rank', () => {
        expect(() => calculateCardPoints('X', SUIT_HEARTS)).toThrow(ValidationException);
        expect(() => calculateCardPoints('', SUIT_HEARTS)).toThrow(ValidationException);
        expect(() => calculateCardPoints('1', SUIT_HEARTS)).toThrow(ValidationException);
      });

      it('should throw ValidationException for invalid suit', () => {
        expect(() => calculateCardPoints(RANK_A, 'Invalid')).toThrow(ValidationException);
        expect(() => calculateCardPoints(RANK_A, '')).toThrow(ValidationException);
        expect(() => calculateCardPoints(RANK_A, SUIT_HEARTS)).toThrow(ValidationException);
      });

      it('should throw ValidationException with correct error details for invalid rank', () => {
        try {
          calculateCardPoints('X', SUIT_HEARTS);
          fail('Should have thrown ValidationException');
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationException);
          if (error instanceof ValidationException) {
            expect(error.message).toContain('Invalid card rank');
            expect(error.metadata?.rank).toBe('X');
            expect(error.metadata?.validRanks).toBeDefined();
          }
        }
      });

      it('should throw ValidationException with correct error details for invalid suit', () => {
        try {
          calculateCardPoints(RANK_A, 'Invalid');
          fail('Should have thrown ValidationException');
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationException);
          if (error instanceof ValidationException) {
            expect(error.message).toContain('Invalid card suit');
            expect(error.metadata?.suit).toBe('Invalid');
            expect(error.metadata?.validSuits).toBeDefined();
          }
        }
      });
    });
  });

  describe('getCardPoints', () => {
    it('should return the same points as calculateCardPoints', () => {
      const card = { rank: RANK_A, suit: SUIT_HEARTS };
      const directPoints = calculateCardPoints(RANK_A, SUIT_HEARTS);
      const cardPoints = getCardPoints(card);

      expect(cardPoints).toBe(directPoints);
    });

    it('should work with Card-like objects for regular cards', () => {
      const card = { rank: RANK_K, suit: SUIT_SPADES };
      const points = getCardPoints(card);
      expect(points).toBe(1);
    });

    it('should work with Card-like objects for heo cards', () => {
      const diamonds2 = { rank: RANK_2, suit: SUIT_DIAMONDS };
      const hearts2 = { rank: RANK_2, suit: SUIT_HEARTS };
      const spades2 = { rank: RANK_2, suit: SUIT_SPADES };
      const clubs2 = { rank: RANK_2, suit: SUIT_CLUBS };

      expect(getCardPoints(diamonds2)).toBe(4);
      expect(getCardPoints(hearts2)).toBe(4);
      expect(getCardPoints(spades2)).toBe(2);
      expect(getCardPoints(clubs2)).toBe(2);
    });

    it('should work for all valid card combinations', () => {
      for (const rank of CARD_RANKS) {
        for (const suit of CARD_SUITS) {
          const card = { rank, suit };
          const directPoints = calculateCardPoints(rank, suit);
          const cardPoints = getCardPoints(card);

          expect(cardPoints).toBe(directPoints);
        }
      }
    });

    it('should throw ValidationException for invalid rank in card object', () => {
      const card = { rank: 'X', suit: SUIT_HEARTS };
      expect(() => getCardPoints(card)).toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid suit in card object', () => {
      const card = { rank: RANK_A, suit: 'Invalid' };
      expect(() => getCardPoints(card)).toThrow(ValidationException);
    });
  });
});
