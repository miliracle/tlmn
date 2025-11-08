import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthFormDraft {
  email?: string;
  username?: string;
  password?: string;
  [key: string]: string | undefined;
}

interface AuthState {
  // Authentication status
  isAuthenticated: boolean;
  token: string | null;
  tokenExpiry: number | null;
  
  // Auth form drafts
  loginForm: AuthFormDraft;
  registerForm: AuthFormDraft;
  
  // Auth flow state
  isLoggingIn: boolean;
  isRegistering: boolean;
  authError: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  tokenExpiry: null,
  loginForm: {},
  registerForm: {},
  isLoggingIn: false,
  isRegistering: false,
  authError: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Authentication status
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.token = null;
        state.tokenExpiry = null;
      }
    },
    setToken: (state, action: PayloadAction<{ token: string; expiry?: number }>) => {
      state.token = action.payload.token;
      state.tokenExpiry = action.payload.expiry || null;
      state.isAuthenticated = true;
    },
    clearToken: (state) => {
      state.token = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
    },
    
    // Auth form drafts
    updateLoginForm: (state, action: PayloadAction<Partial<AuthFormDraft>>) => {
      state.loginForm = { ...state.loginForm, ...action.payload };
    },
    clearLoginForm: (state) => {
      state.loginForm = {};
    },
    updateRegisterForm: (state, action: PayloadAction<Partial<AuthFormDraft>>) => {
      state.registerForm = { ...state.registerForm, ...action.payload };
    },
    clearRegisterForm: (state) => {
      state.registerForm = {};
    },
    
    // Auth flow state
    setIsLoggingIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggingIn = action.payload;
      if (action.payload) {
        state.authError = null;
      }
    },
    setIsRegistering: (state, action: PayloadAction<boolean>) => {
      state.isRegistering = action.payload;
      if (action.payload) {
        state.authError = null;
      }
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.authError = action.payload;
    },
    
    // Logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.tokenExpiry = null;
      state.authError = null;
      state.loginForm = {};
      state.registerForm = {};
    },
  },
});

export const {
  setAuthenticated,
  setToken,
  clearToken,
  updateLoginForm,
  clearLoginForm,
  updateRegisterForm,
  clearRegisterForm,
  setIsLoggingIn,
  setIsRegistering,
  setAuthError,
  logout,
} = authSlice.actions;
