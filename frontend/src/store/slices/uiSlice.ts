import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModalType = string | null;
export type BottomMenuActiveItem = string | null;

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp?: number;
}

interface FormDraft {
  [key: string]: any;
}

interface UiState {
  // Navigation state
  sidebarOpen: boolean;
  bottomMenuActiveItem: BottomMenuActiveItem;

  // Modal state
  currentModal: ModalType;
  modalStack: ModalType[];

  // Theme and appearance
  theme: 'light' | 'dark';

  // Notifications
  notifications: Notification[];

  // Loading states
  pageTransitioning: boolean;
  isDragging: boolean;
  loadingStates: Record<string, boolean>;

  // Form drafts
  formDrafts: Record<string, FormDraft>;

  // UI preferences
  soundEnabled: boolean;
  animationsEnabled: boolean;
  cardDisplayMode: 'compact' | 'normal' | 'detailed';
}

const initialState: UiState = {
  sidebarOpen: false,
  bottomMenuActiveItem: null,
  currentModal: null,
  modalStack: [],
  theme: 'dark',
  notifications: [],
  pageTransitioning: false,
  isDragging: false,
  loadingStates: {},
  formDrafts: {},
  soundEnabled: true,
  animationsEnabled: true,
  cardDisplayMode: 'normal',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Navigation
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setBottomMenuActiveItem: (state, action: PayloadAction<BottomMenuActiveItem>) => {
      state.bottomMenuActiveItem = action.payload;
    },

    // Modal management
    openModal: (state, action: PayloadAction<ModalType>) => {
      if (state.currentModal) {
        state.modalStack.push(state.currentModal);
      }
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.currentModal = state.modalStack.pop() || null;
    },
    closeAllModals: (state) => {
      state.currentModal = null;
      state.modalStack = [];
    },

    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Loading states
    setPageTransitioning: (state, action: PayloadAction<boolean>) => {
      state.pageTransitioning = action.payload;
    },
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    setLoadingState: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      if (action.payload.loading) {
        state.loadingStates[action.payload.key] = true;
      } else {
        delete state.loadingStates[action.payload.key];
      }
    },

    // Form drafts
    saveFormDraft: (state, action: PayloadAction<{ formId: string; draft: FormDraft }>) => {
      state.formDrafts[action.payload.formId] = action.payload.draft;
    },
    clearFormDraft: (state, action: PayloadAction<string>) => {
      delete state.formDrafts[action.payload];
    },
    clearAllFormDrafts: (state) => {
      state.formDrafts = {};
    },

    // UI preferences
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    setAnimationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.animationsEnabled = action.payload;
    },
    setCardDisplayMode: (state, action: PayloadAction<'compact' | 'normal' | 'detailed'>) => {
      state.cardDisplayMode = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setBottomMenuActiveItem,
  openModal,
  closeModal,
  closeAllModals,
  setTheme,
  toggleTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setPageTransitioning,
  setIsDragging,
  setLoadingState,
  saveFormDraft,
  clearFormDraft,
  clearAllFormDrafts,
  setSoundEnabled,
  setAnimationsEnabled,
  setCardDisplayMode,
} = uiSlice.actions;
