import { create } from 'zustand';
import { RouletteNumber } from '../types/roulette';
import { ChasseMethodState, chasseActions } from '../types/methods/chasse';
import { useCommonMethodsStore } from './useCommonMethodsStore';

export interface StoreState {
  chasseState: ChasseMethodState;
}

export interface StoreActions {
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
  displayedNumbers: []
};

export const useChasseStore = create<StoreState & StoreActions>((set, get) => ({
  chasseState: { ...DEFAULT_CHASSE_STATE },

  initializeChasse: () => {
    const history = useCommonMethodsStore.getState().history;
    const currentState = get().chasseState;
    const state = currentState.phase === 'finished' ? 
      { ...DEFAULT_CHASSE_STATE } : 
      { ...currentState, displayedNumbers: [] };
    if (history.length > 0) {
      chasseActions.analyzeHistory(state, history.map((h) => h.number));
    }
    set({ chasseState: state });
  },

  updateChasseState: (number: RouletteNumber) => {
    const state = { ...get().chasseState };
    chasseActions.addNumber(state, number);
    // Mettre à jour à la fois l'historique et l'affichage
    set({ 
      chasseState: {
        ...state,
        displayedNumbers: [...state.displayedNumbers, number]
      }
    });
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
