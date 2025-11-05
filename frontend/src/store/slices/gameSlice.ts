import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  currentTableId: string | null;
  currentGameId: string | null;
  isConnected: boolean;
}

const initialState: GameState = {
  currentTableId: null,
  currentGameId: null,
  isConnected: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentTable: (state, action: PayloadAction<string | null>) => {
      state.currentTableId = action.payload;
    },
    setCurrentGame: (state, action: PayloadAction<string | null>) => {
      state.currentGameId = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setCurrentTable, setCurrentGame, setConnected } =
  gameSlice.actions;

