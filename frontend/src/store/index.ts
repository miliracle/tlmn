import { configureStore } from '@reduxjs/toolkit';
import { uiSlice } from './slices/uiSlice';
import { gameSlice } from './slices/gameSlice';

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    game: gameSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

