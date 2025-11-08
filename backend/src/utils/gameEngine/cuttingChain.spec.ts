import {
  initializeCuttingChain,
  addCutToChain,
  markCutPlayerFinished,
  calculateCumulativePenalties,
  getPenaltyReceiver,
  resetCuttingChain,
  getCuttingChain,
  getChainLength,
  type CuttingChainState,
  type CutEntry,
} from './cuttingChain';

describe('Cutting Chain (Chặt Chồng)', () => {
  describe('initializeCuttingChain', () => {
    it('should initialize chain state for 2 players', () => {
      const state = initializeCuttingChain(2);
      expect(state.chain).toEqual([]);
      expect(state.numPlayers).toBe(2);
    });

    it('should initialize chain state for 4 players', () => {
      const state = initializeCuttingChain(4);
      expect(state.chain).toEqual([]);
      expect(state.numPlayers).toBe(4);
    });

    it('should throw error for invalid number of players', () => {
      expect(() => initializeCuttingChain(1)).toThrow(
        'Invalid number of players: 1. Must be between 2 and 4.',
      );
      expect(() => initializeCuttingChain(5)).toThrow(
        'Invalid number of players: 5. Must be between 2 and 4.',
      );
    });
  });

  describe('addCutToChain', () => {
    it('should add a cut to the chain', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 2, 4, 0);

      expect(getChainLength(state)).toBe(1);
      const chain = getCuttingChain(state);
      expect(chain[0].cutPlayerIndex).toBe(1);
      expect(chain[0].cuttingPlayerIndex).toBe(2);
      expect(chain[0].penaltyPoints).toBe(4);
      expect(chain[0].heoCount).toBe(0);
    });

    it('should add multiple cuts to the chain', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 2, 4, 0);
      state = addCutToChain(state, 2, 3, 6, 1);

      expect(getChainLength(state)).toBe(2);
      const chain = getCuttingChain(state);
      // Most recent first
      expect(chain[0].cutPlayerIndex).toBe(2);
      expect(chain[0].cuttingPlayerIndex).toBe(3);
      expect(chain[1].cutPlayerIndex).toBe(1);
      expect(chain[1].cuttingPlayerIndex).toBe(2);
    });

    it('should throw error for invalid player indices', () => {
      const state = initializeCuttingChain(4);
      expect(() => addCutToChain(state, -1, 2, 4, 0)).toThrow('Invalid cut player index');
      expect(() => addCutToChain(state, 1, 5, 4, 0)).toThrow('Invalid cutting player index');
      expect(() => addCutToChain(state, 1, 1, 4, 0)).toThrow('cannot cut themselves');
    });
  });

  describe('markCutPlayerFinished', () => {
    it('should mark cut player as finished', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 2, 4, 0);
      state = markCutPlayerFinished(state, 1);

      const chain = getCuttingChain(state);
      expect(chain[0].finishedAfterCut).toBe(true);
    });

    it('should mark the most recent cut where player was cut', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 2, 4, 0);
      state = addCutToChain(state, 2, 3, 6, 1);
      state = markCutPlayerFinished(state, 2);

      const chain = getCuttingChain(state);
      expect(chain[0].finishedAfterCut).toBe(true); // Player 2 was cut
      expect(chain[1].finishedAfterCut).toBeUndefined(); // Player 1 was not finished
    });
  });

  describe('calculateCumulativePenalties', () => {
    describe('Subtask 2.5.4.3: Calculate cumulative penalties for last person cut', () => {
      it('should calculate penalty for single cut', () => {
        let state = initializeCuttingChain(4);
        state = addCutToChain(state, 1, 2, 4, 0);

        const penalties = calculateCumulativePenalties(state);
        expect(penalties.get(1)).toBe(4);
        expect(penalties.get(2)).toBeUndefined();
      });

      it('should calculate cumulative penalties for chain', () => {
        // Player B plays heo
        // Player A cuts Player B (B would pay 4)
        // Player C cuts Player A (A is now cut)
        // Result: A pays 4 (from B) + 6 (from C) = 10
        let state = initializeCuttingChain(4);
        state = addCutToChain(state, 1, 0, 4, 0); // A cuts B
        state = addCutToChain(state, 0, 2, 6, 1); // C cuts A

        const penalties = calculateCumulativePenalties(state);
        expect(penalties.get(0)).toBe(10); // A pays 4 + 6
        expect(penalties.get(1)).toBeUndefined(); // B doesn't pay (transferred to A)
        expect(penalties.get(2)).toBeUndefined(); // C receives, doesn't pay
      });

      it('should handle longer chains', () => {
        // A cuts B (B pays 4)
        // C cuts A (A pays 4 + 6 = 10)
        // D cuts C (C pays 10 + 8 = 18)
        let state = initializeCuttingChain(4);
        state = addCutToChain(state, 1, 0, 4, 0); // A cuts B
        state = addCutToChain(state, 0, 2, 6, 1); // C cuts A
        state = addCutToChain(state, 2, 3, 8, 2); // D cuts C

        const penalties = calculateCumulativePenalties(state);
        expect(penalties.get(2)).toBe(18); // C pays 10 (from A) + 8 (from D)
        expect(penalties.get(0)).toBeUndefined(); // A's penalty transferred to C
        expect(penalties.get(1)).toBeUndefined(); // B's penalty transferred to C
      });
    });

    describe('Subtask 2.5.4.4: Handle chặt and finish rule (no penalty if winner finishes)', () => {
      it('should return no penalties if cut player finished', () => {
        let state = initializeCuttingChain(4);
        state = addCutToChain(state, 1, 2, 4, 0);
        state = markCutPlayerFinished(state, 1);

        const penalties = calculateCumulativePenalties(state);
        expect(penalties.size).toBe(0);
      });

      it('should return no penalties if last cut player finished', () => {
        let state = initializeCuttingChain(4);
        state = addCutToChain(state, 1, 0, 4, 0);
        state = addCutToChain(state, 0, 2, 6, 1);
        state = markCutPlayerFinished(state, 0);

        const penalties = calculateCumulativePenalties(state);
        expect(penalties.size).toBe(0);
      });
    });
  });

  describe('getPenaltyReceiver', () => {
    it('should return the cutting player for single cut', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 2, 4, 0);

      expect(getPenaltyReceiver(state)).toBe(2);
    });

    it('should return the last cutting player in chain', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 0, 4, 0);
      state = addCutToChain(state, 0, 2, 6, 1);

      expect(getPenaltyReceiver(state)).toBe(2);
    });

    it('should return null if no cuts', () => {
      const state = initializeCuttingChain(4);
      expect(getPenaltyReceiver(state)).toBeNull();
    });

    it('should return null if cut player finished', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 2, 4, 0);
      state = markCutPlayerFinished(state, 1);

      expect(getPenaltyReceiver(state)).toBeNull();
    });
  });

  describe('resetCuttingChain', () => {
    it('should reset the chain', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 2, 4, 0);
      expect(getChainLength(state)).toBe(1);

      state = resetCuttingChain(state);
      expect(getChainLength(state)).toBe(0);
    });
  });

  describe('Subtask 2.5.4.1: Track cutting chain', () => {
    it('should track multiple cuts in sequence', () => {
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 0, 4, 0);
      state = addCutToChain(state, 0, 2, 6, 1);
      state = addCutToChain(state, 2, 3, 8, 2);

      expect(getChainLength(state)).toBe(3);
      const chain = getCuttingChain(state);
      expect(chain[0].cutPlayerIndex).toBe(2);
      expect(chain[0].cuttingPlayerIndex).toBe(3);
      expect(chain[1].cutPlayerIndex).toBe(0);
      expect(chain[1].cuttingPlayerIndex).toBe(2);
      expect(chain[2].cutPlayerIndex).toBe(1);
      expect(chain[2].cuttingPlayerIndex).toBe(0);
    });
  });

  describe('Subtask 2.5.4.2: Implement penalty transfer logic', () => {
    it('should transfer penalties to last person cut', () => {
      // A cuts B (B would pay 4)
      // C cuts A (A is now cut)
      // A pays: 4 (from B) + 6 (from C) = 10
      let state = initializeCuttingChain(4);
      state = addCutToChain(state, 1, 0, 4, 0);
      state = addCutToChain(state, 0, 2, 6, 1);

      const penalties = calculateCumulativePenalties(state);
      expect(penalties.get(0)).toBe(10);
      expect(penalties.get(1)).toBeUndefined(); // B's penalty transferred to A
    });
  });
});
