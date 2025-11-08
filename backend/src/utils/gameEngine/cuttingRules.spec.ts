import { canCut, type CanCutResult } from './cuttingRules';
import { initializeVongState, markPlayerPlayed, hasVong } from './vongDetection';
import { initializeSingleHeoTracking, recordPlay } from './singleHeoTracking';
import { detectCombination } from './combinations';
import { createCard, createCardsOfRank } from './testHelpers';

describe('Cutting Rules', () => {
  describe('canCut', () => {
    describe('Subtask 2.5.3.4: Validate 3 con heo cannot be cut', () => {
      it('should not allow cutting 3 con heo with 3 đôi thông', () => {
        const baConHeo = detectCombination([
          createCard('2', 'Spades'),
          createCard('2', 'Clubs'),
          createCard('2', 'Diamonds'),
        ]);
        const baDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
        ]);

        expect(baConHeo).not.toBeNull();
        expect(baDoiThong).not.toBeNull();

        if (baConHeo && baDoiThong) {
          const vongState = initializeVongState(4, 0);
          const heoTracking = initializeSingleHeoTracking(4);
          const result = canCut(baDoiThong, baConHeo, vongState, 1, heoTracking);

          expect(result.canCut).toBe(false);
          expect(result.reason).toContain('3 con heo');
        }
      });

      it('should not allow cutting 3 con heo with tứ quý', () => {
        const baConHeo = detectCombination([
          createCard('2', 'Spades'),
          createCard('2', 'Clubs'),
          createCard('2', 'Diamonds'),
        ]);
        const tuQuy = detectCombination(
          createCardsOfRank('A', ['Spades', 'Clubs', 'Diamonds', 'Hearts']),
        );

        expect(baConHeo).not.toBeNull();
        expect(tuQuy).not.toBeNull();

        if (baConHeo && tuQuy) {
          const vongState = initializeVongState(4, 0);
          const heoTracking = initializeSingleHeoTracking(4);
          const result = canCut(tuQuy, baConHeo, vongState, 1, heoTracking);

          expect(result.canCut).toBe(false);
          expect(result.reason).toContain('3 con heo');
        }
      });

      it('should not allow cutting 3 con heo with 4 đôi thông', () => {
        const baConHeo = detectCombination([
          createCard('2', 'Spades'),
          createCard('2', 'Clubs'),
          createCard('2', 'Diamonds'),
        ]);
        const bonDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
          createCard('6', 'Spades'),
          createCard('6', 'Clubs'),
        ]);

        expect(baConHeo).not.toBeNull();
        expect(bonDoiThong).not.toBeNull();

        if (baConHeo && bonDoiThong) {
          const vongState = initializeVongState(4, 0);
          const heoTracking = initializeSingleHeoTracking(4);
          const result = canCut(bonDoiThong, baConHeo, vongState, 1, heoTracking);

          expect(result.canCut).toBe(false);
          expect(result.reason).toContain('3 con heo');
        }
      });
    });

    describe('Subtask 2.5.3.1: Implement 3 đôi thông cutting rules', () => {
      it('should require vòng for 3 đôi thông to cut', () => {
        const singleHeo = detectCombination([createCard('2', 'Spades')]);
        const baDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
        ]);

        expect(singleHeo).not.toBeNull();
        expect(baDoiThong).not.toBeNull();

        if (singleHeo && baDoiThong) {
          const vongState = initializeVongState(4, 0);
          let heoTracking = initializeSingleHeoTracking(4);
          heoTracking = recordPlay(heoTracking, singleHeo);

          // No vòng (first player)
          let result = canCut(baDoiThong, singleHeo, vongState, 0, heoTracking);
          expect(result.canCut).toBe(false);
          expect(result.reason).toContain('vòng');

          // Has vòng (second player)
          const vongStateWithPlay = markPlayerPlayed(vongState, 0);
          result = canCut(baDoiThong, singleHeo, vongStateWithPlay, 1, heoTracking);
          expect(result.canCut).toBe(true);
        }
      });

      it('should allow 3 đôi thông to cut 1-4 single heos', () => {
        const baDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
        ]);

        expect(baDoiThong).not.toBeNull();

        if (baDoiThong) {
          const vongState = initializeVongState(4, 0);
          const vongStateWithPlay = markPlayerPlayed(vongState, 0);

          // Test cutting 1 heo
          let heoTracking = initializeSingleHeoTracking(4);
          const heo1 = detectCombination([createCard('2', 'Spades')]);
          if (heo1) {
            heoTracking = recordPlay(heoTracking, heo1);
            let result = canCut(baDoiThong, heo1, vongStateWithPlay, 1, heoTracking);
            expect(result.canCut).toBe(true);
            expect(result.heoCount).toBe(1);
          }

          // Test cutting 2 heos
          heoTracking = initializeSingleHeoTracking(4);
          const heo2a = detectCombination([createCard('2', 'Spades')]);
          const heo2b = detectCombination([createCard('2', 'Clubs')]);
          if (heo2a && heo2b) {
            heoTracking = recordPlay(heoTracking, heo2a);
            heoTracking = recordPlay(heoTracking, heo2b);
            let result = canCut(baDoiThong, heo2b, vongStateWithPlay, 1, heoTracking);
            expect(result.canCut).toBe(true);
            expect(result.heoCount).toBe(2);
          }

          // Test cutting 3 heos
          heoTracking = initializeSingleHeoTracking(4);
          const heo3a = detectCombination([createCard('2', 'Spades')]);
          const heo3b = detectCombination([createCard('2', 'Clubs')]);
          const heo3c = detectCombination([createCard('2', 'Diamonds')]);
          if (heo3a && heo3b && heo3c) {
            heoTracking = recordPlay(heoTracking, heo3a);
            heoTracking = recordPlay(heoTracking, heo3b);
            heoTracking = recordPlay(heoTracking, heo3c);
            let result = canCut(baDoiThong, heo3c, vongStateWithPlay, 1, heoTracking);
            expect(result.canCut).toBe(true);
            expect(result.heoCount).toBe(3);
          }
        }
      });

      it('should allow 3 đôi thông to cut 3 đôi thông of smaller rank', () => {
        const baDoiThong1 = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
        ]);
        const baDoiThong2 = detectCombination([
          createCard('6', 'Spades'),
          createCard('6', 'Clubs'),
          createCard('7', 'Spades'),
          createCard('7', 'Clubs'),
          createCard('8', 'Spades'),
          createCard('8', 'Clubs'),
        ]);

        expect(baDoiThong1).not.toBeNull();
        expect(baDoiThong2).not.toBeNull();

        if (baDoiThong1 && baDoiThong2) {
          const vongState = initializeVongState(4, 0);
          const vongStateWithPlay = markPlayerPlayed(vongState, 0);
          const heoTracking = initializeSingleHeoTracking(4);

          // baDoiThong2 (higher) can cut baDoiThong1 (lower)
          let result = canCut(baDoiThong2, baDoiThong1, vongStateWithPlay, 1, heoTracking);
          expect(result.canCut).toBe(true);
          expect(result.penaltyPoints).toBe(4);

          // baDoiThong1 (lower) cannot cut baDoiThong2 (higher)
          result = canCut(baDoiThong1, baDoiThong2, vongStateWithPlay, 1, heoTracking);
          expect(result.canCut).toBe(false);
        }
      });

      it('should not allow 3 đôi thông to cut đôi heo', () => {
        const baDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
        ]);
        const doiHeo = detectCombination([createCard('2', 'Spades'), createCard('2', 'Clubs')]);

        expect(baDoiThong).not.toBeNull();
        expect(doiHeo).not.toBeNull();

        if (baDoiThong && doiHeo) {
          const vongState = initializeVongState(4, 0);
          const vongStateWithPlay = markPlayerPlayed(vongState, 0);
          const heoTracking = initializeSingleHeoTracking(4);

          const result = canCut(baDoiThong, doiHeo, vongStateWithPlay, 1, heoTracking);
          expect(result.canCut).toBe(false);
        }
      });
    });

    describe('Subtask 2.5.3.2: Implement tứ quý cutting rules', () => {
      it('should require vòng for tứ quý to cut', () => {
        const singleHeo = detectCombination([createCard('2', 'Spades')]);
        const tuQuy = detectCombination(
          createCardsOfRank('A', ['Spades', 'Clubs', 'Diamonds', 'Hearts']),
        );

        expect(singleHeo).not.toBeNull();
        expect(tuQuy).not.toBeNull();

        if (singleHeo && tuQuy) {
          const vongState = initializeVongState(4, 0);
          let heoTracking = initializeSingleHeoTracking(4);
          heoTracking = recordPlay(heoTracking, singleHeo);

          // No vòng
          let result = canCut(tuQuy, singleHeo, vongState, 0, heoTracking);
          expect(result.canCut).toBe(false);
          expect(result.reason).toContain('vòng');

          // Has vòng
          const vongStateWithPlay = markPlayerPlayed(vongState, 0);
          result = canCut(tuQuy, singleHeo, vongStateWithPlay, 1, heoTracking);
          expect(result.canCut).toBe(true);
        }
      });

      it('should allow tứ quý to cut 1-4 single heos', () => {
        const tuQuy = detectCombination(
          createCardsOfRank('A', ['Spades', 'Clubs', 'Diamonds', 'Hearts']),
        );

        expect(tuQuy).not.toBeNull();

        if (tuQuy) {
          const vongState = initializeVongState(4, 0);
          const vongStateWithPlay = markPlayerPlayed(vongState, 0);

          let heoTracking = initializeSingleHeoTracking(4);
          const heo1 = detectCombination([createCard('2', 'Spades')]);
          if (heo1) {
            heoTracking = recordPlay(heoTracking, heo1);
            let result = canCut(tuQuy, heo1, vongStateWithPlay, 1, heoTracking);
            expect(result.canCut).toBe(true);
            expect(result.heoCount).toBe(1);
          }
        }
      });

      it('should allow tứ quý to cut 3 đôi thông of any rank', () => {
        const tuQuy = detectCombination(
          createCardsOfRank('A', ['Spades', 'Clubs', 'Diamonds', 'Hearts']),
        );
        const baDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
        ]);

        expect(tuQuy).not.toBeNull();
        expect(baDoiThong).not.toBeNull();

        if (tuQuy && baDoiThong) {
          const vongState = initializeVongState(4, 0);
          const vongStateWithPlay = markPlayerPlayed(vongState, 0);
          const heoTracking = initializeSingleHeoTracking(4);

          const result = canCut(tuQuy, baDoiThong, vongStateWithPlay, 1, heoTracking);
          expect(result.canCut).toBe(true);
          expect(result.penaltyPoints).toBe(4);
        }
      });

      it('should allow tứ quý to cut tứ quý of smaller rank', () => {
        const tuQuy1 = detectCombination(
          createCardsOfRank('A', ['Spades', 'Clubs', 'Diamonds', 'Hearts']),
        );
        const tuQuy2 = detectCombination(
          createCardsOfRank('K', ['Spades', 'Clubs', 'Diamonds', 'Hearts']),
        );

        expect(tuQuy1).not.toBeNull();
        expect(tuQuy2).not.toBeNull();

        if (tuQuy1 && tuQuy2) {
          const vongState = initializeVongState(4, 0);
          const vongStateWithPlay = markPlayerPlayed(vongState, 0);
          const heoTracking = initializeSingleHeoTracking(4);

          // tuQuy1 (A) can cut tuQuy2 (K)
          let result = canCut(tuQuy1, tuQuy2, vongStateWithPlay, 1, heoTracking);
          expect(result.canCut).toBe(true);

          // tuQuy2 (K) cannot cut tuQuy1 (A)
          result = canCut(tuQuy2, tuQuy1, vongStateWithPlay, 1, heoTracking);
          expect(result.canCut).toBe(false);
        }
      });
    });

    describe('Subtask 2.5.3.3: Implement 4 đôi thông cutting rules (no vòng requirement)', () => {
      it('should not require vòng for 4 đôi thông to cut', () => {
        const singleHeo = detectCombination([createCard('2', 'Spades')]);
        const bonDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
          createCard('6', 'Spades'),
          createCard('6', 'Clubs'),
        ]);

        expect(singleHeo).not.toBeNull();
        expect(bonDoiThong).not.toBeNull();

        if (singleHeo && bonDoiThong) {
          const vongState = initializeVongState(4, 0);
          let heoTracking = initializeSingleHeoTracking(4);
          heoTracking = recordPlay(heoTracking, singleHeo);

          // No vòng - but 4 đôi thông can still cut
          let result = canCut(bonDoiThong, singleHeo, vongState, 0, heoTracking);
          expect(result.canCut).toBe(true);
        }
      });

      it('should allow 4 đôi thông to cut đôi heo', () => {
        const bonDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
          createCard('6', 'Spades'),
          createCard('6', 'Clubs'),
        ]);
        const doiHeo = detectCombination([createCard('2', 'Spades'), createCard('2', 'Clubs')]);

        expect(bonDoiThong).not.toBeNull();
        expect(doiHeo).not.toBeNull();

        if (bonDoiThong && doiHeo) {
          const vongState = initializeVongState(4, 0);
          const heoTracking = initializeSingleHeoTracking(4);

          const result = canCut(bonDoiThong, doiHeo, vongState, 0, heoTracking);
          expect(result.canCut).toBe(true);
          expect(result.penaltyPoints).toBeGreaterThan(0);
        }
      });

      it('should allow 4 đôi thông to cut 3 đôi thông', () => {
        const bonDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
          createCard('6', 'Spades'),
          createCard('6', 'Clubs'),
        ]);
        const baDoiThong = detectCombination([
          createCard('7', 'Spades'),
          createCard('7', 'Clubs'),
          createCard('8', 'Spades'),
          createCard('8', 'Clubs'),
          createCard('9', 'Spades'),
          createCard('9', 'Clubs'),
        ]);

        expect(bonDoiThong).not.toBeNull();
        expect(baDoiThong).not.toBeNull();

        if (bonDoiThong && baDoiThong) {
          const vongState = initializeVongState(4, 0);
          const heoTracking = initializeSingleHeoTracking(4);

          const result = canCut(bonDoiThong, baDoiThong, vongState, 0, heoTracking);
          expect(result.canCut).toBe(true);
          expect(result.penaltyPoints).toBe(4);
        }
      });

      it('should allow 4 đôi thông to cut tứ quý', () => {
        const bonDoiThong = detectCombination([
          createCard('3', 'Spades'),
          createCard('3', 'Clubs'),
          createCard('4', 'Spades'),
          createCard('4', 'Clubs'),
          createCard('5', 'Spades'),
          createCard('5', 'Clubs'),
          createCard('6', 'Spades'),
          createCard('6', 'Clubs'),
        ]);
        const tuQuy = detectCombination(
          createCardsOfRank('A', ['Spades', 'Clubs', 'Diamonds', 'Hearts']),
        );

        expect(bonDoiThong).not.toBeNull();
        expect(tuQuy).not.toBeNull();

        if (bonDoiThong && tuQuy) {
          const vongState = initializeVongState(4, 0);
          const heoTracking = initializeSingleHeoTracking(4);

          const result = canCut(bonDoiThong, tuQuy, vongState, 0, heoTracking);
          expect(result.canCut).toBe(true);
          expect(result.penaltyPoints).toBe(4);
        }
      });
    });
  });
});
