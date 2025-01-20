import { create } from 'zustand';

interface StoreState {
  // État spécifique à la méthode SDC
}

interface StoreActions {
  // Actions spécifiques à la méthode SDC
}

export const useSdcStore = create<StoreState & StoreActions>(() => ({
  // Initial state
}));