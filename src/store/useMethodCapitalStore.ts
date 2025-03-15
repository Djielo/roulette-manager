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
  (set) => ({
    methodCapital: {},

    initializeMethodCapital: (methodId) => {
      const initId = Math.floor(Math.random() * 1000000);
      const managerCapital = useAppManagerStore.getState().capital.initial;

      console.log(
        `[${initId}] ========== INITIALISATION DU CAPITAL ==========`
      );
      console.log(`[${initId}] Method ID: ${methodId}`);
      console.log(`[${initId}] Capital initial du manager: ${managerCapital}`);

      set((state) => {
        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            initial: managerCapital,
            current: managerCapital,
          },
        };

        console.log(
          `[${initId}] Capital initial de la méthode:`,
          newMethodCapital[methodId]
        );
        return { methodCapital: newMethodCapital };
      });
    },

    updateMethodCapital: (methodId, current) => {
      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            ...methodCapital,
            current,
          },
        };

        useAppManagerStore.getState().setCapital("current", current);

        return { methodCapital: newMethodCapital };
      });
    },

    validateMethodCapital: (methodId, final) => {
      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            ...methodCapital,
            validated: final,
            current: final,
          },
        };

        const appManagerStore = useAppManagerStore.getState();
        appManagerStore.setCapital("initial", final);
        appManagerStore.setCapital("current", final);

        return { methodCapital: newMethodCapital };
      });
    },

    deductBets: (methodId, bets) => {
      const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
      const deductionId = Math.floor(Math.random() * 1000000);

      console.log(
        `[${deductionId}] Déduction de ${totalBetAmount}€ du capital de la méthode ${methodId}`
      );

      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) {
          console.error(
            `[${deductionId}] ERREUR: Pas de capital trouvé pour la méthode ${methodId}`
          );
          return state;
        }

        const newCurrent = methodCapital.current - totalBetAmount;

        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            ...methodCapital,
            current: newCurrent,
          },
        };

        useAppManagerStore.getState().setCapital("current", newCurrent);

        return { methodCapital: newMethodCapital };
      });
    },

    creditWin: (methodId, betAmount) => {
      const winAmount = betAmount * 36;

      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        const newCurrent = methodCapital.current + winAmount;

        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            ...methodCapital,
            current: newCurrent,
          },
        };

        useAppManagerStore.getState().setCapital("current", newCurrent);

        return { methodCapital: newMethodCapital };
      });
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
