import { create } from "zustand";
import { useChasseStore } from "./useChasseStore";
import { useCommonMethodsStore } from "./useCommonMethodsStore";
import { useMethodCapitalStore } from "./useMethodCapitalStore";
import { useMethodConfigStore } from "./useMethodConfigStore";
import { useMethodManagerStore } from "./useMethodManagerStore";

export interface Capital {
  initial: number;
  current: number;
  evolution: {
    amount: number;
    percentage: number;
  };
}

export interface TimerState {
  duration: number;
  remaining: number;
  isRunning: boolean;
}

export interface GameLimits {
  maxLoss: number;
  targetProfit: number;
  betUnit: number;
}

export interface SessionState {
  isActive: boolean;
  hasExpired: boolean;
  stoppedBy: "timer" | "maxLoss" | "targetProfit" | null;
}

export interface StoreState {
  capital: Capital;
  timer: TimerState;
  limits: GameLimits;
  session: SessionState;
  sessionLocked: boolean;
  isPlaying: boolean;
  validationErrors: string[];
}

export interface StoreActions {
  setCapital: (type: "initial" | "current", value: string | number) => void;
  setTimer: (value: number) => void;
  startTimer: () => void;
  updateLimits: (updates: Partial<GameLimits>) => void;
  setMaxLoss: (value: number) => void;
  setTargetProfit: (value: number) => void;
  togglePlay: () => void;
  reset: () => void;
  validateStartConditions: () => boolean;
  clearValidationErrors: () => void;
}

const DEFAULT_CAPITAL: Capital = {
  initial: 30,
  current: 30,
  evolution: {
    amount: 0,
    percentage: 0,
  },
};

const DEFAULT_TIMER: TimerState = {
  duration: 20,
  remaining: 20,
  isRunning: false,
};

const DEFAULT_LIMITS: GameLimits = {
  maxLoss: 10,
  targetProfit: 5,
  betUnit: 0.2,
};

const DEFAULT_SESSION: SessionState = {
  isActive: false,
  hasExpired: false,
  stoppedBy: null,
};

export const useAppManagerStore = create<StoreState & StoreActions>(
  (set, get) => ({
    capital: DEFAULT_CAPITAL,
    timer: DEFAULT_TIMER,
    limits: DEFAULT_LIMITS,
    session: DEFAULT_SESSION,
    sessionLocked: false,
    isPlaying: false,
    validationErrors: [],

    setCapital: (type, value) => {
      set((state) => {
        const numericValue =
          typeof value === "string" ? parseFloat(value) || 0 : value;
        const newCapital = { ...state.capital, [type]: value };

        if (type === "initial") {
          newCapital.current = numericValue;
        }

        if (type === "current") {
          const initialValue =
            typeof state.capital.initial === "string"
              ? parseFloat(state.capital.initial) || 0
              : state.capital.initial;
          newCapital.evolution = {
            amount: numericValue - initialValue,
            percentage: ((numericValue - initialValue) / initialValue) * 100,
          };
        }

        return { capital: newCapital };
      });
    },

    setTimer: (value) => {
      set((state) => ({
        timer: { ...state.timer, duration: value, remaining: value },
      }));
    },

    startTimer: () => {
      const interval = setInterval(() => {
        const state = get();

        const shouldStop = () => {
          const { capital, limits } = state;
          const lossPercentage =
            ((capital.initial - capital.current) / capital.initial) * 100;
          const profitPercentage =
            ((capital.current - capital.initial) / capital.initial) * 100;

          if (state.timer.remaining <= 0) return "timer";
          if (lossPercentage >= limits.maxLoss) return "maxLoss";
          if (profitPercentage >= limits.targetProfit) return "targetProfit";
          return null;
        };

        const stopReason = shouldStop();
        if (stopReason) {
          clearInterval(interval);
          set({
            isPlaying: false,
            session: {
              isActive: false,
              hasExpired: true,
              stoppedBy: stopReason,
            },
          });
          return;
        }

        set((state) => ({
          timer: { ...state.timer, remaining: state.timer.remaining - 1 },
        }));
      }, 60000);
    },

    updateLimits: (updates) => {
      set((state) => ({
        limits: { ...state.limits, ...updates },
      }));
    },

    setMaxLoss: (value) => {
      set((state) => ({
        limits: { ...state.limits, maxLoss: value },
      }));
    },

    setTargetProfit: (value) => {
      set((state) => ({
        limits: { ...state.limits, targetProfit: value },
      }));
    },

    togglePlay: () => {
      const state = get();
      if (!state.sessionLocked) {
        const isValid = get().validateStartConditions();
        if (!isValid) {
          return;
        }

        const pendingMethods = useCommonMethodsStore.getState().pendingMethods;
        const firstMethodId = pendingMethods[0];

        set({
          isPlaying: true,
          sessionLocked: true,
          session: {
            isActive: true,
            hasExpired: false,
            stoppedBy: null,
          },
        });

        if (firstMethodId) {
          useMethodManagerStore.getState().initializeMethod(firstMethodId);
          useMethodCapitalStore
            .getState()
            .initializeMethodCapital(firstMethodId);
          useCommonMethodsStore.setState((state) => ({
            ...state,
            activeMethodId: firstMethodId,
          }));
        }

        get().startTimer();
        get().clearValidationErrors();
      }
    },

    reset: () => {
      // Réinitialiser les états principaux
      set({
        capital: { ...DEFAULT_CAPITAL },
        timer: { ...DEFAULT_TIMER },
        limits: { ...DEFAULT_LIMITS },
        session: { ...DEFAULT_SESSION },
        isPlaying: false,
        sessionLocked: false,
        validationErrors: [],
      });

      // Réinitialiser les méthodes tout en préservant les statistiques
      useCommonMethodsStore.setState((state) => ({
        ...state,
        activeMethodId: null,
        pendingMethods: [],
        history: [],
        methods: state.methods.map((method) => ({
          ...method,
          selected: false,
        })),
        // Préserver les statistiques des méthodes (ne pas les réinitialiser)
        stats: state.stats,
      }));

      // Réinitialiser le capital des méthodes
      useMethodCapitalStore.setState({
        methodCapital: {},
      });

      // Réinitialiser la méthode active
      useMethodManagerStore.setState({
        activeMethodId: null,
      });

      // Réinitialiser l'état de la méthode Chasse
      useChasseStore.getState().initializeChasse();

      // Note: Les configurations des méthodes sont préservées car nous ne modifions pas useMethodConfigStore
    },

    validateStartConditions: () => {
      const state = get();
      const pendingMethods = useCommonMethodsStore.getState().pendingMethods;
      const methodConfigs = useMethodConfigStore.getState().methodConfigs;
      const errors: string[] = [];

      console.log("Validation des conditions de démarrage...");

      if (state.capital.initial < 30) {
        errors.push("Le capital initial doit être d'au moins 30€");
      }

      if (state.capital.current <= 0) {
        errors.push("Le capital actuel doit être positif");
      }

      if (state.timer.duration <= 0) {
        errors.push("Le temps de jeu doit être positif");
      }

      if (state.limits.maxLoss <= 0) {
        errors.push("La perte maximale doit être positive");
      }

      if (state.limits.targetProfit <= 0) {
        errors.push("L'objectif de gain doit être positif");
      }

      if (pendingMethods.length === 0) {
        errors.push("Aucune méthode n'a été sélectionnée");
      } else {
        const unconfiguredMethods = pendingMethods.filter((methodId) => {
          const config = methodConfigs[methodId];
          return !config || !config.isConfigured;
        });

        if (unconfiguredMethods.length > 0) {
          const methodNames = unconfiguredMethods.map((methodId) => {
            const method = useCommonMethodsStore
              .getState()
              .methods.find((m) => m.id === methodId);
            return method ? method.name : methodId;
          });
          errors.push(
            `Les méthodes suivantes ne sont pas configurées : ${methodNames.join(
              ", "
            )}`
          );
        }
      }

      console.log("Erreurs de validation:", errors);

      set({ validationErrors: errors });

      return errors.length === 0;
    },

    clearValidationErrors: () => {
      set({ validationErrors: [] });
    },
  })
);
