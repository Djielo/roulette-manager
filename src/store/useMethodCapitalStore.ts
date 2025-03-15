// src/store/useMethodCapitalStore.ts
import { create } from "zustand";
import { MethodCapital } from "../types/manager";
import { useAppManagerStore } from "./useAppManagerStore";

// Fonction utilitaire pour formater les nombres avec 2 décimales
const formatNumber = (num: number): number => {
  return Number(num.toFixed(2));
};

export interface StoreState {
  methodCapital: Record<string, MethodCapital>;
}

export interface StoreActions {
  initializeMethodCapital: (methodId: string) => void;
  updateMethodCapital: (methodId: string, current: number) => void;
  deductBets: (methodId: string, bets: { amount: number }[]) => void;
  creditWin: (methodId: string, betAmount: number) => void;
  reset: () => void;
}

export const useMethodCapitalStore = create<StoreState & StoreActions>(
  (set) => ({
    methodCapital: {},

    initializeMethodCapital: (methodId) => {
      const managerCapital = formatNumber(
        useAppManagerStore.getState().capital.initial
      );
      console.log(
        `Initialisation du capital pour ${methodId}: ${managerCapital}€`
      );

      set((state) => ({
        methodCapital: {
          ...state.methodCapital,
          [methodId]: {
            initial: managerCapital,
            current: managerCapital,
          },
        },
      }));
    },

    updateMethodCapital: (methodId, current) => {
      const formattedCurrent = formatNumber(current);
      console.log(
        `Mise à jour du capital pour ${methodId}: ${formattedCurrent}€`
      );

      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        useAppManagerStore.getState().setCapital("current", formattedCurrent);

        return {
          methodCapital: {
            ...state.methodCapital,
            [methodId]: {
              ...methodCapital,
              current: formattedCurrent,
            },
          },
        };
      });
    },

    deductBets: (methodId, bets) => {
      const totalBetAmount = formatNumber(
        bets.reduce((sum, bet) => sum + bet.amount, 0)
      );
      console.log(`Déduction des mises pour ${methodId}: ${totalBetAmount}€`);

      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        const newCurrent = formatNumber(methodCapital.current - totalBetAmount);
        useAppManagerStore.getState().setCapital("current", newCurrent);

        return {
          methodCapital: {
            ...state.methodCapital,
            [methodId]: {
              ...methodCapital,
              current: newCurrent,
            },
          },
        };
      });
    },

    creditWin: (methodId, betAmount) => {
      const winAmount = formatNumber(betAmount * 36);
      console.log(`Crédit du gain pour ${methodId}: ${winAmount}€`);

      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        const newCurrent = formatNumber(
          methodCapital.current + winAmount - betAmount
        );
        useAppManagerStore.getState().setCapital("current", newCurrent);

        return {
          methodCapital: {
            ...state.methodCapital,
            [methodId]: {
              ...methodCapital,
              current: newCurrent,
            },
          },
        };
      });
    },

    reset: () => {
      console.log("Réinitialisation complète du capital des méthodes");
      set({ methodCapital: {} });
    },
  })
);
