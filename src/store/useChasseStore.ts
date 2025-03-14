import { create } from "zustand";
import { ChasseMethodState, chasseActions } from "../types/methods/chasse";
import { RouletteNumber } from "../types/roulette";
import { useCommonMethodsStore } from "./useCommonMethodsStore";

export interface StoreState {
  chasseState: ChasseMethodState;
}

export interface StoreActions {
  initializeChasse: () => void;
  updateChasseState: (number: RouletteNumber) => void;
  decrementPlayTours: () => void;
}

const DEFAULT_CHASSE_STATE: ChasseMethodState = {
  phase: "observation",
  observationCount: 0,
  playCount: 0,
  remainingObservationTours: 24,
  remainingPlayTours: 12,
  numberCounts: {},
  selectedNumbers: [],
  displayedNumbers: [],
};

export const useChasseStore = create<StoreState & StoreActions>((set, get) => ({
  chasseState: { ...DEFAULT_CHASSE_STATE },

  initializeChasse: () => {
    // Utiliser un identifiant unique pour les logs
    const initId = Math.floor(Math.random() * 1000000);
    console.log(`[${initId}] Initialisation de la méthode Chasse...`);

    const history = useCommonMethodsStore.getState().history;

    // Créer un nouvel état complètement vide
    const state: ChasseMethodState = {
      phase: "observation",
      observationCount: 0,
      playCount: 0,
      remainingObservationTours: 24,
      remainingPlayTours: 12,
      numberCounts: {},
      selectedNumbers: [],
      displayedNumbers: [],
    };

    if (history.length > 0) {
      console.log(
        `[${initId}] Analyse de l'historique (${history.length} entrées)...`
      );
      chasseActions.analyzeHistory(
        state,
        history.map((h) => h.number)
      );
    } else {
      console.log(`[${initId}] Aucun historique à analyser.`);
    }

    console.log(`[${initId}] État après initialisation:`, {
      phase: state.phase,
      displayedNumbers: state.displayedNumbers.length,
      numberCounts: Object.keys(state.numberCounts).length,
    });

    set({ chasseState: state });
  },

  updateChasseState: (number: RouletteNumber) => {
    const state = { ...get().chasseState };
    chasseActions.addNumber(state, number);
    // La fonction addNumber s'occupe déjà d'ajouter le numéro à displayedNumbers
    set({ chasseState: state });
  },

  decrementPlayTours: () => {
    set((state) => {
      const chasseState = state.chasseState;
      if (chasseState.phase === "play" && chasseState.remainingPlayTours > 0) {
        const newRemainingPlayTours = chasseState.remainingPlayTours - 1;

        // Log pour déboguer
        console.log(
          `Décrémentation des tours de jeu : ${chasseState.remainingPlayTours} -> ${newRemainingPlayTours}`
        );

        return {
          chasseState: {
            ...chasseState,
            remainingPlayTours: newRemainingPlayTours,
            playCount: chasseState.playCount + 1,
          },
        };
      }
      return state;
    });
  },
}));
