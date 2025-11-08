import {
  checkVeBetHasHeo,
  checkVeBetHasHang,
  calculateThuiPenalty,
  determineThuiPenaltyReceiver,
  calculateThuiPenaltyResult,
  type ThuiPenaltyResult,
} from './thuiPenalty';
import {
  Card,
  RANK_2,
  SUIT_SPADES,
  SUIT_CLUBS,
  SUIT_DIAMONDS,
  SUIT_HEARTS,
} from '../../types/game';
import { PlayerRanking } from './gameEndDetection';
import { createCard } from './testHelpers';
import { ValidationException } from '../../common/exceptions';

describe('Thúi Penalty Calculation', () => {
  describe('checkVeBetHasHeo', () => {
    describe('Subtask 2.8.2.1: Check if last-place player has heo in hand', () => {
      it('should return true if hand contains heo', () => {
        const hand = [
          createCard('A', 'Hearts'),
          createCard(RANK_2, SUIT_SPADES),
          createCard('K', 'Spades'),
        ];
        expect(checkVeBetHasHeo(hand)).toBe(true);
      });

      it('should return true if hand contains multiple heo', () => {
        const hand = [
          createCard(RANK_2, SUIT_SPADES),
          createCard(RANK_2, SUIT_CLUBS),
          createCard(RANK_2, SUIT_DIAMONDS),
        ];
        expect(checkVeBetHasHeo(hand)).toBe(true);
      });

      it('should return false if hand does not contain heo', () => {
        const hand = [
          createCard('A', 'Hearts'),
          createCard('K', 'Spades'),
          createCard('Q', 'Diamonds'),
        ];
        expect(checkVeBetHasHeo(hand)).toBe(false);
      });

      it('should return false for empty hand', () => {
        expect(checkVeBetHasHeo([])).toBe(false);
      });
    });
  });

  describe('checkVeBetHasHang', () => {
    describe('Subtask 2.8.2.2: Check if last-place player has hàng in hand', () => {
      it('should return true if hand contains tứ quý', () => {
        const hand = [
          createCard('A', 'Hearts'),
          createCard('A', 'Diamonds'),
          createCard('A', 'Clubs'),
          createCard('A', 'Spades'),
        ];
        expect(checkVeBetHasHang(hand)).toBe(true);
      });

      it('should return true if hand contains 3 đôi thông', () => {
        const hand = [
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
        ];
        expect(checkVeBetHasHang(hand)).toBe(true);
      });

      it('should return true if hand contains 4 đôi thông', () => {
        const hand = [
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
          createCard('6', 'Spades'),
          createCard('6', 'Clubs'),
        ];
        expect(checkVeBetHasHang(hand)).toBe(true);
      });

      it('should return false if hand does not contain hàng', () => {
        const hand = [
          createCard('A', 'Hearts'),
          createCard('K', 'Spades'),
          createCard('Q', 'Diamonds'),
        ];
        expect(checkVeBetHasHang(hand)).toBe(false);
      });

      it('should return false for empty hand', () => {
        expect(checkVeBetHasHang([])).toBe(false);
      });
    });
  });

  describe('calculateThuiPenalty', () => {
    describe('Subtask 2.8.2.3: Calculate thúi penalties (heo values + hàng × 4)', () => {
      it('should return 0 penalty if hand is empty', () => {
        const result = calculateThuiPenalty([]);
        expect(result.hasThui).toBe(false);
        expect(result.penaltyPoints).toBe(0);
        expect(result.breakdown.heoCount).toBe(0);
        expect(result.breakdown.hangCount).toBe(0);
      });

      it('should return 0 penalty if hand has no heo or hàng', () => {
        const hand = [
          createCard('A', 'Hearts'),
          createCard('K', 'Spades'),
          createCard('Q', 'Diamonds'),
        ];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(false);
        expect(result.penaltyPoints).toBe(0);
      });

      it('should calculate penalty for single low-value heo', () => {
        const hand = [createCard(RANK_2, SUIT_SPADES), createCard('A', 'Hearts')];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(true);
        expect(result.penaltyPoints).toBe(1); // Spades 2 = 1 point
        expect(result.breakdown.heoCount).toBe(1);
        expect(result.breakdown.heoPenalty).toBe(1);
        expect(result.breakdown.hangCount).toBe(0);
        expect(result.breakdown.hangPenalty).toBe(0);
      });

      it('should calculate penalty for single high-value heo', () => {
        const hand = [createCard(RANK_2, SUIT_DIAMONDS), createCard('A', 'Hearts')];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(true);
        expect(result.penaltyPoints).toBe(2); // Diamonds 2 = 2 points
        expect(result.breakdown.heoCount).toBe(1);
        expect(result.breakdown.heoPenalty).toBe(2);
      });

      it('should calculate penalty for multiple heo with different values', () => {
        const hand = [
          createCard(RANK_2, SUIT_SPADES), // 1 point
          createCard(RANK_2, SUIT_CLUBS), // 1 point
          createCard(RANK_2, SUIT_DIAMONDS), // 2 points
          createCard(RANK_2, SUIT_HEARTS), // 2 points
        ];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(true);
        expect(result.penaltyPoints).toBe(6); // 1 + 1 + 2 + 2
        expect(result.breakdown.heoCount).toBe(4);
        expect(result.breakdown.heoPenalty).toBe(6);
      });

      it('should calculate penalty for single tứ quý', () => {
        const hand = [
          createCard('A', 'Hearts'),
          createCard('A', 'Diamonds'),
          createCard('A', 'Clubs'),
          createCard('A', 'Spades'),
        ];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(true);
        expect(result.penaltyPoints).toBe(4); // 1 hàng = 4 points
        expect(result.breakdown.hangCount).toBe(1);
        expect(result.breakdown.hangPenalty).toBe(4);
        expect(result.breakdown.heoCount).toBe(0);
        expect(result.breakdown.heoPenalty).toBe(0);
      });

      it('should calculate penalty for 3 đôi thông', () => {
        const hand = [
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
        ];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(true);
        expect(result.penaltyPoints).toBe(4); // 1 hàng = 4 points
        expect(result.breakdown.hangCount).toBe(1);
        expect(result.breakdown.hangPenalty).toBe(4);
      });

      it('should calculate penalty for 4 đôi thông', () => {
        const hand = [
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
          createCard('6', 'Spades'),
          createCard('6', 'Clubs'),
        ];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(true);
        expect(result.penaltyPoints).toBe(4); // 1 hàng = 4 points
        expect(result.breakdown.hangCount).toBe(1);
        expect(result.breakdown.hangPenalty).toBe(4);
      });

      it('should calculate penalty for multiple hàng', () => {
        const hand = [
          // First tứ quý
          createCard('A', 'Hearts'),
          createCard('A', 'Diamonds'),
          createCard('A', 'Clubs'),
          createCard('A', 'Spades'),
          // Second tứ quý
          createCard('K', 'Hearts'),
          createCard('K', 'Diamonds'),
          createCard('K', 'Clubs'),
          createCard('K', 'Spades'),
        ];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(true);
        expect(result.penaltyPoints).toBe(8); // 2 hàng = 8 points
        expect(result.breakdown.hangCount).toBe(2);
        expect(result.breakdown.hangPenalty).toBe(8);
      });

      it('should calculate penalty for both heo and hàng', () => {
        const hand = [
          createCard(RANK_2, SUIT_SPADES), // 1 point
          createCard(RANK_2, SUIT_DIAMONDS), // 2 points
          createCard('A', 'Hearts'),
          createCard('A', 'Diamonds'),
          createCard('A', 'Clubs'),
          createCard('A', 'Spades'), // hàng = 4 points
        ];
        const result = calculateThuiPenalty(hand);
        expect(result.hasThui).toBe(true);
        expect(result.penaltyPoints).toBe(7); // 1 + 2 + 4
        expect(result.breakdown.heoCount).toBe(2);
        expect(result.breakdown.heoPenalty).toBe(3);
        expect(result.breakdown.hangCount).toBe(1);
        expect(result.breakdown.hangPenalty).toBe(4);
      });
    });
  });

  describe('determineThuiPenaltyReceiver', () => {
    describe('Subtask 2.8.2.4: Determine who receives thúi penalties (3rd place or winner)', () => {
      const createRankings = (): PlayerRanking[] => [
        { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 }, // Winner
        { playerIndex: 1, rank: 2, cardCount: 5, totalCardValue: 50 },
        { playerIndex: 2, rank: 3, cardCount: 8, totalCardValue: 80 },
        { playerIndex: 3, rank: 4, cardCount: 10, totalCardValue: 100 }, // Về bét
      ];

      it('should return 3rd place for normal games', () => {
        const rankings = createRankings();
        const receiver = determineThuiPenaltyReceiver(rankings, false, [], 3);
        expect(receiver).toBe(2); // 3rd place (player index 2)
      });

      it('should return winner for tới trắng games', () => {
        const rankings = createRankings();
        const receiver = determineThuiPenaltyReceiver(rankings, true, [], 3);
        expect(receiver).toBe(0); // Winner (player index 0)
      });

      it('should return winner if cóng player finishes last', () => {
        const rankings = createRankings();
        const receiver = determineThuiPenaltyReceiver(rankings, false, [3], 3);
        expect(receiver).toBe(0); // Winner receives thúi penalties
      });

      it('should return 3rd place if cóng player does not finish last', () => {
        const rankings = createRankings();
        const receiver = determineThuiPenaltyReceiver(rankings, false, [1], 3);
        expect(receiver).toBe(2); // 3rd place receives thúi penalties
      });

      it('should throw ValidationException for empty rankings', () => {
        expect(() => determineThuiPenaltyReceiver([], false, [], 0)).toThrow(ValidationException);
      });

      it('should throw ValidationException for invalid về bét index', () => {
        const rankings = createRankings();
        expect(() => determineThuiPenaltyReceiver(rankings, false, [], -1)).toThrow(
          ValidationException,
        );
        expect(() => determineThuiPenaltyReceiver(rankings, false, [], 4)).toThrow(
          ValidationException,
        );
      });

      it('should throw ValidationException if winner not found in tới trắng game', () => {
        const rankings: PlayerRanking[] = [
          { playerIndex: 1, rank: 2, cardCount: 5, totalCardValue: 50 },
          { playerIndex: 2, rank: 3, cardCount: 8, totalCardValue: 80 },
        ];
        expect(() => determineThuiPenaltyReceiver(rankings, true, [], 1)).toThrow(
          ValidationException,
        );
      });

      it('should throw ValidationException if 3rd place not found in normal game (invalid rankings)', () => {
        // This tests a case where rankings are invalid (3+ players but no rank 3)
        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 5, totalCardValue: 50 },
          { playerIndex: 2, rank: 2, cardCount: 6, totalCardValue: 60 }, // Invalid: two rank 2s
        ];
        expect(() => determineThuiPenaltyReceiver(rankings, false, [], 1)).toThrow(
          ValidationException,
        );
      });

      it('should handle 2-player game correctly', () => {
        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 10, totalCardValue: 100 },
        ];
        // In 2-player game, there's no 3rd place, so winner receives thúi penalties
        const receiver = determineThuiPenaltyReceiver(rankings, false, [], 1);
        expect(receiver).toBe(0); // Winner receives thúi penalties
      });
    });
  });

  describe('calculateThuiPenaltyResult', () => {
    it('should calculate complete thúi penalty result for normal game', () => {
      const veBetHand = [
        createCard(RANK_2, SUIT_SPADES),
        createCard(RANK_2, SUIT_DIAMONDS),
        createCard('A', 'Hearts'),
        createCard('A', 'Diamonds'),
        createCard('A', 'Clubs'),
        createCard('A', 'Spades'),
      ];
      const rankings: PlayerRanking[] = [
        { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
        { playerIndex: 1, rank: 2, cardCount: 5, totalCardValue: 50 },
        { playerIndex: 2, rank: 3, cardCount: 8, totalCardValue: 80 },
        { playerIndex: 3, rank: 4, cardCount: 6, totalCardValue: 60 },
      ];

      const result = calculateThuiPenaltyResult(veBetHand, rankings, false, [], 3);

      expect(result.hasThui).toBe(true);
      expect(result.penaltyPoints).toBe(7); // 1 + 2 + 4
      expect(result.breakdown.heoCount).toBe(2);
      expect(result.breakdown.heoPenalty).toBe(3);
      expect(result.breakdown.hangCount).toBe(1);
      expect(result.breakdown.hangPenalty).toBe(4);
      expect(result.receiverIndex).toBe(2); // 3rd place
    });

    it('should calculate complete thúi penalty result for tới trắng game', () => {
      const veBetHand = [createCard(RANK_2, SUIT_SPADES), createCard(RANK_2, SUIT_DIAMONDS)];
      const rankings: PlayerRanking[] = [
        { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
        { playerIndex: 1, rank: 2, cardCount: 13, totalCardValue: 130 },
        { playerIndex: 2, rank: 3, cardCount: 13, totalCardValue: 130 },
        { playerIndex: 3, rank: 4, cardCount: 13, totalCardValue: 130 },
      ];

      const result = calculateThuiPenaltyResult(veBetHand, rankings, true, [], 3);

      expect(result.hasThui).toBe(true);
      expect(result.penaltyPoints).toBe(3); // 1 + 2
      expect(result.receiverIndex).toBe(0); // Winner
    });

    it('should calculate complete thúi penalty result for cóng game', () => {
      const veBetHand = [
        createCard('A', 'Hearts'),
        createCard('A', 'Diamonds'),
        createCard('A', 'Clubs'),
        createCard('A', 'Spades'),
      ];
      const rankings: PlayerRanking[] = [
        { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
        { playerIndex: 1, rank: 2, cardCount: 5, totalCardValue: 50 },
        { playerIndex: 2, rank: 3, cardCount: 8, totalCardValue: 80 },
        { playerIndex: 3, rank: 4, cardCount: 13, totalCardValue: 130 },
      ];

      const result = calculateThuiPenaltyResult(veBetHand, rankings, false, [3], 3);

      expect(result.hasThui).toBe(true);
      expect(result.penaltyPoints).toBe(4); // 1 hàng
      expect(result.receiverIndex).toBe(0); // Winner (because cóng player finished last)
    });

    it('should return no thúi if hand has no heo or hàng', () => {
      const veBetHand = [
        createCard('A', 'Hearts'),
        createCard('K', 'Spades'),
        createCard('Q', 'Diamonds'),
      ];
      const rankings: PlayerRanking[] = [
        { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
        { playerIndex: 1, rank: 2, cardCount: 5, totalCardValue: 50 },
        { playerIndex: 2, rank: 3, cardCount: 8, totalCardValue: 80 },
        { playerIndex: 3, rank: 4, cardCount: 3, totalCardValue: 30 },
      ];

      const result = calculateThuiPenaltyResult(veBetHand, rankings, false, [], 3);

      expect(result.hasThui).toBe(false);
      expect(result.penaltyPoints).toBe(0);
      expect(result.receiverIndex).toBe(2); // Still returns 3rd place even if no thúi
    });
  });
});
