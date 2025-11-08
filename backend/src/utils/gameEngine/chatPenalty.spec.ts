import {
  getHeoPenaltyValue,
  calculateSingleHeoPenalty,
  calculateMultipleHeoPenalty,
  calculateDoiHeoPenalty,
  calculateHangPenalty,
  calculateChatPenalty,
  initializePenaltyTracking,
  recordPenaltyPayment,
  recordPenaltyReceipt,
  recordCuttingWithTransfer,
  getPlayerPenaltiesPaid,
  getPlayerPenaltiesReceived,
  getPlayerNetPenaltyScore,
} from './chatPenalty';
import { RANK_2, SUIT_SPADES, SUIT_CLUBS, SUIT_DIAMONDS, SUIT_HEARTS } from '../../types/game';
import { CardCombination } from './combinations';
import { initializeSingleHeoTracking, recordPlay } from './singleHeoTracking';
import { detectSingle, detectPair, detectConsecutivePairs, detectFourOfKind } from './combinations';
import { createCard } from './testHelpers';
import { ValidationException } from '../../common/exceptions';

describe('Chặt Penalty Calculation', () => {
  describe('getHeoPenaltyValue', () => {
    describe('Subtask 2.8.1.1: Calculate penalty for cutting 1 heo (1-2 points)', () => {
      it('should return 1 point for Spades 2', () => {
        expect(getHeoPenaltyValue(SUIT_SPADES)).toBe(1);
      });

      it('should return 1 point for Clubs 2', () => {
        expect(getHeoPenaltyValue(SUIT_CLUBS)).toBe(1);
      });

      it('should return 2 points for Diamonds 2', () => {
        expect(getHeoPenaltyValue(SUIT_DIAMONDS)).toBe(2);
      });

      it('should return 2 points for Hearts 2', () => {
        expect(getHeoPenaltyValue(SUIT_HEARTS)).toBe(2);
      });

      it('should throw ValidationException for invalid suit', () => {
        expect(() => getHeoPenaltyValue('Invalid')).toThrow(ValidationException);
        expect(() => getHeoPenaltyValue('')).toThrow(ValidationException);
      });
    });
  });

  describe('calculateSingleHeoPenalty', () => {
    describe('Subtask 2.8.1.1: Calculate penalty for cutting 1 heo (1-2 points)', () => {
      it('should return 1 point for cutting Spades 2', () => {
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        expect(calculateSingleHeoPenalty(spades2)).toBe(1);
      });

      it('should return 1 point for cutting Clubs 2', () => {
        const clubs2 = createCard(RANK_2, SUIT_CLUBS);
        expect(calculateSingleHeoPenalty(clubs2)).toBe(1);
      });

      it('should return 2 points for cutting Diamonds 2', () => {
        const diamonds2 = createCard(RANK_2, SUIT_DIAMONDS);
        expect(calculateSingleHeoPenalty(diamonds2)).toBe(2);
      });

      it('should return 2 points for cutting Hearts 2', () => {
        const hearts2 = createCard(RANK_2, SUIT_HEARTS);
        expect(calculateSingleHeoPenalty(hearts2)).toBe(2);
      });

      it('should throw ValidationException for non-heo card', () => {
        const ace = createCard('A', SUIT_HEARTS);
        expect(() => calculateSingleHeoPenalty(ace)).toThrow(ValidationException);
      });
    });
  });

  describe('calculateMultipleHeoPenalty', () => {
    describe('Subtask 2.8.1.2: Calculate penalty for cutting 2-4 heo (sum of values)', () => {
      it('should return 0 for empty tracking state', () => {
        const tracking = initializeSingleHeoTracking(4);
        expect(calculateMultipleHeoPenalty(tracking)).toBe(0);
      });

      it('should calculate penalty for cutting 1 heo', () => {
        let tracking = initializeSingleHeoTracking(4);
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const singleHeo = detectSingle([spades2])!;
        tracking = recordPlay(tracking, singleHeo);
        expect(calculateMultipleHeoPenalty(tracking)).toBe(1);
      });

      it('should calculate penalty for cutting 2 heos (sum of values)', () => {
        let tracking = initializeSingleHeoTracking(4);
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const clubs2 = createCard(RANK_2, SUIT_CLUBS);
        tracking = recordPlay(tracking, detectSingle([spades2])!);
        tracking = recordPlay(tracking, detectSingle([clubs2])!);
        expect(calculateMultipleHeoPenalty(tracking)).toBe(2); // 1 + 1
      });

      it('should calculate penalty for cutting 3 heos (sum of values)', () => {
        let tracking = initializeSingleHeoTracking(4);
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const clubs2 = createCard(RANK_2, SUIT_CLUBS);
        const diamonds2 = createCard(RANK_2, SUIT_DIAMONDS);
        tracking = recordPlay(tracking, detectSingle([spades2])!);
        tracking = recordPlay(tracking, detectSingle([clubs2])!);
        tracking = recordPlay(tracking, detectSingle([diamonds2])!);
        expect(calculateMultipleHeoPenalty(tracking)).toBe(4); // 1 + 1 + 2
      });

      it('should calculate penalty for cutting 4 heos (sum of values)', () => {
        let tracking = initializeSingleHeoTracking(4);
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const clubs2 = createCard(RANK_2, SUIT_CLUBS);
        const diamonds2 = createCard(RANK_2, SUIT_DIAMONDS);
        const hearts2 = createCard(RANK_2, SUIT_HEARTS);
        tracking = recordPlay(tracking, detectSingle([spades2])!);
        tracking = recordPlay(tracking, detectSingle([clubs2])!);
        tracking = recordPlay(tracking, detectSingle([diamonds2])!);
        tracking = recordPlay(tracking, detectSingle([hearts2])!);
        expect(calculateMultipleHeoPenalty(tracking)).toBe(6); // 1 + 1 + 2 + 2
      });

      it('should calculate penalty with mixed heo values', () => {
        let tracking = initializeSingleHeoTracking(4);
        const spades2 = createCard(RANK_2, SUIT_SPADES); // 1 point
        const hearts2 = createCard(RANK_2, SUIT_HEARTS); // 2 points
        const diamonds2 = createCard(RANK_2, SUIT_DIAMONDS); // 2 points
        tracking = recordPlay(tracking, detectSingle([spades2])!);
        tracking = recordPlay(tracking, detectSingle([hearts2])!);
        tracking = recordPlay(tracking, detectSingle([diamonds2])!);
        expect(calculateMultipleHeoPenalty(tracking)).toBe(5); // 1 + 2 + 2
      });

      it('should throw ValidationException for more than 4 heos', () => {
        let tracking = initializeSingleHeoTracking(4);
        // Manually create invalid state with 5 heos
        const heos = [
          createCard(RANK_2, SUIT_SPADES),
          createCard(RANK_2, SUIT_CLUBS),
          createCard(RANK_2, SUIT_DIAMONDS),
          createCard(RANK_2, SUIT_HEARTS),
          createCard(RANK_2, SUIT_SPADES),
        ];
        tracking = {
          ...tracking,
          consecutiveSingleHeos: heos,
        };
        expect(() => calculateMultipleHeoPenalty(tracking)).toThrow(ValidationException);
      });
    });
  });

  describe('calculateDoiHeoPenalty', () => {
    describe('Subtask 2.8.1.3: Calculate penalty for cutting đôi heo (2 × heo value)', () => {
      it('should calculate penalty for đôi heo with two low-value heos', () => {
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const clubs2 = createCard(RANK_2, SUIT_CLUBS);
        const doiHeo = detectPair([spades2, clubs2])!;
        expect(calculateDoiHeoPenalty(doiHeo)).toBe(2); // 1 + 1
      });

      it('should calculate penalty for đôi heo with two high-value heos', () => {
        const diamonds2 = createCard(RANK_2, SUIT_DIAMONDS);
        const hearts2 = createCard(RANK_2, SUIT_HEARTS);
        const doiHeo = detectPair([diamonds2, hearts2])!;
        expect(calculateDoiHeoPenalty(doiHeo)).toBe(4); // 2 + 2
      });

      it('should calculate penalty for đôi heo with mixed values', () => {
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const hearts2 = createCard(RANK_2, SUIT_HEARTS);
        const doiHeo = detectPair([spades2, hearts2])!;
        expect(calculateDoiHeoPenalty(doiHeo)).toBe(3); // 1 + 2
      });

      it('should throw ValidationException for non-đôi heo combination', () => {
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const singleHeo = detectSingle([spades2])!;
        expect(() => calculateDoiHeoPenalty(singleHeo)).toThrow(ValidationException);
      });

      it('should throw ValidationException for pair that is not đôi heo', () => {
        const ace1 = createCard('A', SUIT_HEARTS);
        const ace2 = createCard('A', SUIT_SPADES);
        const pair = detectPair([ace1, ace2])!;
        expect(() => calculateDoiHeoPenalty(pair)).toThrow(ValidationException);
      });

      it('should throw ValidationException for invalid card count', () => {
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const clubs2 = createCard(RANK_2, SUIT_CLUBS);
        const diamonds2 = createCard(RANK_2, SUIT_DIAMONDS);
        const invalidDoiHeo: CardCombination = {
          type: 'pair',
          cards: [spades2, clubs2, diamonds2],
        };
        expect(() => calculateDoiHeoPenalty(invalidDoiHeo)).toThrow(ValidationException);
      });
    });
  });

  describe('calculateHangPenalty', () => {
    describe('Subtask 2.8.1.4: Calculate penalty for cutting hàng (4 points)', () => {
      it('should return 4 points for cutting 3 đôi thông', () => {
        const cards = [
          createCard('3', SUIT_SPADES),
          createCard('3', SUIT_CLUBS),
          createCard('4', SUIT_SPADES),
          createCard('4', SUIT_CLUBS),
          createCard('5', SUIT_SPADES),
          createCard('5', SUIT_CLUBS),
        ];
        const consecutivePairs = detectConsecutivePairs(cards)!;
        expect(calculateHangPenalty(consecutivePairs)).toBe(4);
      });

      it('should return 4 points for cutting 4 đôi thông', () => {
        const cards = [
          createCard('3', SUIT_SPADES),
          createCard('3', SUIT_CLUBS),
          createCard('4', SUIT_SPADES),
          createCard('4', SUIT_CLUBS),
          createCard('5', SUIT_SPADES),
          createCard('5', SUIT_CLUBS),
          createCard('6', SUIT_SPADES),
          createCard('6', SUIT_CLUBS),
        ];
        const consecutivePairs = detectConsecutivePairs(cards)!;
        expect(calculateHangPenalty(consecutivePairs)).toBe(4);
      });

      it('should return 4 points for cutting tứ quý', () => {
        const cards = [
          createCard('A', SUIT_SPADES),
          createCard('A', SUIT_CLUBS),
          createCard('A', SUIT_DIAMONDS),
          createCard('A', SUIT_HEARTS),
        ];
        const fourOfKind = detectFourOfKind(cards)!;
        expect(calculateHangPenalty(fourOfKind)).toBe(4);
      });

      it('should throw ValidationException for 2 đôi thông (not hàng)', () => {
        // 2 đôi thông is not detected as consecutive_pairs (requires 3+ pairs)
        // So we create a mock combination to test the validation
        const cards = [
          createCard('3', SUIT_SPADES),
          createCard('3', SUIT_CLUBS),
          createCard('4', SUIT_SPADES),
          createCard('4', SUIT_CLUBS),
        ];
        const invalidHang: CardCombination = {
          type: 'consecutive_pairs',
          cards,
        };
        expect(() => calculateHangPenalty(invalidHang)).toThrow(ValidationException);
      });

      it('should throw ValidationException for non-hàng combination', () => {
        const spades2 = createCard(RANK_2, SUIT_SPADES);
        const singleHeo = detectSingle([spades2])!;
        expect(() => calculateHangPenalty(singleHeo)).toThrow(ValidationException);
      });

      it('should throw ValidationException for pair', () => {
        const ace1 = createCard('A', SUIT_HEARTS);
        const ace2 = createCard('A', SUIT_SPADES);
        const pair = detectPair([ace1, ace2])!;
        expect(() => calculateHangPenalty(pair)).toThrow(ValidationException);
      });
    });
  });

  describe('calculateChatPenalty', () => {
    it('should calculate penalty for cutting single heos', () => {
      let tracking = initializeSingleHeoTracking(4);
      const spades2 = createCard(RANK_2, SUIT_SPADES);
      const clubs2 = createCard(RANK_2, SUIT_CLUBS);
      tracking = recordPlay(tracking, detectSingle([spades2])!);
      tracking = recordPlay(tracking, detectSingle([clubs2])!);

      const cuttingCombo = detectFourOfKind([
        createCard('A', SUIT_SPADES),
        createCard('A', SUIT_CLUBS),
        createCard('A', SUIT_DIAMONDS),
        createCard('A', SUIT_HEARTS),
      ])!;
      const targetCombo = detectSingle([clubs2])!;

      expect(calculateChatPenalty(cuttingCombo, targetCombo, tracking)).toBe(2);
    });

    it('should calculate penalty for cutting đôi heo', () => {
      const tracking = initializeSingleHeoTracking(4);
      const spades2 = createCard(RANK_2, SUIT_SPADES);
      const clubs2 = createCard(RANK_2, SUIT_CLUBS);
      const doiHeo = detectPair([spades2, clubs2])!;

      const cuttingCombo = detectFourOfKind([
        createCard('A', SUIT_SPADES),
        createCard('A', SUIT_CLUBS),
        createCard('A', SUIT_DIAMONDS),
        createCard('A', SUIT_HEARTS),
      ])!;

      expect(calculateChatPenalty(cuttingCombo, doiHeo, tracking)).toBe(2);
    });

    it('should calculate penalty for cutting hàng', () => {
      const tracking = initializeSingleHeoTracking(4);
      const cards = [
        createCard('3', SUIT_SPADES),
        createCard('3', SUIT_CLUBS),
        createCard('4', SUIT_SPADES),
        createCard('4', SUIT_CLUBS),
        createCard('5', SUIT_SPADES),
        createCard('5', SUIT_CLUBS),
      ];
      const consecutivePairs = detectConsecutivePairs(cards)!;

      const cuttingCombo = detectFourOfKind([
        createCard('A', SUIT_SPADES),
        createCard('A', SUIT_CLUBS),
        createCard('A', SUIT_DIAMONDS),
        createCard('A', SUIT_HEARTS),
      ])!;

      expect(calculateChatPenalty(cuttingCombo, consecutivePairs, tracking)).toBe(4);
    });

    it('should throw ValidationException for invalid target combination', () => {
      const tracking = initializeSingleHeoTracking(4);
      const ace = createCard('A', SUIT_HEARTS);
      const single = detectSingle([ace])!;

      const cuttingCombo = detectFourOfKind([
        createCard('A', SUIT_SPADES),
        createCard('A', SUIT_CLUBS),
        createCard('A', SUIT_DIAMONDS),
        createCard('A', SUIT_HEARTS),
      ])!;

      expect(() => calculateChatPenalty(cuttingCombo, single, tracking)).toThrow(
        ValidationException,
      );
    });
  });

  describe('initializePenaltyTracking', () => {
    describe('Subtask 2.8.1.5: Track penalties per player during game', () => {
      it('should initialize penalty tracking for 2 players', () => {
        const state = initializePenaltyTracking(2);
        expect(state.numPlayers).toBe(2);
        expect(state.playerPenalties.size).toBe(2);
        expect(state.playerPenalties.get(0)?.penaltiesPaid).toBe(0);
        expect(state.playerPenalties.get(0)?.penaltiesReceived).toBe(0);
        expect(state.playerPenalties.get(1)?.penaltiesPaid).toBe(0);
        expect(state.playerPenalties.get(1)?.penaltiesReceived).toBe(0);
      });

      it('should initialize penalty tracking for 4 players', () => {
        const state = initializePenaltyTracking(4);
        expect(state.numPlayers).toBe(4);
        expect(state.playerPenalties.size).toBe(4);
        for (let i = 0; i < 4; i++) {
          expect(state.playerPenalties.get(i)?.penaltiesPaid).toBe(0);
          expect(state.playerPenalties.get(i)?.penaltiesReceived).toBe(0);
        }
      });

      it('should throw ValidationException for invalid number of players', () => {
        expect(() => initializePenaltyTracking(1)).toThrow(ValidationException);
        expect(() => initializePenaltyTracking(5)).toThrow(ValidationException);
        expect(() => initializePenaltyTracking(0)).toThrow(ValidationException);
      });
    });
  });

  describe('recordPenaltyPayment', () => {
    describe('Subtask 2.8.1.5: Track penalties per player during game', () => {
      it('should record penalty payment for a player', () => {
        let state = initializePenaltyTracking(4);
        state = recordPenaltyPayment(state, 1, 4);
        expect(getPlayerPenaltiesPaid(state, 1)).toBe(4);
        expect(getPlayerPenaltiesReceived(state, 1)).toBe(0);
      });

      it('should accumulate multiple penalty payments', () => {
        let state = initializePenaltyTracking(4);
        state = recordPenaltyPayment(state, 1, 4);
        state = recordPenaltyPayment(state, 1, 2);
        expect(getPlayerPenaltiesPaid(state, 1)).toBe(6);
      });

      it('should track penalties for different players independently', () => {
        let state = initializePenaltyTracking(4);
        state = recordPenaltyPayment(state, 0, 4);
        state = recordPenaltyPayment(state, 1, 2);
        state = recordPenaltyPayment(state, 2, 6);
        expect(getPlayerPenaltiesPaid(state, 0)).toBe(4);
        expect(getPlayerPenaltiesPaid(state, 1)).toBe(2);
        expect(getPlayerPenaltiesPaid(state, 2)).toBe(6);
        expect(getPlayerPenaltiesPaid(state, 3)).toBe(0);
      });

      it('should throw ValidationException for invalid player index', () => {
        const state = initializePenaltyTracking(4);
        expect(() => recordPenaltyPayment(state, -1, 4)).toThrow(ValidationException);
        expect(() => recordPenaltyPayment(state, 4, 4)).toThrow(ValidationException);
      });

      it('should throw ValidationException for negative penalty points', () => {
        const state = initializePenaltyTracking(4);
        expect(() => recordPenaltyPayment(state, 1, -1)).toThrow(ValidationException);
      });
    });
  });

  describe('recordPenaltyReceipt', () => {
    describe('Subtask 2.8.1.5: Track penalties per player during game', () => {
      it('should record penalty receipt for a player', () => {
        let state = initializePenaltyTracking(4);
        state = recordPenaltyReceipt(state, 2, 4);
        expect(getPlayerPenaltiesReceived(state, 2)).toBe(4);
        expect(getPlayerPenaltiesPaid(state, 2)).toBe(0);
      });

      it('should accumulate multiple penalty receipts', () => {
        let state = initializePenaltyTracking(4);
        state = recordPenaltyReceipt(state, 2, 4);
        state = recordPenaltyReceipt(state, 2, 2);
        expect(getPlayerPenaltiesReceived(state, 2)).toBe(6);
      });

      it('should track receipts for different players independently', () => {
        let state = initializePenaltyTracking(4);
        state = recordPenaltyReceipt(state, 0, 4);
        state = recordPenaltyReceipt(state, 1, 2);
        state = recordPenaltyReceipt(state, 2, 6);
        expect(getPlayerPenaltiesReceived(state, 0)).toBe(4);
        expect(getPlayerPenaltiesReceived(state, 1)).toBe(2);
        expect(getPlayerPenaltiesReceived(state, 2)).toBe(6);
        expect(getPlayerPenaltiesReceived(state, 3)).toBe(0);
      });

      it('should throw ValidationException for invalid player index', () => {
        const state = initializePenaltyTracking(4);
        expect(() => recordPenaltyReceipt(state, -1, 4)).toThrow(ValidationException);
        expect(() => recordPenaltyReceipt(state, 4, 4)).toThrow(ValidationException);
      });

      it('should throw ValidationException for negative penalty points', () => {
        const state = initializePenaltyTracking(4);
        expect(() => recordPenaltyReceipt(state, 1, -1)).toThrow(ValidationException);
      });
    });
  });

  describe('recordCuttingWithTransfer', () => {
    describe('Subtask 2.8.1.6: Handle penalty transfer (chặt chồng)', () => {
      it('should record cutting action with penalty payment and receipt', () => {
        let state = initializePenaltyTracking(4);
        state = recordCuttingWithTransfer(state, 1, 2, 4, 0);
        expect(getPlayerPenaltiesPaid(state, 1)).toBe(4);
        expect(getPlayerPenaltiesReceived(state, 2)).toBe(4);
      });

      it('should handle penalty transfer from previous cuts', () => {
        let state = initializePenaltyTracking(4);
        // Player 2 cuts Player 1 (penalty 4), then Player 3 cuts Player 2 (penalty 6)
        // Player 2 pays 4 + 6 = 10 total (their own penalty + transferred)
        state = recordCuttingWithTransfer(state, 2, 3, 6, 4);
        expect(getPlayerPenaltiesPaid(state, 2)).toBe(10); // 6 + 4
        expect(getPlayerPenaltiesReceived(state, 3)).toBe(10); // receives total
      });

      it('should handle multiple transfers in chain', () => {
        let state = initializePenaltyTracking(4);
        // Complex chain: A cuts B (4), C cuts A (6), D cuts C (8)
        // C pays: 6 (from D) + 4 (from A) = 10
        state = recordCuttingWithTransfer(state, 2, 3, 8, 6);
        expect(getPlayerPenaltiesPaid(state, 2)).toBe(14); // 8 + 6
        expect(getPlayerPenaltiesReceived(state, 3)).toBe(14);
      });

      it('should throw ValidationException for invalid player indices', () => {
        const state = initializePenaltyTracking(4);
        expect(() => recordCuttingWithTransfer(state, -1, 2, 4, 0)).toThrow(ValidationException);
        expect(() => recordCuttingWithTransfer(state, 1, 5, 4, 0)).toThrow(ValidationException);
      });

      it('should throw ValidationException if player cuts themselves', () => {
        const state = initializePenaltyTracking(4);
        expect(() => recordCuttingWithTransfer(state, 1, 1, 4, 0)).toThrow(ValidationException);
      });

      it('should throw ValidationException for negative penalty points', () => {
        const state = initializePenaltyTracking(4);
        expect(() => recordCuttingWithTransfer(state, 1, 2, -1, 0)).toThrow(ValidationException);
        expect(() => recordCuttingWithTransfer(state, 1, 2, 4, -1)).toThrow(ValidationException);
      });
    });
  });

  describe('getPlayerPenaltiesPaid', () => {
    it('should return penalties paid by player', () => {
      let state = initializePenaltyTracking(4);
      state = recordPenaltyPayment(state, 1, 4);
      expect(getPlayerPenaltiesPaid(state, 1)).toBe(4);
    });

    it('should throw ValidationException for invalid player index', () => {
      const state = initializePenaltyTracking(4);
      expect(() => getPlayerPenaltiesPaid(state, -1)).toThrow(ValidationException);
      expect(() => getPlayerPenaltiesPaid(state, 4)).toThrow(ValidationException);
    });
  });

  describe('getPlayerPenaltiesReceived', () => {
    it('should return penalties received by player', () => {
      let state = initializePenaltyTracking(4);
      state = recordPenaltyReceipt(state, 2, 6);
      expect(getPlayerPenaltiesReceived(state, 2)).toBe(6);
    });

    it('should throw ValidationException for invalid player index', () => {
      const state = initializePenaltyTracking(4);
      expect(() => getPlayerPenaltiesReceived(state, -1)).toThrow(ValidationException);
      expect(() => getPlayerPenaltiesReceived(state, 4)).toThrow(ValidationException);
    });
  });

  describe('getPlayerNetPenaltyScore', () => {
    it('should calculate net penalty score (received - paid)', () => {
      let state = initializePenaltyTracking(4);
      state = recordPenaltyReceipt(state, 1, 10);
      state = recordPenaltyPayment(state, 1, 4);
      expect(getPlayerNetPenaltyScore(state, 1)).toBe(6); // 10 - 4
    });

    it('should return negative score if player paid more than received', () => {
      let state = initializePenaltyTracking(4);
      state = recordPenaltyReceipt(state, 1, 4);
      state = recordPenaltyPayment(state, 1, 10);
      expect(getPlayerNetPenaltyScore(state, 1)).toBe(-6); // 4 - 10
    });

    it('should return 0 if player has no penalties', () => {
      const state = initializePenaltyTracking(4);
      expect(getPlayerNetPenaltyScore(state, 1)).toBe(0);
    });

    it('should throw ValidationException for invalid player index', () => {
      const state = initializePenaltyTracking(4);
      expect(() => getPlayerNetPenaltyScore(state, -1)).toThrow(ValidationException);
      expect(() => getPlayerNetPenaltyScore(state, 4)).toThrow(ValidationException);
    });
  });

  describe('Integration tests', () => {
    it('should track complete cutting scenario across multiple rounds', () => {
      let state = initializePenaltyTracking(4);

      // Round 1: Player 1 cuts Player 0's single heo (penalty 1)
      state = recordCuttingWithTransfer(state, 0, 1, 1, 0);
      expect(getPlayerPenaltiesPaid(state, 0)).toBe(1);
      expect(getPlayerPenaltiesReceived(state, 1)).toBe(1);

      // Round 2: Player 2 cuts Player 1's hàng (penalty 4)
      state = recordCuttingWithTransfer(state, 1, 2, 4, 0);
      expect(getPlayerPenaltiesPaid(state, 1)).toBe(4);
      expect(getPlayerPenaltiesReceived(state, 2)).toBe(4);

      // Round 3: Player 3 cuts Player 2, transferring Player 1's penalty (chặt chồng)
      // Player 2 pays: 6 (from Player 3) + 4 (transferred from Player 1) = 10
      state = recordCuttingWithTransfer(state, 2, 3, 6, 4);
      expect(getPlayerPenaltiesPaid(state, 2)).toBe(10); // 6 + 4
      expect(getPlayerPenaltiesReceived(state, 3)).toBe(10);

      // Verify final state
      expect(getPlayerNetPenaltyScore(state, 0)).toBe(-1); // paid 1, received 0
      expect(getPlayerNetPenaltyScore(state, 1)).toBe(-3); // paid 4, received 1
      expect(getPlayerNetPenaltyScore(state, 2)).toBe(-6); // paid 10, received 4
      expect(getPlayerNetPenaltyScore(state, 3)).toBe(10); // paid 0, received 10
    });
  });
});
