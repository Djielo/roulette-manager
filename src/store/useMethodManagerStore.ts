// src/store/useMethodManagerStore.ts
import { create } from "zustand";
import { useAppManagerStore } from "./useAppManagerStore";
import { useChasseStore } from "./useChasseStore";
import { useCommonMethodsStore } from "./useCommonMethodsStore";
import { useMethodCapitalStore } from "./useMethodCapitalStore";

export interface StoreState {
  activeMethodId: string | null;
}

export interface StoreActions {
  switchToNextMethod: (currentMethodId: string) => void;
  initializeMethod: (methodId: string) => void;
  reset: () => void;
}

export const useMethodManagerStore = create<StoreState & StoreActions>(
  (set) => ({
    activeMethodId: null,

    switchToNextMethod: (currentMethodId) => {
      const { pendingMethods, cyclicMode } = useCommonMethodsStore.getState();
      const currentIndex = pendingMethods.indexOf(currentMethodId);

      // Vérifier si on peut passer à la méthode suivante
      if (currentIndex === -1 || pendingMethods.length === 0) {
        console.log("Aucune méthode suivante disponible");
        return;
      }

      // En mode non cyclique, si on est à la dernière méthode
      if (!cyclicMode && currentIndex === pendingMethods.length - 1) {
        console.log("Fin de la dernière méthode en mode non cyclique");
        return;
      }

      // Déterminer la prochaine méthode
      const nextMethodId =
        pendingMethods[(currentIndex + 1) % pendingMethods.length];
      console.log(`Transition de ${currentMethodId} vers ${nextMethodId}`);

      // Sauvegarder le capital actuel
      const currentCapital = useAppManagerStore.getState().capital.current;

      // Mettre à jour l'ID de la méthode active
      set({ activeMethodId: nextMethodId });
      useCommonMethodsStore.setState({ activeMethodId: nextMethodId });

      // Initialiser la nouvelle méthode avec le capital actuel
      useMethodCapitalStore.getState().initializeMethodCapital(nextMethodId);
      useAppManagerStore.getState().setCapital("initial", currentCapital);
      useAppManagerStore.getState().setCapital("current", currentCapital);

      // Initialiser la méthode spécifique
      if (nextMethodId === "chasse") {
        useChasseStore.getState().initializeChasse();
      }
    },

    initializeMethod: (methodId) => {
      console.log(`Initialisation de la méthode ${methodId}`);
      set({ activeMethodId: methodId });
      useCommonMethodsStore.setState({ activeMethodId: methodId });

      if (methodId === "chasse") {
        useChasseStore.getState().initializeChasse();
      }
    },

    reset: () => {
      console.log("Réinitialisation du gestionnaire de méthodes");
      set({ activeMethodId: null });
    },
  })
);
