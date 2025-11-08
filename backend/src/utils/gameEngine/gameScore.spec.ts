import {
  calculateWinnerCardPoints,
  calculateWinnerTotalPoints,
  calculateLoserPoints,
  calculateToiTrangScoring,
  calculateGameScore,
} from './gameScore';
import {
  Card,
  RANK_10,
  RANK_2,
  RANK_6,
  RANK_7,
  RANK_8,
  RANK_9,
  RANK_A,
  RANK_J,
  RANK_K,
  RANK_Q,
  SUIT_CLUBS,
  SUIT_DIAMONDS,
  SUIT_HEARTS,
  SUIT_SPADES,
} from '../../types/game';
import { PlayerRanking } from './gameEndDetection';
import { CongPenaltyResult } from './congPenalty';
import { initializePenaltyTracking } from './chatPenalty';
import { ThuiPenaltyResult } from './thuiPenalty';
import { createCard } from './testHelpers';
import { ValidationException } from '../../common/exceptions';

describe('Game Score Calculation', () => {
  describe('calculateWinnerCardPoints', () => {
    describe('Subtask 2.8.4.1: Calculate winner card points (1 per card remaining in losers)', () => {
      it('should calculate card points for 4-player game', () => {
        const playerHands: Card[][] = [
          [], // Winner (0 cards)
          [
            createCard(RANK_A, SUIT_HEARTS),
            createCard(RANK_K, SUIT_SPADES),
            createCard(RANK_Q, SUIT_DIAMONDS),
          ], // 3 cards
          [createCard(RANK_J, SUIT_CLUBS), createCard(RANK_10, SUIT_HEARTS)], // 2 cards
          [
            createCard(RANK_9, SUIT_SPADES),
            createCard(RANK_8, SUIT_DIAMONDS),
            createCard(RANK_7, SUIT_CLUBS),
            createCard(RANK_6, SUIT_HEARTS),
          ], // 4 cards
        ];

        const cardPoints = calculateWinnerCardPoints(playerHands, 0);
        expect(cardPoints).toBe(9); // 3 + 2 + 4
      });

      it('should calculate card points for 3-player game', () => {
        const playerHands: Card[][] = [
          [], // Winner
          [createCard(RANK_A, SUIT_HEARTS), createCard(RANK_K, SUIT_SPADES)], // 2 cards
          [
            createCard(RANK_Q, SUIT_DIAMONDS),
            createCard(RANK_J, SUIT_CLUBS),
            createCard(RANK_10, SUIT_HEARTS),
          ], // 3 cards
        ];

        const cardPoints = calculateWinnerCardPoints(playerHands, 0);
        expect(cardPoints).toBe(5); // 2 + 3
      });

      it('should calculate card points for 2-player game', () => {
        const playerHands: Card[][] = [
          [], // Winner
          [
            createCard(RANK_A, SUIT_HEARTS),
            createCard(RANK_K, SUIT_SPADES),
            createCard(RANK_Q, SUIT_DIAMONDS),
          ], // 3 cards
        ];

        const cardPoints = calculateWinnerCardPoints(playerHands, 0);
        expect(cardPoints).toBe(3);
      });

      it('should return 0 if all losers have empty hands', () => {
        const playerHands: Card[][] = [
          [], // Winner
          [], // Loser 1
          [], // Loser 2
          [], // Loser 3
        ];

        const cardPoints = calculateWinnerCardPoints(playerHands, 0);
        expect(cardPoints).toBe(0);
      });

      it('should throw ValidationException for invalid winner index', () => {
        const playerHands: Card[][] = [[], [createCard(RANK_A, SUIT_HEARTS)]];

        expect(() => calculateWinnerCardPoints(playerHands, -1)).toThrow(ValidationException);
        expect(() => calculateWinnerCardPoints(playerHands, 2)).toThrow(ValidationException);
      });

      it('should throw ValidationException for empty player hands', () => {
        expect(() => calculateWinnerCardPoints([], 0)).toThrow(ValidationException);
      });
    });
  });

  describe('calculateWinnerTotalPoints', () => {
    describe('Subtask 2.8.4.2: Calculate winner total points (cards + cóng + chặt received + thúi)', () => {
      it('should calculate total points with all components', () => {
        const playerHands: Card[][] = [
          [], // Winner
          [createCard(RANK_A, SUIT_HEARTS), createCard(RANK_K, SUIT_SPADES)], // 2 cards
          [createCard(RANK_Q, SUIT_DIAMONDS)], // 1 card
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 52,
          penaltyPerCongPlayer: 52,
          congPlayerPenalties: new Map([[1, 52]]),
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 52,
        };

        let chatPenaltyState = initializePenaltyTracking(3);
        // Simulate winner receiving chặt penalties
        chatPenaltyState = {
          ...chatPenaltyState,
          playerPenalties: new Map([
            [0, { penaltiesPaid: 0, penaltiesReceived: 8 }], // Winner received 8
            [1, { penaltiesPaid: 4, penaltiesReceived: 0 }],
            [2, { penaltiesPaid: 4, penaltiesReceived: 0 }],
          ]),
        };

        const thuiPenaltyResult: ThuiPenaltyResult = {
          hasThui: true,
          penaltyPoints: 6,
          breakdown: {
            heoPenalty: 3,
            hangPenalty: 3,
            heoCount: 2,
            hangCount: 1,
          },
          receiverIndex: 0, // Winner receives
        };

        const totalPoints = calculateWinnerTotalPoints(
          playerHands,
          0,
          congPenaltyResult,
          chatPenaltyState,
          thuiPenaltyResult,
        );

        expect(totalPoints).toBe(69); // 3 (cards) + 52 (cóng) + 8 (chặt) + 6 (thúi) = 69
      });

      it('should calculate total points without thúi', () => {
        const playerHands: Card[][] = [[], [createCard('A', 'Hearts')]];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 0,
          penaltyPerCongPlayer: 26,
          congPlayerPenalties: new Map(),
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 0,
        };

        const chatPenaltyState = initializePenaltyTracking(2);

        const totalPoints = calculateWinnerTotalPoints(
          playerHands,
          0,
          congPenaltyResult,
          chatPenaltyState,
          null,
        );

        expect(totalPoints).toBe(1); // 1 card point
      });
    });
  });

  describe('calculateLoserPoints', () => {
    describe('Subtask 2.8.4.3: Calculate loser points (negative: cards + cóng + chặt paid + thúi)', () => {
      it('should calculate loser points with all components', () => {
        const playerHands: Card[][] = [
          [], // Winner
          [
            createCard(RANK_A, SUIT_HEARTS),
            createCard(RANK_K, SUIT_SPADES),
            createCard(RANK_Q, SUIT_DIAMONDS),
          ], // 3 cards
        ];

        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 3, totalCardValue: 30 },
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 0,
          penaltyPerCongPlayer: 26,
          congPlayerPenalties: new Map(),
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 0,
        };

        let chatPenaltyState = initializePenaltyTracking(2);
        chatPenaltyState = {
          ...chatPenaltyState,
          playerPenalties: new Map([
            [0, { penaltiesPaid: 0, penaltiesReceived: 4 }],
            [1, { penaltiesPaid: 4, penaltiesReceived: 0 }], // Loser paid 4
          ]),
        };

        const loserPoints = calculateLoserPoints(
          playerHands,
          1,
          0,
          rankings,
          congPenaltyResult,
          chatPenaltyState,
          null,
        );

        expect(loserPoints).toBe(-7); // -3 (cards) - 0 (cóng) - 4 (chặt) - 0 (thúi) = -7
      });

      it('should calculate loser points with cóng penalty', () => {
        const playerHands: Card[][] = [[], [createCard(RANK_A, SUIT_HEARTS)]];

        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 1, totalCardValue: 10 },
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 26,
          penaltyPerCongPlayer: 26,
          congPlayerPenalties: new Map([[1, 26]]), // Player 1 got cóng
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 26,
        };

        const chatPenaltyState = initializePenaltyTracking(2);

        const loserPoints = calculateLoserPoints(
          playerHands,
          1,
          0,
          rankings,
          congPenaltyResult,
          chatPenaltyState,
          null,
        );

        expect(loserPoints).toBe(-27); // -1 (cards) - 26 (cóng) - 0 (chặt) - 0 (thúi) = -27
      });

      it('should calculate loser points with thúi penalty (về bét)', () => {
        const playerHands: Card[][] = [
          [],
          [createCard(RANK_A, SUIT_HEARTS)],
          [createCard(RANK_K, SUIT_SPADES), createCard(RANK_2, SUIT_SPADES)], // Has heo
        ];

        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 1, totalCardValue: 10 },
          { playerIndex: 2, rank: 3, cardCount: 2, totalCardValue: 20 }, // Về bét
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 0,
          penaltyPerCongPlayer: 39,
          congPlayerPenalties: new Map(),
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 0,
        };

        const chatPenaltyState = initializePenaltyTracking(3);

        const thuiPenaltyResult: ThuiPenaltyResult = {
          hasThui: true,
          penaltyPoints: 1, // 1 heo
          breakdown: {
            heoPenalty: 1,
            hangPenalty: 0,
            heoCount: 1,
            hangCount: 0,
          },
          receiverIndex: 1, // 3rd place receives (but player 2 is về bét)
        };

        const loserPoints = calculateLoserPoints(
          playerHands,
          2,
          0,
          rankings,
          congPenaltyResult,
          chatPenaltyState,
          thuiPenaltyResult,
        );

        expect(loserPoints).toBe(-3); // -2 (cards) - 0 (cóng) - 0 (chặt) - 1 (thúi) = -3
      });

      it('should throw ValidationException if calculating for winner', () => {
        const playerHands: Card[][] = [[], [createCard('A', 'Hearts')]];
        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 1, totalCardValue: 10 },
        ];

        expect(() =>
          calculateLoserPoints(
            playerHands,
            0,
            0,
            rankings,
            {
              totalCongPenalties: 0,
              penaltyPerCongPlayer: 26,
              congPlayerPenalties: new Map(),
              denBaiPenalty: 0,
              denBaiPlayerIndex: null,
              winnerReceives: 0,
            },
            initializePenaltyTracking(2),
            null,
          ),
        ).toThrow(ValidationException);
      });
    });
  });

  describe('calculateToiTrangScoring', () => {
    describe('Subtask 2.8.4.4: Calculate tới trắng scoring', () => {
      it('should calculate tới trắng scoring for 4-player game', () => {
        const result = calculateToiTrangScoring(4, 0, null);

        expect(result.winnerReceives).toBe(156); // 52 × 3 losers
        expect(result.loserPenalties.size).toBe(3);
        expect(result.loserPenalties.get(1)).toBe(52);
        expect(result.loserPenalties.get(2)).toBe(52);
        expect(result.loserPenalties.get(3)).toBe(52);
      });

      it('should calculate tới trắng scoring for 3-player game', () => {
        const result = calculateToiTrangScoring(3, 0, null);

        expect(result.winnerReceives).toBe(78); // 39 × 2 losers
        expect(result.loserPenalties.size).toBe(2);
        expect(result.loserPenalties.get(1)).toBe(39);
        expect(result.loserPenalties.get(2)).toBe(39);
      });

      it('should calculate tới trắng scoring for 2-player game', () => {
        const result = calculateToiTrangScoring(2, 0, null);

        expect(result.winnerReceives).toBe(26); // 26 × 1 loser
        expect(result.loserPenalties.size).toBe(1);
        expect(result.loserPenalties.get(1)).toBe(26);
      });

      it('should include thúi penalties in winner receives', () => {
        const thuiPenaltyResult: ThuiPenaltyResult = {
          hasThui: true,
          penaltyPoints: 6,
          breakdown: {
            heoPenalty: 3,
            hangPenalty: 3,
            heoCount: 2,
            hangCount: 1,
          },
          receiverIndex: 0, // Winner receives
        };

        const result = calculateToiTrangScoring(4, 0, thuiPenaltyResult);

        expect(result.winnerReceives).toBe(162); // 156 (tới trắng) + 6 (thúi)
      });

      it('should not include thúi penalties if receiver is not winner', () => {
        const thuiPenaltyResult: ThuiPenaltyResult = {
          hasThui: true,
          penaltyPoints: 6,
          breakdown: {
            heoPenalty: 3,
            hangPenalty: 3,
            heoCount: 2,
            hangCount: 1,
          },
          receiverIndex: 1, // Not winner
        };

        const result = calculateToiTrangScoring(4, 0, thuiPenaltyResult);

        expect(result.winnerReceives).toBe(156); // Only tới trắng, no thúi
      });

      it('should throw ValidationException for invalid number of players', () => {
        expect(() => calculateToiTrangScoring(1, 0, null)).toThrow(ValidationException);
        expect(() => calculateToiTrangScoring(5, 0, null)).toThrow(ValidationException);
      });

      it('should throw ValidationException for invalid winner index', () => {
        expect(() => calculateToiTrangScoring(4, -1, null)).toThrow(ValidationException);
        expect(() => calculateToiTrangScoring(4, 4, null)).toThrow(ValidationException);
      });
    });
  });

  describe('calculateGameScore', () => {
    describe('Subtask 2.8.4.5: Return complete score breakdown', () => {
      it('should calculate complete score for normal game', () => {
        const playerHands: Card[][] = [
          [], // Winner
          [createCard(RANK_A, SUIT_HEARTS), createCard(RANK_K, SUIT_SPADES)], // 2 cards
          [createCard(RANK_Q, SUIT_DIAMONDS)], // 1 card
        ];

        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 2, totalCardValue: 20 },
          { playerIndex: 2, rank: 3, cardCount: 1, totalCardValue: 10 },
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 0,
          penaltyPerCongPlayer: 39,
          congPlayerPenalties: new Map(),
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 0,
        };

        const chatPenaltyState = initializePenaltyTracking(3);

        const result = calculateGameScore(
          playerHands,
          0,
          rankings,
          false,
          congPenaltyResult,
          chatPenaltyState,
          null,
        );

        expect(result.winnerIndex).toBe(0);
        expect(result.isInstantWin).toBe(false);
        expect(result.playerScores.length).toBe(3);

        // Winner
        expect(result.playerScores[0].totalScore).toBe(3); // 2 + 1 cards
        expect(result.playerScores[0].breakdown.cardPoints).toBe(3);
        expect(result.playerScores[0].breakdown.congPenalties).toBe(0);
        expect(result.playerScores[0].breakdown.chatPenalties).toBe(0);
        expect(result.playerScores[0].breakdown.thuiPenalties).toBe(0);

        // Loser 1
        expect(result.playerScores[1].totalScore).toBe(-2); // -2 cards
        expect(result.playerScores[1].breakdown.cardPoints).toBe(-2);

        // Loser 2
        expect(result.playerScores[2].totalScore).toBe(-1); // -1 card
        expect(result.playerScores[2].breakdown.cardPoints).toBe(-1);
      });

      it('should calculate complete score for tới trắng game', () => {
        const playerHands: Card[][] = [
          [], // Winner
          [createCard(RANK_A, SUIT_HEARTS)],
          [createCard(RANK_K, SUIT_SPADES)],
        ];

        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 1, totalCardValue: 10 },
          { playerIndex: 2, rank: 3, cardCount: 1, totalCardValue: 10 },
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 0,
          penaltyPerCongPlayer: 39,
          congPlayerPenalties: new Map(),
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 0,
        };

        const chatPenaltyState = initializePenaltyTracking(3);

        const result = calculateGameScore(
          playerHands,
          0,
          rankings,
          true,
          congPenaltyResult,
          chatPenaltyState,
          null,
        );

        expect(result.isInstantWin).toBe(true);
        expect(result.playerScores[0].totalScore).toBe(78); // 39 × 2 losers
        expect(result.playerScores[0].breakdown.cardPoints).toBe(0);
        expect(result.playerScores[1].totalScore).toBe(-39);
        expect(result.playerScores[2].totalScore).toBe(-39);
      });

      it('should calculate complete score with cóng penalties', () => {
        const playerHands: Card[][] = [
          [],
          [createCard(RANK_A, SUIT_HEARTS)],
          [createCard(RANK_K, SUIT_SPADES)],
        ];

        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 1, totalCardValue: 10 },
          { playerIndex: 2, rank: 3, cardCount: 1, totalCardValue: 10 },
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 39,
          penaltyPerCongPlayer: 39,
          congPlayerPenalties: new Map([[1, 39]]), // Player 1 got cóng
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 39,
        };

        const chatPenaltyState = initializePenaltyTracking(3);

        const result = calculateGameScore(
          playerHands,
          0,
          rankings,
          false,
          congPenaltyResult,
          chatPenaltyState,
          null,
        );

        expect(result.playerScores[0].totalScore).toBe(41); // 2 (cards) + 39 (cóng)
        expect(result.playerScores[0].breakdown.congPenalties).toBe(39);
        expect(result.playerScores[1].totalScore).toBe(-40); // -1 (cards) - 39 (cóng)
        expect(result.playerScores[1].breakdown.congPenalties).toBe(-39);
      });

      it('should calculate complete score with chặt penalties', () => {
        const playerHands: Card[][] = [[], [createCard(RANK_A, SUIT_HEARTS)]];

        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 1, totalCardValue: 10 },
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 0,
          penaltyPerCongPlayer: 26,
          congPlayerPenalties: new Map(),
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 0,
        };

        let chatPenaltyState = initializePenaltyTracking(2);
        chatPenaltyState = {
          ...chatPenaltyState,
          playerPenalties: new Map([
            [0, { penaltiesPaid: 0, penaltiesReceived: 4 }], // Winner received 4
            [1, { penaltiesPaid: 4, penaltiesReceived: 0 }], // Loser paid 4
          ]),
        };

        const result = calculateGameScore(
          playerHands,
          0,
          rankings,
          false,
          congPenaltyResult,
          chatPenaltyState,
          null,
        );

        expect(result.playerScores[0].totalScore).toBe(5); // 1 (cards) + 4 (chặt)
        expect(result.playerScores[0].breakdown.chatPenalties).toBe(4);
        expect(result.playerScores[1].totalScore).toBe(-5); // -1 (cards) - 4 (chặt)
        expect(result.playerScores[1].breakdown.chatPenalties).toBe(-4);
      });

      it('should calculate complete score with thúi penalties', () => {
        const playerHands: Card[][] = [
          [],
          [createCard(RANK_A, SUIT_HEARTS)],
          [createCard(RANK_K, SUIT_SPADES), createCard(RANK_2, SUIT_SPADES)], // Has heo
        ];

        const rankings: PlayerRanking[] = [
          { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
          { playerIndex: 1, rank: 2, cardCount: 1, totalCardValue: 10 },
          { playerIndex: 2, rank: 3, cardCount: 2, totalCardValue: 20 }, // Về bét
        ];

        const congPenaltyResult: CongPenaltyResult = {
          totalCongPenalties: 0,
          penaltyPerCongPlayer: 39,
          congPlayerPenalties: new Map(),
          denBaiPenalty: 0,
          denBaiPlayerIndex: null,
          winnerReceives: 0,
        };

        const chatPenaltyState = initializePenaltyTracking(3);

        const thuiPenaltyResult: ThuiPenaltyResult = {
          hasThui: true,
          penaltyPoints: 1,
          breakdown: {
            heoPenalty: 1,
            hangPenalty: 0,
            heoCount: 1,
            hangCount: 0,
          },
          receiverIndex: 1, // 3rd place receives
        };

        const result = calculateGameScore(
          playerHands,
          0,
          rankings,
          false,
          congPenaltyResult,
          chatPenaltyState,
          thuiPenaltyResult,
        );

        expect(result.playerScores[0].totalScore).toBe(3); // 3 cards
        expect(result.playerScores[1].totalScore).toBe(0); // -1 (cards) + 1 (thúi received)
        expect(result.playerScores[1].breakdown.thuiPenalties).toBe(1);
        expect(result.playerScores[2].totalScore).toBe(-3); // -2 (cards) - 1 (thúi paid)
        expect(result.playerScores[2].breakdown.thuiPenalties).toBe(-1);
      });
    });
  });
});
