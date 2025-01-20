import { create } from 'zustand';
import { RouletteNumber } from '../types/roulette';
import { ChasseMethodState, chasseActions } from '../types/methods/chasse';
import { useCommonMethodsStore } from './useCommonMethodsStore';

interface StoreState {
  chasseState: ChasseMethodState;
}

interface StoreActions {
  initializeChasse: () => void;
  updateChasseState: (number: RouletteNumber) => void;
  decrementPlayTours: () => void;
}

const DEFAULT_CHASSE_STATE: ChasseMethodState = {
  phase: 'observation',
  observationCount: 0,
  playCount: 0,
  remainingObservationTours: 24,
  remainingPlayTours: 12,
  numberCounts: {},
  selectedNumbers: [],
};

export const useChasseStore = create<StoreState & StoreActions>((set, get) => ({
  chasseState: { ...DEFAULT_CHASSE_STATE },

  initializeChasse: () => {
    const history = useCommonMethodsStore.getState().history;
    const state = { ...DEFAULT_CHASSE_STATE };
    if (history.length > 0) {
      chasseActions.analyzeHistory(state, history.map((h) => h.number));
    }
    set({ chasseState: state });
  },

  updateChasseState: (number: RouletteNumber) => {
    const state = { ...get().chasseState };
    chasseActions.addNumber(state, number);
    set({ chasseState: state });
  },

  decrementPlayTours: () => {
    set((state) => {
      const chasseState = state.chasseState;
      if (chasseState.phase === 'play' && chasseState.remainingPlayTours > 0) {
        const newRemainingPlayTours = chasseState.remainingPlayTours - 1;

        return {
          chasseState: {
            ...chasseState,
            remainingPlayTours: newRemainingPlayTours,
          },
        };
      }
      return state;
    });
  },
}));