/**
 * Tests for Game End Detection & Winner Determination
 */

import {
  detectGameEnd,
  hasPlayerWonGame,
  countCardsRemaining,
  calculateTotalCardValue,
  rankPlayers,
  determineVeBet,
  hasPlayerPlayedAnyCards,
  detectCong,
  hasHangInHand,
  hasHeoInHand,
  detectDenBai,
  calculateDenBaiPenalty,
  type GameEndDetectionContext,
  type PlayerRanking,
} from './gameEndDetection';
import { createCard, createCardsOfRank } from './testHelpers';
import { ValidationException } from '../../common/exceptions';
import {
  Card,
  RANK_2,
  RANK_3,
  RANK_4,
  RANK_5,
  RANK_6,
  RANK_7,
  RANK_8,
  RANK_A,
  SUIT_CLUBS,
  SUIT_DIAMONDS,
  SUIT_HEARTS,
  SUIT_SPADES,
} from '../../types/game';

describe('Game End Detection', () => {
  describe('hasPlayerWonGame', () => {
    it('should return true when player has 0 cards', () => {
      const playerHands = [
        [],
        [createCard(RANK_3, SUIT_SPADES)],
        [createCard(RANK_4, SUIT_HEARTS)],
      ];
      expect(hasPlayerWonGame(playerHands, 0)).toBe(true);
    });

    it('should return false when player has cards remaining', () => {
      const playerHands = [
        [createCard(RANK_3, SUIT_SPADES)],
        [createCard(RANK_4, SUIT_HEARTS)],
        [createCard(RANK_5, SUIT_DIAMONDS)],
      ];
      expect(hasPlayerWonGame(playerHands, 0)).toBe(false);
    });

    it('should throw ValidationException when playerHands is empty', () => {
      expect(() => hasPlayerWonGame([], 0)).toThrow(ValidationException);
    });

    it('should throw ValidationException when playerIndex is out of range', () => {
      const playerHands = [[], [createCard(RANK_3, SUIT_SPADES)]];
      expect(() => hasPlayerWonGame(playerHands, -1)).toThrow(ValidationException);
      expect(() => hasPlayerWonGame(playerHands, 2)).toThrow(ValidationException);
    });
  });

  describe('detectGameEnd', () => {
    it('should detect game end when winner has 0 cards', () => {
      const context: GameEndDetectionContext = {
        playerHands: [[], [createCard(RANK_3, SUIT_SPADES)], [createCard(RANK_4, SUIT_HEARTS)]],
        winnerIndex: 0,
        isInstantWin: false,
        numPlayers: 3,
      };

      const result = detectGameEnd(context);
      expect(result.shouldEndGame).toBe(true);
      expect(result.winnerIndex).toBe(0);
      expect(result.isInstantWin).toBe(false);
    });

    it('should detect game end for instant win', () => {
      const context: GameEndDetectionContext = {
        playerHands: [
          [createCard(RANK_3, SUIT_SPADES)],
          [createCard(RANK_4, SUIT_HEARTS)],
          [createCard(RANK_5, SUIT_DIAMONDS)],
        ],
        winnerIndex: 0,
        isInstantWin: true,
        numPlayers: 3,
      };

      const result = detectGameEnd(context);
      expect(result.shouldEndGame).toBe(true);
      expect(result.winnerIndex).toBe(0);
      expect(result.isInstantWin).toBe(true);
    });

    it('should not detect game end when winner still has cards', () => {
      const context: GameEndDetectionContext = {
        playerHands: [
          [createCard(RANK_3, SUIT_SPADES)],
          [createCard(RANK_4, SUIT_HEARTS)],
          [createCard(RANK_5, SUIT_DIAMONDS)],
        ],
        winnerIndex: 0,
        isInstantWin: false,
        numPlayers: 3,
      };

      const result = detectGameEnd(context);
      expect(result.shouldEndGame).toBe(false);
      expect(result.winnerIndex).toBeNull();
      expect(result.isInstantWin).toBe(false);
    });

    it('should throw ValidationException for invalid inputs', () => {
      const context: GameEndDetectionContext = {
        playerHands: [[], [createCard(RANK_3, SUIT_SPADES)]],
        winnerIndex: 0,
        isInstantWin: false,
        numPlayers: 3, // Mismatch: 2 hands but 3 players
      };

      expect(() => detectGameEnd(context)).toThrow(ValidationException);
    });
  });

  describe('countCardsRemaining', () => {
    it('should count cards correctly for all players', () => {
      const playerHands = [
        [createCard(RANK_3, SUIT_SPADES)],
        [createCard(RANK_4, SUIT_HEARTS), createCard(RANK_5, SUIT_DIAMONDS)],
        [],
      ];
      const counts = countCardsRemaining(playerHands);
      expect(counts).toEqual([1, 2, 0]);
    });

    it('should return zeros for empty hands', () => {
      const playerHands = [[], [], []];
      const counts = countCardsRemaining(playerHands);
      expect(counts).toEqual([0, 0, 0]);
    });

    it('should throw ValidationException when playerHands is empty', () => {
      expect(() => countCardsRemaining([])).toThrow(ValidationException);
    });
  });

  describe('calculateTotalCardValue', () => {
    it('should calculate total card value correctly', () => {
      const hand = [
        createCard(RANK_3, SUIT_SPADES), // value: (0 * 4) + 0 = 0
        createCard(RANK_4, SUIT_HEARTS), // value: (1 * 4) + 3 = 7
        createCard(RANK_A, SUIT_DIAMONDS), // value: (11 * 4) + 2 = 46
      ];
      const total = calculateTotalCardValue(hand);
      expect(total).toBe(0 + 7 + 46); // 53
    });

    it('should return 0 for empty hand', () => {
      expect(calculateTotalCardValue([])).toBe(0);
    });

    it('should handle null/undefined gracefully', () => {
      expect(calculateTotalCardValue(null as any)).toBe(0);
      expect(calculateTotalCardValue(undefined as any)).toBe(0);
    });
  });

  describe('rankPlayers', () => {
    it('should rank players correctly by card count', () => {
      // Winner has 0 cards, others have different counts
      const playerHands = [
        [], // Winner (0 cards)
        [createCard(RANK_3, SUIT_SPADES)], // 2nd place (1 card)
        [createCard(RANK_4, SUIT_HEARTS), createCard(RANK_5, SUIT_DIAMONDS)], // 3rd place (2 cards)
        [
          createCard(RANK_6, SUIT_CLUBS),
          createCard(RANK_7, SUIT_SPADES),
          createCard(RANK_8, SUIT_HEARTS),
        ], // 4th place (3 cards)
      ];

      const rankings = rankPlayers(playerHands, 0);

      expect(rankings).toHaveLength(4);
      expect(rankings[0].playerIndex).toBe(0);
      expect(rankings[0].rank).toBe(1); // Winner
      expect(rankings[0].cardCount).toBe(0);

      expect(rankings[1].playerIndex).toBe(1);
      expect(rankings[1].rank).toBe(2); // 2nd place
      expect(rankings[1].cardCount).toBe(1);

      expect(rankings[2].playerIndex).toBe(2);
      expect(rankings[2].rank).toBe(3); // 3rd place
      expect(rankings[2].cardCount).toBe(2);

      expect(rankings[3].playerIndex).toBe(3);
      expect(rankings[3].rank).toBe(4); // 4th place (về bét)
      expect(rankings[3].cardCount).toBe(3);
    });

    it('should handle tie-breaking by card value', () => {
      // Two players with same card count, different values
      const card1 = createCard(RANK_3, SUIT_SPADES); // value: (0 * 4) + 0 = 0
      const card2 = createCard(RANK_A, SUIT_HEARTS); // value: (11 * 4) + 3 = 47

      const playerHands = [
        [], // Winner
        [card1], // 2nd place (lower value)
        [card2], // 3rd place (higher value)
      ];

      const rankings = rankPlayers(playerHands, 0);

      expect(rankings[1].playerIndex).toBe(1);
      expect(rankings[1].rank).toBe(2);
      expect(rankings[1].totalCardValue).toBe(0);

      expect(rankings[2].playerIndex).toBe(2);
      expect(rankings[2].rank).toBe(3);
      expect(rankings[2].totalCardValue).toBe(47);
    });

    it('should handle 2-player game', () => {
      const playerHands = [
        [], // Winner
        [createCard(RANK_3, SUIT_SPADES), createCard(RANK_4, SUIT_HEARTS)], // 2nd place
      ];

      const rankings = rankPlayers(playerHands, 0);

      expect(rankings).toHaveLength(2);
      expect(rankings[0].rank).toBe(1);
      expect(rankings[1].rank).toBe(2);
    });

    it('should throw ValidationException for invalid inputs', () => {
      const playerHands = [[], [createCard(RANK_3, SUIT_SPADES)]];
      expect(() => rankPlayers(playerHands, -1)).toThrow(ValidationException);
      expect(() => rankPlayers(playerHands, 2)).toThrow(ValidationException);
      expect(() => rankPlayers([], 0)).toThrow(ValidationException);
    });
  });

  describe('determineVeBet', () => {
    it('should determine về bét correctly', () => {
      const rankings: PlayerRanking[] = [
        { playerIndex: 0, rank: 1, cardCount: 0, totalCardValue: 0 },
        { playerIndex: 1, rank: 2, cardCount: 1, totalCardValue: 0 },
        { playerIndex: 2, rank: 3, cardCount: 2, totalCardValue: 1 },
        { playerIndex: 3, rank: 4, cardCount: 5, totalCardValue: 10 },
      ];

      const veBet = determineVeBet(rankings);
      expect(veBet).toBe(3); // Player 3 has rank 4 (về bét)
    });

    it('should throw ValidationException for empty rankings', () => {
      expect(() => determineVeBet([])).toThrow(ValidationException);
    });
  });

  describe('hasPlayerPlayedAnyCards', () => {
    it('should return true if player has played cards', () => {
      const playHistory = [
        { playerIndex: 0, cards: [createCard(RANK_3, SUIT_SPADES)] },
        { playerIndex: 1, cards: [createCard(RANK_4, SUIT_HEARTS)] },
      ];

      expect(hasPlayerPlayedAnyCards(0, playHistory)).toBe(true);
      expect(hasPlayerPlayedAnyCards(1, playHistory)).toBe(true);
    });

    it('should return false if player has not played', () => {
      const playHistory = [
        { playerIndex: 0, cards: [createCard(RANK_3, SUIT_SPADES)] },
        { playerIndex: 1, cards: [createCard(RANK_4, SUIT_HEARTS)] },
      ];

      expect(hasPlayerPlayedAnyCards(2, playHistory)).toBe(false);
    });

    it('should return false for empty play history', () => {
      expect(hasPlayerPlayedAnyCards(0, [])).toBe(false);
    });

    it('should return false for null/undefined play history', () => {
      expect(hasPlayerPlayedAnyCards(0, null as any)).toBe(false);
      expect(hasPlayerPlayedAnyCards(0, undefined as any)).toBe(false);
    });
  });

  describe('detectCong', () => {
    it('should detect cóng 1 nhà (1 player stuck)', () => {
      const playerHands = [
        [], // Winner
        [createCard(RANK_3, SUIT_SPADES)], // Player 1 played
        [createCard(RANK_4, SUIT_HEARTS)], // Player 2 cóng (didn't play)
        [createCard(RANK_5, SUIT_DIAMONDS)], // Player 3 played
      ];

      const playHistory = [
        { playerIndex: 1, cards: [createCard(RANK_3, SUIT_SPADES)] },
        { playerIndex: 3, cards: [createCard(RANK_5, SUIT_DIAMONDS)] },
      ];

      const result = detectCong(playerHands, 0, playHistory, false);

      expect(result.congCount).toBe(1);
      expect(result.isCong1Nha).toBe(true);
      expect(result.isCong2Nha).toBe(false);
      expect(result.isCong3Nha).toBe(false);
      expect(result.congPlayers).toEqual([2]);
    });

    it('should detect cóng 2 nhà (2 players stuck)', () => {
      const playerHands = [
        [], // Winner
        [createCard(RANK_3, SUIT_SPADES)], // Player 1 played
        [createCard(RANK_4, SUIT_HEARTS)], // Player 2 cóng
        [createCard(RANK_5, SUIT_DIAMONDS)], // Player 3 cóng
      ];

      const playHistory = [{ playerIndex: 1, cards: [createCard(RANK_3, SUIT_SPADES)] }];

      const result = detectCong(playerHands, 0, playHistory, false);

      expect(result.congCount).toBe(2);
      expect(result.isCong1Nha).toBe(false);
      expect(result.isCong2Nha).toBe(true);
      expect(result.isCong3Nha).toBe(false);
      expect(result.congPlayers).toContain(2);
      expect(result.congPlayers).toContain(3);
      expect(result.congPlayers).toHaveLength(2);
    });

    it('should detect cóng 3 nhà (3 players stuck)', () => {
      const playerHands = [
        [], // Winner
        [createCard(RANK_3, SUIT_SPADES)], // Player 1 cóng
        [createCard(RANK_4, SUIT_HEARTS)], // Player 2 cóng
        [createCard(RANK_5, SUIT_DIAMONDS)], // Player 3 cóng
      ];

      const playHistory: Array<{ playerIndex: number; cards: Card[] }> = [];

      const result = detectCong(playerHands, 0, playHistory, false);

      expect(result.congCount).toBe(3);
      expect(result.isCong1Nha).toBe(false);
      expect(result.isCong2Nha).toBe(false);
      expect(result.isCong3Nha).toBe(true);
      expect(result.congPlayers).toHaveLength(3);
      expect(result.congPlayers).not.toContain(0); // Winner not cóng
    });

    it('should return no cóng for instant win', () => {
      const playerHands = [
        [createCard(RANK_3, SUIT_SPADES)], // Winner (instant win)
        [createCard(RANK_4, SUIT_HEARTS)],
        [createCard(RANK_5, SUIT_DIAMONDS)],
        [createCard(RANK_6, SUIT_CLUBS)],
      ];

      const playHistory: Array<{ playerIndex: number; cards: Card[] }> = [];

      const result = detectCong(playerHands, 0, playHistory, true);

      expect(result.congCount).toBe(0);
      expect(result.isCong1Nha).toBe(false);
      expect(result.isCong2Nha).toBe(false);
      expect(result.isCong3Nha).toBe(false);
      expect(result.congPlayers).toEqual([]);
    });

    it('should throw ValidationException for invalid inputs', () => {
      const playerHands = [[], [createCard(RANK_3, SUIT_SPADES)]];
      const playHistory: Array<{ playerIndex: number; cards: Card[] }> = [];

      expect(() => detectCong(playerHands, -1, playHistory, false)).toThrow(ValidationException);
      expect(() => detectCong(playerHands, 2, playHistory, false)).toThrow(ValidationException);
      expect(() => detectCong([], 0, playHistory, false)).toThrow(ValidationException);
    });
  });

  describe('hasHangInHand', () => {
    it('should detect 3 đôi thông in hand', () => {
      // Create 3 consecutive pairs: 3-3, 4-4, 5-5
      const hand = [
        ...createCardsOfRank(RANK_3, [SUIT_SPADES, SUIT_HEARTS]),
        ...createCardsOfRank(RANK_4, [SUIT_DIAMONDS, SUIT_CLUBS]),
        ...createCardsOfRank(RANK_5, [SUIT_SPADES, SUIT_HEARTS]),
        createCard(RANK_6, SUIT_DIAMONDS),
      ];

      expect(hasHangInHand(hand)).toBe(true);
    });

    it('should detect tứ quý in hand', () => {
      // Create four of a kind: 3-3-3-3
      const hand = createCardsOfRank(RANK_3, [SUIT_SPADES, SUIT_HEARTS, SUIT_DIAMONDS, SUIT_CLUBS]);

      expect(hasHangInHand(hand)).toBe(true);
    });

    it('should detect 4 đôi thông in hand', () => {
      // Create 4 consecutive pairs: 3-3, 4-4, 5-5, 6-6
      const hand = [
        ...createCardsOfRank(RANK_3, [SUIT_SPADES, SUIT_HEARTS]),
        ...createCardsOfRank(RANK_4, [SUIT_DIAMONDS, SUIT_CLUBS]),
        ...createCardsOfRank(RANK_5, [SUIT_SPADES, SUIT_HEARTS]),
        ...createCardsOfRank(RANK_6, [SUIT_DIAMONDS, SUIT_CLUBS]),
      ];

      expect(hasHangInHand(hand)).toBe(true);
    });

    it('should return false when no hàng in hand', () => {
      const hand = [
        createCard(RANK_3, SUIT_SPADES),
        createCard(RANK_4, SUIT_HEARTS),
        createCard(RANK_5, SUIT_DIAMONDS),
      ];

      expect(hasHangInHand(hand)).toBe(false);
    });

    it('should return false for empty hand', () => {
      expect(hasHangInHand([])).toBe(false);
    });
  });

  describe('hasHeoInHand', () => {
    it('should return true when hand contains heo', () => {
      const hand = [createCard(RANK_2, SUIT_SPADES), createCard(RANK_3, SUIT_HEARTS)];
      expect(hasHeoInHand(hand)).toBe(true);
    });

    it('should return false when hand does not contain heo', () => {
      const hand = [createCard(RANK_3, SUIT_SPADES), createCard(RANK_4, SUIT_HEARTS)];
      expect(hasHeoInHand(hand)).toBe(false);
    });

    it('should return false for empty hand', () => {
      expect(hasHeoInHand([])).toBe(false);
    });
  });

  describe('detectDenBai', () => {
    it('should return no đền bài when not cóng 3 nhà', () => {
      const playerHands = [
        [],
        [createCard(RANK_3, SUIT_SPADES)],
        [createCard(RANK_4, SUIT_HEARTS)],
        [createCard(RANK_5, SUIT_DIAMONDS)],
      ];

      const congResult = {
        congPlayers: [2],
        congCount: 1,
        isCong1Nha: true,
        isCong2Nha: false,
        isCong3Nha: false,
      };

      const playHistory: Array<{ playerIndex: number; cards: Card[] }> = [];

      const result = detectDenBai(playerHands, 0, congResult, playHistory);

      expect(result.hasDenBai).toBe(false);
      expect(result.denBaiPlayers).toEqual([]);
    });

    it('should return empty đền bài for cóng 3 nhà (placeholder implementation)', () => {
      const playerHands = [
        [],
        [createCard(RANK_3, SUIT_SPADES)],
        [createCard(RANK_4, SUIT_HEARTS)],
        [createCard(RANK_5, SUIT_DIAMONDS)],
      ];

      const congResult = {
        congPlayers: [1, 2, 3],
        congCount: 3,
        isCong1Nha: false,
        isCong2Nha: false,
        isCong3Nha: true,
      };

      const playHistory: Array<{ playerIndex: number; cards: Card[] }> = [];

      const result = detectDenBai(playerHands, 0, congResult, playHistory);

      // Currently returns empty (placeholder implementation)
      expect(result.hasDenBai).toBe(false);
      expect(result.denBaiPlayers).toEqual([]);
    });

    it('should throw ValidationException for invalid inputs', () => {
      const playerHands = [[], [createCard(RANK_3, SUIT_SPADES)]];
      const congResult = {
        congPlayers: [],
        congCount: 0,
        isCong1Nha: false,
        isCong2Nha: false,
        isCong3Nha: false,
      };
      const playHistory: Array<{ playerIndex: number; cards: Card[] }> = [];

      expect(() => detectDenBai(playerHands, -1, congResult, playHistory)).toThrow(
        ValidationException,
      );
      expect(() => detectDenBai(playerHands, 2, congResult, playHistory)).toThrow(
        ValidationException,
      );
    });
  });

  describe('calculateDenBaiPenalty', () => {
    it('should calculate đền bài penalty for cóng 1 nhà', () => {
      // Tới trắng penalty: 13 × 4 = 52 points per player
      // Đền bài for 1 cóng: 52 × 1 = 52 points
      const penalty = calculateDenBaiPenalty(1, 4);
      expect(penalty).toBe(52);
    });

    it('should calculate đền bài penalty for cóng 2 nhà', () => {
      // Tới trắng penalty: 13 × 4 = 52 points per player
      // Đền bài for 2 cóng: 52 × 2 = 104 points
      const penalty = calculateDenBaiPenalty(2, 4);
      expect(penalty).toBe(104);
    });

    it('should calculate đền bài penalty for cóng 3 nhà', () => {
      // Tới trắng penalty: 13 × 4 = 52 points per player
      // Đền bài for 3 cóng: 52 × 3 = 156 points
      const penalty = calculateDenBaiPenalty(3, 4);
      expect(penalty).toBe(156);
    });

    it('should calculate đền bài penalty for 3-player game', () => {
      // Tới trắng penalty: 13 × 3 = 39 points per player
      // Đền bài for 2 cóng: 39 × 2 = 78 points
      const penalty = calculateDenBaiPenalty(2, 3);
      expect(penalty).toBe(78);
    });

    it('should throw ValidationException for invalid cóng count', () => {
      expect(() => calculateDenBaiPenalty(0, 4)).toThrow(ValidationException);
      expect(() => calculateDenBaiPenalty(4, 4)).toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid player count', () => {
      expect(() => calculateDenBaiPenalty(1, 1)).toThrow(ValidationException);
      expect(() => calculateDenBaiPenalty(1, 5)).toThrow(ValidationException);
    });
  });
});
