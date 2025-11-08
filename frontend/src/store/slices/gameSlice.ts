import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  // Current context
  currentTableId: string | null;
  currentGameId: string | null;
  
  // WebSocket connection state
  isConnected: boolean;
  connectionError: string | null;
  
  // Game UI state
  selectedCards: string[];
  isSortingHand: boolean;
  showSuggestions: boolean;
  
  // Turn UI state
  turnTimer: number | null;
  isMyTurn: boolean;
  canPlay: boolean;
  canPass: boolean;
  
  // Game board UI
  animations: Record<string, boolean>;
  optimisticUpdates: Record<string, any>;
}

const initialState: GameState = {
  currentTableId: null,
  currentGameId: null,
  isConnected: false,
  connectionError: null,
  selectedCards: [],
  isSortingHand: false,
  showSuggestions: false,
  turnTimer: null,
  isMyTurn: false,
  canPlay: false,
  canPass: false,
  animations: {},
  optimisticUpdates: {},
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Context management
    setCurrentTable: (state, action: PayloadAction<string | null>) => {
      state.currentTableId = action.payload;
      // Reset game state when table changes
      if (!action.payload) {
        state.currentGameId = null;
        state.selectedCards = [];
        state.isMyTurn = false;
        state.canPlay = false;
        state.canPass = false;
      }
    },
    setCurrentGame: (state, action: PayloadAction<string | null>) => {
      state.currentGameId = action.payload;
    },
    
    // WebSocket connection
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
      if (action.payload) {
        state.isConnected = false;
      }
    },
    
    // Game UI state
    setSelectedCards: (state, action: PayloadAction<string[]>) => {
      state.selectedCards = action.payload;
    },
    toggleCardSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedCards.indexOf(action.payload);
      if (index > -1) {
        state.selectedCards.splice(index, 1);
      } else {
        state.selectedCards.push(action.payload);
      }
    },
    clearSelectedCards: (state) => {
      state.selectedCards = [];
    },
    setIsSortingHand: (state, action: PayloadAction<boolean>) => {
      state.isSortingHand = action.payload;
    },
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },
    
    // Turn UI state
    setTurnTimer: (state, action: PayloadAction<number | null>) => {
      state.turnTimer = action.payload;
    },
    setIsMyTurn: (state, action: PayloadAction<boolean>) => {
      state.isMyTurn = action.payload;
    },
    setCanPlay: (state, action: PayloadAction<boolean>) => {
      state.canPlay = action.payload;
    },
    setCanPass: (state, action: PayloadAction<boolean>) => {
      state.canPass = action.payload;
    },
    setTurnState: (state, action: PayloadAction<{
      isMyTurn?: boolean;
      canPlay?: boolean;
      canPass?: boolean;
      turnTimer?: number | null;
    }>) => {
      if (action.payload.isMyTurn !== undefined) {
        state.isMyTurn = action.payload.isMyTurn;
      }
      if (action.payload.canPlay !== undefined) {
        state.canPlay = action.payload.canPlay;
      }
      if (action.payload.canPass !== undefined) {
        state.canPass = action.payload.canPass;
      }
      if (action.payload.turnTimer !== undefined) {
        state.turnTimer = action.payload.turnTimer;
      }
    },
    
    // Game board UI
    setAnimation: (state, action: PayloadAction<{ key: string; active: boolean }>) => {
      state.animations[action.payload.key] = action.payload.active;
    },
    clearAnimation: (state, action: PayloadAction<string>) => {
      delete state.animations[action.payload];
    },
    clearAllAnimations: (state) => {
      state.animations = {};
    },
    setOptimisticUpdate: (state, action: PayloadAction<{ key: string; data: any }>) => {
      state.optimisticUpdates[action.payload.key] = action.payload.data;
    },
    clearOptimisticUpdate: (state, action: PayloadAction<string>) => {
      delete state.optimisticUpdates[action.payload];
    },
    clearAllOptimisticUpdates: (state) => {
      state.optimisticUpdates = {};
    },
    
    // Reset game state
    resetGameState: (state) => {
      state.selectedCards = [];
      state.isSortingHand = false;
      state.showSuggestions = false;
      state.turnTimer = null;
      state.isMyTurn = false;
      state.canPlay = false;
      state.canPass = false;
      state.animations = {};
      state.optimisticUpdates = {};
    },
  },
});

export const {
  setCurrentTable,
  setCurrentGame,
  setConnected,
  setConnectionError,
  setSelectedCards,
  toggleCardSelection,
  clearSelectedCards,
  setIsSortingHand,
  setShowSuggestions,
  setTurnTimer,
  setIsMyTurn,
  setCanPlay,
  setCanPass,
  setTurnState,
  setAnimation,
  clearAnimation,
  clearAllAnimations,
  setOptimisticUpdate,
  clearOptimisticUpdate,
  clearAllOptimisticUpdates,
  resetGameState,
} = gameSlice.actions;

