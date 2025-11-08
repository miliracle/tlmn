import {
  initializeSessionScore,
  recordGameScores,
  accumulateSessionPoints,
  calculateSessionTotals,
  determineSessionRanking,
  calculateSessionScoreResult,
  getPlayerGameScore,
  getPlayerTotalPoints,
  getPlayerGameScores,
} from './sessionScore';
import { GameScoreResult } from './gameScore';
import { ValidationException } from '../../common/exceptions';

describe('Session Score Accumulation', () => {
  const createGameScoreResult = (
    winnerIndex: number,
    playerScores: Array<{ playerIndex: number; totalScore: number }>,
  ): GameScoreResult => {
    return {
      playerScores: playerScores.map((ps) => ({
        playerIndex: ps.playerIndex,
        totalScore: ps.totalScore,
        breakdown: {
          cardPoints: ps.totalScore > 0 ? ps.totalScore : 0,
          congPenalties: 0,
          chatPenalties: 0,
          thuiPenalties: 0,
          denBaiPenalty: 0,
        },
      })),
      winnerIndex,
      isInstantWin: false,
    };
  };

  describe('initializeSessionScore', () => {
    it('should initialize session score for 4 players and 16 games', () => {
      const state = initializeSessionScore(4, 16);

      expect(state.numPlayers).toBe(4);
      expect(state.totalGames).toBe(16);
      expect(state.playerGameScores.size).toBe(4);
      expect(state.playerTotals.size).toBe(4);

      for (let i = 0; i < 4; i++) {
        expect(state.playerGameScores.get(i)).toEqual([]);
        expect(state.playerTotals.get(i)).toBe(0);
      }
    });

    it('should initialize session score for 2 players and 32 games', () => {
      const state = initializeSessionScore(2, 32);

      expect(state.numPlayers).toBe(2);
      expect(state.totalGames).toBe(32);
      expect(state.playerGameScores.size).toBe(2);
      expect(state.playerTotals.size).toBe(2);
    });

    it('should throw ValidationException for invalid number of players', () => {
      expect(() => initializeSessionScore(1, 16)).toThrow(ValidationException);
      expect(() => initializeSessionScore(5, 16)).toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid total games', () => {
      expect(() => initializeSessionScore(4, 8)).toThrow(ValidationException);
      expect(() => initializeSessionScore(4, 64)).toThrow(ValidationException);
    });
  });

  describe('recordGameScores', () => {
    describe('Subtask 2.8.5.1: Track points per game for each player', () => {
      it('should record scores for first game', () => {
        let state = initializeSessionScore(4, 16);
        const gameResult = createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 25 },
          { playerIndex: 1, totalScore: -8 },
          { playerIndex: 2, totalScore: -10 },
          { playerIndex: 3, totalScore: -7 },
        ]);

        state = recordGameScores(state, 1, gameResult);

        expect(state.playerTotals.get(0)).toBe(25);
        expect(state.playerTotals.get(1)).toBe(-8);
        expect(state.playerTotals.get(2)).toBe(-10);
        expect(state.playerTotals.get(3)).toBe(-7);

        const player0Scores = state.playerGameScores.get(0);
        expect(player0Scores).toHaveLength(1);
        expect(player0Scores![0].gameNumber).toBe(1);
        expect(player0Scores![0].score).toBe(25);
      });

      it('should accumulate scores across multiple games', () => {
        let state = initializeSessionScore(4, 16);

        // Game 1
        state = recordGameScores(
          state,
          1,
          createGameScoreResult(0, [
            { playerIndex: 0, totalScore: 25 },
            { playerIndex: 1, totalScore: -8 },
            { playerIndex: 2, totalScore: -10 },
            { playerIndex: 3, totalScore: -7 },
          ]),
        );

        // Game 2
        state = recordGameScores(
          state,
          2,
          createGameScoreResult(1, [
            { playerIndex: 0, totalScore: -5 },
            { playerIndex: 1, totalScore: 30 },
            { playerIndex: 2, totalScore: -12 },
            { playerIndex: 3, totalScore: -13 },
          ]),
        );

        expect(state.playerTotals.get(0)).toBe(20); // 25 - 5
        expect(state.playerTotals.get(1)).toBe(22); // -8 + 30
        expect(state.playerTotals.get(2)).toBe(-22); // -10 - 12
        expect(state.playerTotals.get(3)).toBe(-20); // -7 - 13

        expect(state.playerGameScores.get(0)).toHaveLength(2);
        expect(state.playerGameScores.get(1)).toHaveLength(2);
      });

      it('should throw ValidationException for invalid game number', () => {
        const state = initializeSessionScore(4, 16);
        const gameResult = createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 25 },
          { playerIndex: 1, totalScore: -8 },
          { playerIndex: 2, totalScore: -10 },
          { playerIndex: 3, totalScore: -7 },
        ]);

        expect(() => recordGameScores(state, 0, gameResult)).toThrow(ValidationException);
        expect(() => recordGameScores(state, 17, gameResult)).toThrow(ValidationException);
      });

      it('should throw ValidationException for mismatched player count', () => {
        const state = initializeSessionScore(4, 16);
        const gameResult = createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 25 },
          { playerIndex: 1, totalScore: -8 },
        ]);

        expect(() => recordGameScores(state, 1, gameResult)).toThrow(ValidationException);
      });
    });
  });

  describe('accumulateSessionPoints', () => {
    describe('Subtask 2.8.5.2: Accumulate points across all games in session', () => {
      it('should return accumulated points for all players', () => {
        let state = initializeSessionScore(4, 16);

        state = recordGameScores(
          state,
          1,
          createGameScoreResult(0, [
            { playerIndex: 0, totalScore: 25 },
            { playerIndex: 1, totalScore: -8 },
            { playerIndex: 2, totalScore: -10 },
            { playerIndex: 3, totalScore: -7 },
          ]),
        );

        state = recordGameScores(
          state,
          2,
          createGameScoreResult(1, [
            { playerIndex: 0, totalScore: -5 },
            { playerIndex: 1, totalScore: 30 },
            { playerIndex: 2, totalScore: -12 },
            { playerIndex: 3, totalScore: -13 },
          ]),
        );

        const accumulated = accumulateSessionPoints(state);

        expect(accumulated.get(0)).toBe(20);
        expect(accumulated.get(1)).toBe(22);
        expect(accumulated.get(2)).toBe(-22);
        expect(accumulated.get(3)).toBe(-20);
      });

      it('should return zeros for players with no games recorded', () => {
        const state = initializeSessionScore(4, 16);
        const accumulated = accumulateSessionPoints(state);

        expect(accumulated.get(0)).toBe(0);
        expect(accumulated.get(1)).toBe(0);
        expect(accumulated.get(2)).toBe(0);
        expect(accumulated.get(3)).toBe(0);
      });
    });
  });

  describe('calculateSessionTotals', () => {
    describe('Subtask 2.8.5.3: Calculate session totals', () => {
      it('should calculate totals for all players', () => {
        let state = initializeSessionScore(4, 16);

        state = recordGameScores(
          state,
          1,
          createGameScoreResult(0, [
            { playerIndex: 0, totalScore: 25 },
            { playerIndex: 1, totalScore: -8 },
            { playerIndex: 2, totalScore: -10 },
            { playerIndex: 3, totalScore: -7 },
          ]),
        );

        state = recordGameScores(
          state,
          2,
          createGameScoreResult(1, [
            { playerIndex: 0, totalScore: -5 },
            { playerIndex: 1, totalScore: 30 },
            { playerIndex: 2, totalScore: -12 },
            { playerIndex: 3, totalScore: -13 },
          ]),
        );

        const totals = calculateSessionTotals(state);

        expect(totals.get(0)).toBe(20);
        expect(totals.get(1)).toBe(22);
        expect(totals.get(2)).toBe(-22);
        expect(totals.get(3)).toBe(-20);
      });
    });
  });

  describe('determineSessionRanking', () => {
    describe('Subtask 2.8.5.4: Determine final session ranking', () => {
      it('should rank players by total points (highest first)', () => {
        let state = initializeSessionScore(4, 16);

        state = recordGameScores(
          state,
          1,
          createGameScoreResult(0, [
            { playerIndex: 0, totalScore: 25 },
            { playerIndex: 1, totalScore: -8 },
            { playerIndex: 2, totalScore: -10 },
            { playerIndex: 3, totalScore: -7 },
          ]),
        );

        state = recordGameScores(
          state,
          2,
          createGameScoreResult(1, [
            { playerIndex: 0, totalScore: -5 },
            { playerIndex: 1, totalScore: 30 },
            { playerIndex: 2, totalScore: -12 },
            { playerIndex: 3, totalScore: -13 },
          ]),
        );

        const rankings = determineSessionRanking(state);

        expect(rankings).toHaveLength(4);
        expect(rankings[0].rank).toBe(1);
        expect(rankings[0].playerIndex).toBe(1); // 22 points
        expect(rankings[0].totalPoints).toBe(22);

        expect(rankings[1].rank).toBe(2);
        expect(rankings[1].playerIndex).toBe(0); // 20 points
        expect(rankings[1].totalPoints).toBe(20);

        expect(rankings[2].rank).toBe(3);
        expect(rankings[2].playerIndex).toBe(3); // -20 points
        expect(rankings[2].totalPoints).toBe(-20);

        expect(rankings[3].rank).toBe(4);
        expect(rankings[3].playerIndex).toBe(2); // -22 points
        expect(rankings[3].totalPoints).toBe(-22);
      });

      it('should handle tie-breaking (lower player index wins)', () => {
        let state = initializeSessionScore(4, 16);

        state = recordGameScores(
          state,
          1,
          createGameScoreResult(0, [
            { playerIndex: 0, totalScore: 25 },
            { playerIndex: 1, totalScore: 25 },
            { playerIndex: 2, totalScore: -10 },
            { playerIndex: 3, totalScore: -40 },
          ]),
        );

        const rankings = determineSessionRanking(state);

        expect(rankings[0].rank).toBe(1);
        expect(rankings[0].playerIndex).toBe(0); // Lower index wins tie
        expect(rankings[0].totalPoints).toBe(25);

        expect(rankings[1].rank).toBe(2);
        expect(rankings[1].playerIndex).toBe(1);
        expect(rankings[1].totalPoints).toBe(25);
      });

      it('should include game scores in ranking', () => {
        let state = initializeSessionScore(4, 16);

        state = recordGameScores(
          state,
          1,
          createGameScoreResult(0, [
            { playerIndex: 0, totalScore: 25 },
            { playerIndex: 1, totalScore: -8 },
            { playerIndex: 2, totalScore: -10 },
            { playerIndex: 3, totalScore: -7 },
          ]),
        );

        const rankings = determineSessionRanking(state);

        expect(rankings[0].gameScores).toHaveLength(1);
        expect(rankings[0].gameScores[0].gameNumber).toBe(1);
        expect(rankings[0].gameScores[0].score).toBe(25);
      });
    });
  });

  describe('calculateSessionScoreResult', () => {
    it('should calculate complete session score result', () => {
      let state = initializeSessionScore(4, 16);

      state = recordGameScores(
        state,
        1,
        createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 25 },
          { playerIndex: 1, totalScore: -8 },
          { playerIndex: 2, totalScore: -10 },
          { playerIndex: 3, totalScore: -7 },
        ]),
      );

      state = recordGameScores(
        state,
        2,
        createGameScoreResult(1, [
          { playerIndex: 0, totalScore: -5 },
          { playerIndex: 1, totalScore: 30 },
          { playerIndex: 2, totalScore: -12 },
          { playerIndex: 3, totalScore: -13 },
        ]),
      );

      const result = calculateSessionScoreResult(state);

      expect(result.rankings).toHaveLength(4);
      expect(result.sessionWinnerIndex).toBe(1); // Highest total (22)
      expect(result.gamesCompleted).toBe(2);
      expect(result.totalGames).toBe(16);
    });

    it('should handle session with no games completed', () => {
      const state = initializeSessionScore(4, 16);
      const result = calculateSessionScoreResult(state);

      expect(result.gamesCompleted).toBe(0);
      expect(result.rankings).toHaveLength(4);
      // All players should have 0 points and be ranked
      expect(result.rankings[0].totalPoints).toBe(0);
    });
  });

  describe('getPlayerGameScore', () => {
    it('should return game score for specific player and game', () => {
      let state = initializeSessionScore(4, 16);

      state = recordGameScores(
        state,
        1,
        createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 25 },
          { playerIndex: 1, totalScore: -8 },
          { playerIndex: 2, totalScore: -10 },
          { playerIndex: 3, totalScore: -7 },
        ]),
      );

      const gameScore = getPlayerGameScore(state, 0, 1);

      expect(gameScore).not.toBeNull();
      expect(gameScore!.gameNumber).toBe(1);
      expect(gameScore!.playerIndex).toBe(0);
      expect(gameScore!.score).toBe(25);
    });

    it('should return null for non-existent game', () => {
      const state = initializeSessionScore(4, 16);
      const gameScore = getPlayerGameScore(state, 0, 1);

      expect(gameScore).toBeNull();
    });
  });

  describe('getPlayerTotalPoints', () => {
    it('should return total points for player', () => {
      let state = initializeSessionScore(4, 16);

      state = recordGameScores(
        state,
        1,
        createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 25 },
          { playerIndex: 1, totalScore: -8 },
          { playerIndex: 2, totalScore: -10 },
          { playerIndex: 3, totalScore: -7 },
        ]),
      );

      expect(getPlayerTotalPoints(state, 0)).toBe(25);
      expect(getPlayerTotalPoints(state, 1)).toBe(-8);
    });

    it('should return 0 for player with no games', () => {
      const state = initializeSessionScore(4, 16);
      expect(getPlayerTotalPoints(state, 0)).toBe(0);
    });
  });

  describe('getPlayerGameScores', () => {
    it('should return all game scores for player', () => {
      let state = initializeSessionScore(4, 16);

      state = recordGameScores(
        state,
        1,
        createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 25 },
          { playerIndex: 1, totalScore: -8 },
          { playerIndex: 2, totalScore: -10 },
          { playerIndex: 3, totalScore: -7 },
        ]),
      );

      state = recordGameScores(
        state,
        2,
        createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 15 },
          { playerIndex: 1, totalScore: -5 },
          { playerIndex: 2, totalScore: -5 },
          { playerIndex: 3, totalScore: -5 },
        ]),
      );

      const gameScores = getPlayerGameScores(state, 0);

      expect(gameScores).toHaveLength(2);
      expect(gameScores[0].gameNumber).toBe(1);
      expect(gameScores[0].score).toBe(25);
      expect(gameScores[1].gameNumber).toBe(2);
      expect(gameScores[1].score).toBe(15);
    });

    it('should return empty array for player with no games', () => {
      const state = initializeSessionScore(4, 16);
      const gameScores = getPlayerGameScores(state, 0);

      expect(gameScores).toEqual([]);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete 16-game session', () => {
      let state = initializeSessionScore(4, 16);

      // Record multiple games
      for (let game = 1; game <= 16; game++) {
        const winnerIndex = (game - 1) % 4;
        const gameResult = createGameScoreResult(winnerIndex, [
          { playerIndex: 0, totalScore: winnerIndex === 0 ? 25 : -5 },
          { playerIndex: 1, totalScore: winnerIndex === 1 ? 25 : -5 },
          { playerIndex: 2, totalScore: winnerIndex === 2 ? 25 : -5 },
          { playerIndex: 3, totalScore: winnerIndex === 3 ? 25 : -5 },
        ]);

        state = recordGameScores(state, game, gameResult);
      }

      const result = calculateSessionScoreResult(state);

      expect(result.gamesCompleted).toBe(16);
      expect(result.totalGames).toBe(16);
      expect(result.rankings).toHaveLength(4);

      // Each player won 4 games (16 games / 4 players)
      // Each win: +25, each loss: -5
      // Total per player: (4 × 25) + (12 × -5) = 100 - 60 = 40
      // But wait, if each player wins 4 games, they lose 12 games
      // So each player should have: 4 × 25 + 12 × -5 = 100 - 60 = 40
      // Actually, let me recalculate: if player 0 wins games 1, 5, 9, 13
      // Player 0: wins 4 games (25 each) = 100, loses 12 games (-5 each) = -60, total = 40
      // All players should have the same total in this scenario
      expect(result.rankings[0].totalPoints).toBe(40);
    });

    it('should track points per game correctly', () => {
      let state = initializeSessionScore(4, 16);

      // Game 1: Player 0 wins with 25 points
      state = recordGameScores(
        state,
        1,
        createGameScoreResult(0, [
          { playerIndex: 0, totalScore: 25 },
          { playerIndex: 1, totalScore: -8 },
          { playerIndex: 2, totalScore: -10 },
          { playerIndex: 3, totalScore: -7 },
        ]),
      );

      // Game 2: Player 1 wins with 30 points (tới trắng)
      state = recordGameScores(
        state,
        2,
        createGameScoreResult(1, [
          { playerIndex: 0, totalScore: -52 },
          { playerIndex: 1, totalScore: 52 },
          { playerIndex: 2, totalScore: -52 },
          { playerIndex: 3, totalScore: -52 },
        ]),
      );

      const player0Scores = getPlayerGameScores(state, 0);
      expect(player0Scores).toHaveLength(2);
      expect(player0Scores[0].score).toBe(25);
      expect(player0Scores[1].score).toBe(-52);

      expect(getPlayerTotalPoints(state, 0)).toBe(-27); // 25 - 52
      expect(getPlayerTotalPoints(state, 1)).toBe(44); // -8 + 52
    });
  });
});
