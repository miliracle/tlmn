import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { uiSlice } from './slices/uiSlice';
import { gameSlice } from './slices/gameSlice';
import { authSlice } from './slices/authSlice';

// Persist configuration for UI preferences
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'soundEnabled', 'animationsEnabled', 'cardDisplayMode'],
};

// Persist configuration for auth (token only)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'tokenExpiry', 'isAuthenticated'],
};

export const store = configureStore({
  reducer: {
    ui: persistReducer(uiPersistConfig, uiSlice.reducer),
    game: gameSlice.reducer,
    auth: persistReducer(authPersistConfig, authSlice.reducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
