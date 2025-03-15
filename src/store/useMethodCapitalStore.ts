// src/store/useMethodCapitalStore.ts
import { create } from "zustand";
import { MethodCapital } from "../types/manager";
import { useAppManagerStore } from "./useAppManagerStore";

export interface StoreState {
  methodCapital: Record<string, MethodCapital>;
}

export interface StoreActions {
  initializeMethodCapital: (methodId: string) => void;
  updateMethodCapital: (methodId: string, current: number) => void;
  validateMethodCapital: (methodId: string, final: number) => void;
  deductBets: (methodId: string, bets: { amount: number }[]) => void;
  creditWin: (methodId: string, betAmount: number) => void;
  syncCapitals: (methodId: string) => void;
  reset: () => void;
}

export const useMethodCapitalStore = create<StoreState & StoreActions>(
  (set, get) => ({
    methodCapital: {},

    initializeMethodCapital: (methodId) => {
      const initId = Math.floor(Math.random() * 1000000); // ID unique pour tracer cette opération
      const currentAppCapital = useAppManagerStore.getState().capital.current;

      console.log(
        `[${initId}] ========== INITIALISATION DU CAPITAL ==========`
      );
      console.log(`[${initId}] Method ID: ${methodId}`);
      console.log(
        `[${initId}] Capital actuel de l'application: ${currentAppCapital}`
      );
      console.log(
        `[${initId}] État actuel du methodCapital:`,
        get().methodCapital
      );

      set((state) => {
        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            initial: currentAppCapital,
            current: currentAppCapital,
          },
        };

        console.log(
          `[${initId}] Nouveau capital de la méthode:`,
          newMethodCapital[methodId]
        );
        console.log(
          `[${initId}] État complet après mise à jour:`,
          newMethodCapital
        );
        console.log(`[${initId}] ==========================================`);

        return { methodCapital: newMethodCapital };
      });
    },

    updateMethodCapital: (methodId, current) => {
      set((state) => ({
        methodCapital: {
          ...state.methodCapital,
          [methodId]: {
            ...state.methodCapital[methodId],
            current,
          },
        },
      }));
    },

    validateMethodCapital: (methodId, final) => {
      set((state) => ({
        methodCapital: {
          ...state.methodCapital,
          [methodId]: {
            ...state.methodCapital[methodId],
            validated: final,
            current: final,
          },
        },
      }));
      useAppManagerStore.getState().setCapital("current", final);
    },

    deductBets: (methodId, bets) => {
      const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
      const deductionId = Math.floor(Math.random() * 1000000); // ID unique pour tracer cette déduction

      console.log(
        `[${deductionId}] Déduction de ${totalBetAmount}€ du capital de la méthode ${methodId}`
      );
      console.log(`[${deductionId}] Mises à déduire:`, bets);

      let hasMethodCapital = false;
      let currentMethodCapitalValue = 0;

      // Vérifier si le methodCapital existe avant la déduction
      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (methodCapital) {
          hasMethodCapital = true;
          currentMethodCapitalValue = methodCapital.current;
        }
        return state;
      });

      if (!hasMethodCapital) {
        console.error(
          `[${deductionId}] ERREUR: Pas de capital trouvé pour la méthode ${methodId}`
        );
        return;
      }

      console.log(
        `[${deductionId}] Capital actuel avant déduction: ${currentMethodCapitalValue}€`
      );

      // Mettre à jour le capital de la méthode
      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) {
          console.error(
            `[${deductionId}] ERREUR: Pas de capital trouvé pour la méthode ${methodId} (dans le setter)`
          );
          return state;
        }

        const newMethodCapital = methodCapital.current - totalBetAmount;

        console.log(
          `[${deductionId}] Capital avant: ${methodCapital.current}€, après: ${newMethodCapital}€`
        );

        return {
          methodCapital: {
            ...state.methodCapital,
            [methodId]: {
              ...methodCapital,
              current: newMethodCapital,
            },
          },
        };
      });

      // Mettre à jour également le capital global
      const appManagerStore = useAppManagerStore.getState();
      const currentGlobalCapital = appManagerStore.capital.current;
      const newGlobalCapital = currentGlobalCapital - totalBetAmount;

      console.log(
        `[${deductionId}] Capital global avant: ${currentGlobalCapital}€, après: ${newGlobalCapital}€`
      );

      // Utiliser directement un nombre pour éviter les problèmes de conversion
      appManagerStore.setCapital("current", newGlobalCapital);

      // Vérifier que le capital a bien été mis à jour
      setTimeout(() => {
        const updatedGlobalCapital =
          useAppManagerStore.getState().capital.current;
        console.log(
          `[${deductionId}] Vérification après mise à jour - Capital global: ${updatedGlobalCapital}€`
        );
      }, 100);
    },

    creditWin: (methodId, betAmount) => {
      // Le gain est de 36 fois la mise
      const winAmount = betAmount * 36;

      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        const newMethodCapital = methodCapital.current + winAmount;

        return {
          methodCapital: {
            ...state.methodCapital,
            [methodId]: {
              ...methodCapital,
              current: newMethodCapital,
            },
          },
        };
      });

      // Mettre à jour également le capital du gestionnaire
      useAppManagerStore
        .getState()
        .setCapital(
          "current",
          useAppManagerStore.getState().capital.current + winAmount
        );
    },

    syncCapitals: (methodId) => {
      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        return {
          methodCapital: {
            ...state.methodCapital,
            [methodId]: {
              ...methodCapital,
              current: useAppManagerStore.getState().capital.current,
            },
          },
        };
      });
    },

    reset: () => {
      set({ methodCapital: {} });
    },
  })
);
