// src/store/useMethodCapitalStore.ts
import { create } from "zustand";
import { MethodCapital } from "../types/manager";
import { useAppManagerStore } from "./useAppManagerStore";
import { useCommonMethodsStore } from "./useCommonMethodsStore";
import { useMethodManagerStore } from "./useMethodManagerStore";

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
      const managerCapital = formatNumber(
        useAppManagerStore.getState().capital.initial
      );

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

        const formattedCurrent = formatNumber(current);
        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            ...methodCapital,
            current: formattedCurrent,
          },
        };

        useAppManagerStore.getState().setCapital("current", formattedCurrent);

        return { methodCapital: newMethodCapital };
      });
    },

    validateMethodCapital: (methodId, final) => {
      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        const formattedFinal = formatNumber(final);
        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            ...methodCapital,
            validated: formattedFinal,
            current: formattedFinal,
          },
        };

        const appManagerStore = useAppManagerStore.getState();
        appManagerStore.setCapital("initial", formattedFinal);
        appManagerStore.setCapital("current", formattedFinal);

        return { methodCapital: newMethodCapital };
      });
    },

    deductBets: (methodId, bets) => {
      const totalBetAmount = formatNumber(
        bets.reduce((sum, bet) => sum + bet.amount, 0)
      );
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

        const newCurrent = formatNumber(methodCapital.current - totalBetAmount);

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
      const winAmount = formatNumber(betAmount * 36);

      set((state) => {
        const methodCapital = state.methodCapital[methodId];
        if (!methodCapital) return state;

        // Calculer le nouveau capital après gain ET déduction des mises
        const newCurrent = formatNumber(
          methodCapital.current + winAmount - betAmount
        );

        // Mettre à jour le capital de la méthode
        const newMethodCapital = {
          ...state.methodCapital,
          [methodId]: {
            ...methodCapital,
            current: newCurrent,
          },
        };

        // Mettre à jour le capital actuel du manager
        useAppManagerStore.getState().setCapital("current", newCurrent);

        // Vérifier s'il y a un bénéfice APRÈS déduction des mises
        if (newCurrent > methodCapital.initial) {
          console.log(
            `BÉNÉFICE DÉTECTÉ ! La méthode ${methodId} sera arrêtée après ce tour`
          );
          console.log(
            `Capital initial: ${methodCapital.initial}, Capital final: ${newCurrent}`
          );
          console.log(`Gain: ${winAmount}€, Mise déduite: ${betAmount}€`);

          // On laisse le temps au tapis de s'afficher avant de passer à la suite
          setTimeout(() => {
            // Mettre à jour les capitaux du manager
            const appManagerStore = useAppManagerStore.getState();
            appManagerStore.setCapital("initial", newCurrent);
            appManagerStore.setCapital("current", newCurrent);

            // Marquer la méthode comme terminée avec bénéfice
            set((state) => ({
              methodCapital: {
                ...state.methodCapital,
                [methodId]: {
                  ...state.methodCapital[methodId],
                  validated: newCurrent,
                },
              },
            }));

            // Passer à la méthode suivante si en mode cyclique
            const commonMethodsStore = useCommonMethodsStore.getState();
            if (commonMethodsStore.cyclicMode) {
              const nextMethodId = useMethodManagerStore
                .getState()
                .getNextMethodId(methodId);
              if (nextMethodId) {
                useMethodManagerStore
                  .getState()
                  .switchToNextMethod(methodId, nextMethodId);
              }
            }
          }, 2000); // Attendre 2 secondes pour laisser le temps au tapis de s'afficher
        }

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
