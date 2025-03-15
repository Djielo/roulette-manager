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
  getNextMethodId: (currentMethodId: string) => string | null;
}

export const useMethodManagerStore = create<StoreState & StoreActions>(
  (set, get) => ({
    activeMethodId: null,

    getNextMethodId: (currentMethodId) => {
      const { pendingMethods, cyclicMode } = useCommonMethodsStore.getState();

      if (pendingMethods.length === 0) return null;

      const currentIndex = pendingMethods.indexOf(currentMethodId);
      if (currentIndex === -1) return pendingMethods[0];

      // Si on est en mode cyclique ou s'il reste des méthodes après celle-ci
      if (cyclicMode || currentIndex < pendingMethods.length - 1) {
        return pendingMethods[(currentIndex + 1) % pendingMethods.length];
      }

      // En mode non cyclique, si on est à la dernière méthode
      return null;
    },

    switchToNextMethod: (currentMethodId, nextMethodId) => {
      console.log(`Transition de ${currentMethodId} à ${nextMethodId}`);

      // Initialiser la nouvelle méthode avec le capital actuel du manager
      useMethodCapitalStore.getState().initializeMethodCapital(nextMethodId);

      // Mettre à jour l'ID de la méthode active
      set({ activeMethodId: nextMethodId });

      // Initialiser la méthode
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
