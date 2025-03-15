// src/store/useMethodManagerStore.ts
import { create } from "zustand";
import { useChasseStore } from "./useChasseStore";
import { useCommonMethodsStore } from "./useCommonMethodsStore";
import { useMethodCapitalStore } from "./useMethodCapitalStore";

export interface StoreState {
  activeMethodId: string | null;
}

export interface StoreActions {
  switchToNextMethod: (currentMethodId: string, nextMethodId: string) => void;
  initializeMethod: (methodId: string) => void;
  reset: () => void;
}

export const useMethodManagerStore = create<StoreState & StoreActions>(
  (set, get) => ({
    activeMethodId: null,

    switchToNextMethod: (currentMethodId, nextMethodId) => {
      console.log(`Transition de ${currentMethodId} à ${nextMethodId}`);
      set((state) => {
        const currentMethodCapital =
          useMethodCapitalStore.getState().methodCapital[currentMethodId];
        if (!currentMethodCapital) return state;

        useMethodCapitalStore.getState().initializeMethodCapital(nextMethodId);
        return { activeMethodId: nextMethodId };
      });

      get().initializeMethod(nextMethodId);
    },

    initializeMethod: (methodId) => {
      // Synchroniser l'état actif dans tous les stores
      set({ activeMethodId: methodId });
      useCommonMethodsStore.setState((state) => ({
        ...state,
        activeMethodId: methodId,
      }));

      // Initialiser la méthode spécifique
      if (methodId === "chasse") {
        useChasseStore.getState().initializeChasse();
      }
      // Ajouter d'autres initialisations pour d'autres méthodes si nécessaire
    },

    reset: () => {
      set({ activeMethodId: null });
    },
  })
);
