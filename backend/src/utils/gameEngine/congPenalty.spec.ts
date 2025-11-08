import {
  calculateToiTrangPenalty,
  calculateCongPenaltyPerPlayer,
  applyCongPenaltyPerPlayer,
  calculateTotalCongPenalties,
  handleDenBaiPenalty,
  calculateWinnerCongPenalties,
  calculateCongPenaltyResult,
} from './congPenalty';
import { CongDetectionResult, DenBaiDetectionResult } from './gameEndDetection';
import { ValidationException } from '../../common/exceptions';

describe('Cóng Penalty Calculation', () => {
  describe('calculateToiTrangPenalty', () => {
    describe('Subtask 2.8.3.1: Calculate tới trắng penalty value (13 × player count)', () => {
      it('should calculate tới trắng penalty for 2-player game', () => {
        expect(calculateToiTrangPenalty(2)).toBe(26); // 13 × 2
      });

      it('should calculate tới trắng penalty for 3-player game', () => {
        expect(calculateToiTrangPenalty(3)).toBe(39); // 13 × 3
      });

      it('should calculate tới trắng penalty for 4-player game', () => {
        expect(calculateToiTrangPenalty(4)).toBe(52); // 13 × 4
      });

      it('should throw ValidationException for invalid number of players', () => {
        expect(() => calculateToiTrangPenalty(1)).toThrow(ValidationException);
        expect(() => calculateToiTrangPenalty(5)).toThrow(ValidationException);
        expect(() => calculateToiTrangPenalty(0)).toThrow(ValidationException);
      });
    });
  });

  describe('calculateCongPenaltyPerPlayer', () => {
    it('should return same value as tới trắng penalty', () => {
      expect(calculateCongPenaltyPerPlayer(2)).toBe(26);
      expect(calculateCongPenaltyPerPlayer(3)).toBe(39);
      expect(calculateCongPenaltyPerPlayer(4)).toBe(52);
    });
  });

  describe('applyCongPenaltyPerPlayer', () => {
    describe('Subtask 2.8.3.2: Apply cóng penalty per stuck player', () => {
      it('should apply penalty for cóng 1 nhà', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1],
          congCount: 1,
          isCong1Nha: true,
          isCong2Nha: false,
          isCong3Nha: false,
        };

        const penalties = applyCongPenaltyPerPlayer(congResult, 4);
        expect(penalties.size).toBe(1);
        expect(penalties.get(1)).toBe(52); // 13 × 4
      });

      it('should apply penalty for cóng 2 nhà', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2],
          congCount: 2,
          isCong1Nha: false,
          isCong2Nha: true,
          isCong3Nha: false,
        };

        const penalties = applyCongPenaltyPerPlayer(congResult, 4);
        expect(penalties.size).toBe(2);
        expect(penalties.get(1)).toBe(52); // 13 × 4
        expect(penalties.get(2)).toBe(52); // 13 × 4
      });

      it('should apply penalty for cóng 3 nhà', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2, 3],
          congCount: 3,
          isCong1Nha: false,
          isCong2Nha: false,
          isCong3Nha: true,
        };

        const penalties = applyCongPenaltyPerPlayer(congResult, 4);
        expect(penalties.size).toBe(3);
        expect(penalties.get(1)).toBe(52); // 13 × 4
        expect(penalties.get(2)).toBe(52); // 13 × 4
        expect(penalties.get(3)).toBe(52); // 13 × 4
      });

      it('should apply correct penalty for 3-player game', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1],
          congCount: 1,
          isCong1Nha: true,
          isCong2Nha: false,
          isCong3Nha: false,
        };

        const penalties = applyCongPenaltyPerPlayer(congResult, 3);
        expect(penalties.get(1)).toBe(39); // 13 × 3
      });

      it('should apply correct penalty for 2-player game', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1],
          congCount: 1,
          isCong1Nha: true,
          isCong2Nha: false,
          isCong3Nha: false,
        };

        const penalties = applyCongPenaltyPerPlayer(congResult, 2);
        expect(penalties.get(1)).toBe(26); // 13 × 2
      });

      it('should throw ValidationException for invalid number of players', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1],
          congCount: 1,
          isCong1Nha: true,
          isCong2Nha: false,
          isCong3Nha: false,
        };

        expect(() => applyCongPenaltyPerPlayer(congResult, 1)).toThrow(ValidationException);
        expect(() => applyCongPenaltyPerPlayer(congResult, 5)).toThrow(ValidationException);
      });
    });
  });

  describe('calculateTotalCongPenalties', () => {
    it('should calculate total for cóng 1 nhà', () => {
      const congResult: CongDetectionResult = {
        congPlayers: [1],
        congCount: 1,
        isCong1Nha: true,
        isCong2Nha: false,
        isCong3Nha: false,
      };

      expect(calculateTotalCongPenalties(congResult, 4)).toBe(52); // 1 × 52
    });

    it('should calculate total for cóng 2 nhà', () => {
      const congResult: CongDetectionResult = {
        congPlayers: [1, 2],
        congCount: 2,
        isCong1Nha: false,
        isCong2Nha: true,
        isCong3Nha: false,
      };

      expect(calculateTotalCongPenalties(congResult, 4)).toBe(104); // 2 × 52
    });

    it('should calculate total for cóng 3 nhà', () => {
      const congResult: CongDetectionResult = {
        congPlayers: [1, 2, 3],
        congCount: 3,
        isCong1Nha: false,
        isCong2Nha: false,
        isCong3Nha: true,
      };

      expect(calculateTotalCongPenalties(congResult, 4)).toBe(156); // 3 × 52
    });
  });

  describe('handleDenBaiPenalty', () => {
    describe('Subtask 2.8.3.3: Handle đền bài penalty (all cóng penalties)', () => {
      it('should return null if not cóng 3 nhà', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1],
          congCount: 1,
          isCong1Nha: true,
          isCong2Nha: false,
          isCong3Nha: false,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [0],
          hasDenBai: true,
        };

        const result = handleDenBaiPenalty(congResult, denBaiResult, 4);
        expect(result).toBeNull();
      });

      it('should return null if no đền bài players', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2, 3],
          congCount: 3,
          isCong1Nha: false,
          isCong2Nha: false,
          isCong3Nha: true,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [],
          hasDenBai: false,
        };

        const result = handleDenBaiPenalty(congResult, denBaiResult, 4);
        expect(result).toBeNull();
      });

      it('should calculate đền bài penalty for cóng 3 nhà', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2, 3],
          congCount: 3,
          isCong1Nha: false,
          isCong2Nha: false,
          isCong3Nha: true,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [0],
          hasDenBai: true,
        };

        const result = handleDenBaiPenalty(congResult, denBaiResult, 4);
        expect(result).not.toBeNull();
        expect(result!.penalty).toBe(156); // 3 × 52 (all cóng penalties)
        expect(result!.playerIndex).toBe(0);
      });

      it('should throw ValidationException if multiple đền bài players in cóng 3 nhà', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2, 3],
          congCount: 3,
          isCong1Nha: false,
          isCong2Nha: false,
          isCong3Nha: true,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [0, 1],
          hasDenBai: true,
        };

        expect(() => handleDenBaiPenalty(congResult, denBaiResult, 4)).toThrow(ValidationException);
      });

      it('should calculate đền bài penalty for 3-player game', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2],
          congCount: 2,
          isCong1Nha: false,
          isCong2Nha: true,
          isCong3Nha: false,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [],
          hasDenBai: false,
        };

        // In 3-player game, cóng 2 nhà is the maximum, so đền bài doesn't apply
        const result = handleDenBaiPenalty(congResult, denBaiResult, 3);
        expect(result).toBeNull();
      });
    });
  });

  describe('calculateWinnerCongPenalties', () => {
    describe('Subtask 2.8.3.4: Apply cóng penalty to winner total', () => {
      it('should calculate winner receives for cóng 1 nhà', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1],
          congCount: 1,
          isCong1Nha: true,
          isCong2Nha: false,
          isCong3Nha: false,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [],
          hasDenBai: false,
        };

        const winnerReceives = calculateWinnerCongPenalties(congResult, denBaiResult, 4);
        expect(winnerReceives).toBe(52); // 1 × 52
      });

      it('should calculate winner receives for cóng 2 nhà', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2],
          congCount: 2,
          isCong1Nha: false,
          isCong2Nha: true,
          isCong3Nha: false,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [],
          hasDenBai: false,
        };

        const winnerReceives = calculateWinnerCongPenalties(congResult, denBaiResult, 4);
        expect(winnerReceives).toBe(104); // 2 × 52
      });

      it('should calculate winner receives for cóng 3 nhà without đền bài', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2, 3],
          congCount: 3,
          isCong1Nha: false,
          isCong2Nha: false,
          isCong3Nha: true,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [],
          hasDenBai: false,
        };

        const winnerReceives = calculateWinnerCongPenalties(congResult, denBaiResult, 4);
        expect(winnerReceives).toBe(156); // 3 × 52
      });

      it('should calculate winner receives for cóng 3 nhà with đền bài', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1, 2, 3],
          congCount: 3,
          isCong1Nha: false,
          isCong2Nha: false,
          isCong3Nha: true,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [0],
          hasDenBai: true,
        };

        const winnerReceives = calculateWinnerCongPenalties(congResult, denBaiResult, 4);
        // Winner receives: cóng penalties (156) + đền bài penalty (156) = 312
        expect(winnerReceives).toBe(312);
      });

      it('should calculate winner receives for 3-player game', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1],
          congCount: 1,
          isCong1Nha: true,
          isCong2Nha: false,
          isCong3Nha: false,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [],
          hasDenBai: false,
        };

        const winnerReceives = calculateWinnerCongPenalties(congResult, denBaiResult, 3);
        expect(winnerReceives).toBe(39); // 1 × 39
      });

      it('should calculate winner receives for 2-player game', () => {
        const congResult: CongDetectionResult = {
          congPlayers: [1],
          congCount: 1,
          isCong1Nha: true,
          isCong2Nha: false,
          isCong3Nha: false,
        };
        const denBaiResult: DenBaiDetectionResult = {
          denBaiPlayers: [],
          hasDenBai: false,
        };

        const winnerReceives = calculateWinnerCongPenalties(congResult, denBaiResult, 2);
        expect(winnerReceives).toBe(26); // 1 × 26
      });
    });
  });

  describe('calculateCongPenaltyResult', () => {
    it('should calculate complete result for cóng 1 nhà', () => {
      const congResult: CongDetectionResult = {
        congPlayers: [1],
        congCount: 1,
        isCong1Nha: true,
        isCong2Nha: false,
        isCong3Nha: false,
      };
      const denBaiResult: DenBaiDetectionResult = {
        denBaiPlayers: [],
        hasDenBai: false,
      };

      const result = calculateCongPenaltyResult(congResult, denBaiResult, 4);

      expect(result.totalCongPenalties).toBe(52);
      expect(result.penaltyPerCongPlayer).toBe(52);
      expect(result.congPlayerPenalties.size).toBe(1);
      expect(result.congPlayerPenalties.get(1)).toBe(52);
      expect(result.denBaiPenalty).toBe(0);
      expect(result.denBaiPlayerIndex).toBeNull();
      expect(result.winnerReceives).toBe(52);
    });

    it('should calculate complete result for cóng 2 nhà', () => {
      const congResult: CongDetectionResult = {
        congPlayers: [1, 2],
        congCount: 2,
        isCong1Nha: false,
        isCong2Nha: true,
        isCong3Nha: false,
      };
      const denBaiResult: DenBaiDetectionResult = {
        denBaiPlayers: [],
        hasDenBai: false,
      };

      const result = calculateCongPenaltyResult(congResult, denBaiResult, 4);

      expect(result.totalCongPenalties).toBe(104);
      expect(result.penaltyPerCongPlayer).toBe(52);
      expect(result.congPlayerPenalties.size).toBe(2);
      expect(result.congPlayerPenalties.get(1)).toBe(52);
      expect(result.congPlayerPenalties.get(2)).toBe(52);
      expect(result.denBaiPenalty).toBe(0);
      expect(result.denBaiPlayerIndex).toBeNull();
      expect(result.winnerReceives).toBe(104);
    });

    it('should calculate complete result for cóng 3 nhà without đền bài', () => {
      const congResult: CongDetectionResult = {
        congPlayers: [1, 2, 3],
        congCount: 3,
        isCong1Nha: false,
        isCong2Nha: false,
        isCong3Nha: true,
      };
      const denBaiResult: DenBaiDetectionResult = {
        denBaiPlayers: [],
        hasDenBai: false,
      };

      const result = calculateCongPenaltyResult(congResult, denBaiResult, 4);

      expect(result.totalCongPenalties).toBe(156);
      expect(result.penaltyPerCongPlayer).toBe(52);
      expect(result.congPlayerPenalties.size).toBe(3);
      expect(result.congPlayerPenalties.get(1)).toBe(52);
      expect(result.congPlayerPenalties.get(2)).toBe(52);
      expect(result.congPlayerPenalties.get(3)).toBe(52);
      expect(result.denBaiPenalty).toBe(0);
      expect(result.denBaiPlayerIndex).toBeNull();
      expect(result.winnerReceives).toBe(156);
    });

    it('should calculate complete result for cóng 3 nhà with đền bài', () => {
      const congResult: CongDetectionResult = {
        congPlayers: [1, 2, 3],
        congCount: 3,
        isCong1Nha: false,
        isCong2Nha: false,
        isCong3Nha: true,
      };
      const denBaiResult: DenBaiDetectionResult = {
        denBaiPlayers: [0],
        hasDenBai: true,
      };

      const result = calculateCongPenaltyResult(congResult, denBaiResult, 4);

      expect(result.totalCongPenalties).toBe(156);
      expect(result.penaltyPerCongPlayer).toBe(52);
      expect(result.congPlayerPenalties.size).toBe(3);
      expect(result.denBaiPenalty).toBe(156); // All cóng penalties
      expect(result.denBaiPlayerIndex).toBe(0);
      expect(result.winnerReceives).toBe(312); // 156 (cóng) + 156 (đền bài)
    });

    it('should calculate complete result for 3-player game', () => {
      const congResult: CongDetectionResult = {
        congPlayers: [1],
        congCount: 1,
        isCong1Nha: true,
        isCong2Nha: false,
        isCong3Nha: false,
      };
      const denBaiResult: DenBaiDetectionResult = {
        denBaiPlayers: [],
        hasDenBai: false,
      };

      const result = calculateCongPenaltyResult(congResult, denBaiResult, 3);

      expect(result.totalCongPenalties).toBe(39);
      expect(result.penaltyPerCongPlayer).toBe(39);
      expect(result.winnerReceives).toBe(39);
    });
  });
});
