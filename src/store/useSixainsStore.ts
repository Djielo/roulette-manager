import { create } from 'zustand';

interface StoreState {
  // État spécifique à la méthode Sixains
}

interface StoreActions {
  // Actions spécifiques à la méthode Sixains
}

export const useSixainsStore = create<StoreState & StoreActions>(() => ({
  // Initial state
}));