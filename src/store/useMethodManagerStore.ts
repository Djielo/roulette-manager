// src/store/useMethodManagerStore.ts
import { create } from 'zustand';
import { useMethodCapitalStore } from './useMethodCapitalStore';
import { useChasseStore } from './useChasseStore';

interface StoreState {
  activeMethodId: string | null;
}

interface StoreActions {
  switchToNextMethod: (currentMethodId: string, nextMethodId: string) => void;
  initializeMethod: (methodId: string) => void;
}

export const useMethodManagerStore = create<StoreState & StoreActions>((set, get) => ({
  activeMethodId: null,

  switchToNextMethod: (currentMethodId, nextMethodId) => {
    console.log(`Transition de ${currentMethodId} à ${nextMethodId}`);
    set((state) => {
      const currentMethodCapital = useMethodCapitalStore.getState().methodCapital[currentMethodId];
      if (!currentMethodCapital) return state;

      useMethodCapitalStore.getState().initializeMethodCapital(nextMethodId);
      return { activeMethodId: nextMethodId };
    });

    get().initializeMethod(nextMethodId);
  },

  initializeMethod: (methodId) => {
    if (methodId === 'chasse') {
      useChasseStore.getState().initializeChasse();
    }
    // Ajouter d'autres initialisations pour d'autres méthodes si nécessaire
  },
}));