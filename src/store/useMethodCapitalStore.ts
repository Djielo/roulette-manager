// src/store/useMethodCapitalStore.ts
import { create } from 'zustand';
import { MethodCapital } from '../types/manager';
import { useAppManagerStore } from './useAppManagerStore';

export interface StoreState {
  methodCapital: Record<string, MethodCapital>;
}

export interface StoreActions {
  initializeMethodCapital: (methodId: string) => void;
  updateMethodCapital: (methodId: string, current: number) => void;
  validateMethodCapital: (methodId: string, final: number) => void;
  deductBets: (methodId: string, bets: { amount: number }[]) => void;
  syncCapitals: (methodId: string) => void;
  reset: () => void;
}

export const useMethodCapitalStore = create<StoreState & StoreActions>((set) => ({
  methodCapital: {},

  initializeMethodCapital: (methodId) => {
    set((state) => ({
      methodCapital: {
        ...state.methodCapital,
        [methodId]: {
          initial: useAppManagerStore.getState().capital.current,
          current: useAppManagerStore.getState().capital.current,
        },
      },
    }));
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
    useAppManagerStore.getState().setCapital('current', final);
  },

  deductBets: (methodId, bets) => {
    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

    set((state) => {
      const methodCapital = state.methodCapital[methodId];
      if (!methodCapital) return state;

      const newMethodCapital = methodCapital.current - totalBetAmount;
      
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

    useAppManagerStore.getState().setCapital('current', useAppManagerStore.getState().capital.current - totalBetAmount);
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
}));