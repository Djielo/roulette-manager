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
  lastSessionEndTime: number | null;
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
  lastSessionEndTime: null,
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
      const setId = Math.floor(Math.random() * 1000000); // ID unique pour tracer cette opération
      console.log(
        `[${setId}] setCapital appelé avec type=${type}, value=${value}, typeof value=${typeof value}`
      );

      set((state) => {
        // Convertir la valeur en nombre si c'est une chaîne
        const numericValue =
          typeof value === "string" ? parseFloat(value) || 0 : value;
        console.log(`[${setId}] Valeur numérique calculée: ${numericValue}`);

        // Créer une copie du capital actuel
        const newCapital = { ...state.capital };

        // Mettre à jour le type spécifié (initial ou current)
        newCapital[type] = numericValue;

        // Si on met à jour le capital initial, mettre également à jour le capital courant
        if (type === "initial") {
          newCapital.current = numericValue;
          console.log(
            `[${setId}] Mise à jour du capital initial ET courant à ${numericValue}`
          );
        }

        // Calculer l'évolution
        const initialValue =
          typeof newCapital.initial === "string"
            ? parseFloat(newCapital.initial) || 0
            : newCapital.initial;

        newCapital.evolution = {
          amount: newCapital.current - initialValue,
          percentage:
            initialValue !== 0
              ? ((newCapital.current - initialValue) / initialValue) * 100
              : 0,
        };

        console.log(`[${setId}] Nouveau capital:`, newCapital);

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
        const activeMethodId = useCommonMethodsStore.getState().activeMethodId;

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

          // Enregistrer l'heure de fin de session
          const lastSessionEndTime = Date.now();

          set({
            isPlaying: false,
            session: {
              isActive: false,
              hasExpired: true,
              stoppedBy: stopReason,
              lastSessionEndTime,
            },
          });

          // Si on est en mode cyclique, on passe à la méthode suivante
          if (activeMethodId) {
            const nextMethodId = useMethodManagerStore
              .getState()
              .getNextMethodId(activeMethodId);
            if (nextMethodId) {
              useMethodManagerStore
                .getState()
                .switchToNextMethod(activeMethodId, nextMethodId);
            }
          }

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
        // Vérifier le délai de sécurité entre les sessions uniquement en production
        if (import.meta.env.PROD && state.session.lastSessionEndTime) {
          const hoursSinceLastSession =
            (Date.now() - state.session.lastSessionEndTime) / (1000 * 60 * 60);
          if (hoursSinceLastSession < 1) {
            set((state) => ({
              validationErrors: [
                ...state.validationErrors,
                `Vous devez attendre encore ${Math.ceil(
                  60 - hoursSinceLastSession * 60
                )} minutes avant de pouvoir démarrer une nouvelle session`,
              ],
            }));
            return;
          }
        }

        const isValid = get().validateStartConditions();
        if (!isValid) {
          return;
        }

        const pendingMethods = useCommonMethodsStore.getState().pendingMethods;
        const firstMethodId = pendingMethods[0];

        console.log("========== DÉMARRAGE DU JEU ==========");
        console.log("Première méthode:", firstMethodId);
        console.log("Méthodes en attente:", pendingMethods);

        set({
          isPlaying: true,
          sessionLocked: true,
          session: {
            isActive: true,
            hasExpired: false,
            stoppedBy: null,
            lastSessionEndTime: null,
          },
        });

        if (firstMethodId) {
          console.log("Initialisation de la première méthode...");
          useMethodManagerStore.getState().initializeMethod(firstMethodId);

          console.log("Initialisation du capital de la méthode...");
          useMethodCapitalStore
            .getState()
            .initializeMethodCapital(firstMethodId);

          console.log("Mise à jour de l'activeMethodId...");
          useCommonMethodsStore.setState((state) => ({
            ...state,
            activeMethodId: firstMethodId,
          }));

          console.log("État final après initialisation:");
          console.log(
            "- activeMethodId:",
            useCommonMethodsStore.getState().activeMethodId
          );
          console.log(
            "- methodCapital:",
            useMethodCapitalStore.getState().methodCapital
          );
        }

        get().startTimer();
        get().clearValidationErrors();
        console.log("====================================");
      }
    },

    reset: () => {
      console.log("Réinitialisation de l'application...");

      // Enregistrer l'heure de fin de session
      const currentSession = get().session;
      const lastSessionEndTime = currentSession.isActive
        ? Date.now()
        : currentSession.lastSessionEndTime;

      // Réinitialiser le store principal
      set({
        capital: DEFAULT_CAPITAL,
        timer: DEFAULT_TIMER,
        limits: DEFAULT_LIMITS,
        session: {
          ...DEFAULT_SESSION,
          lastSessionEndTime,
        },
        sessionLocked: false,
        isPlaying: false,
        validationErrors: [],
      });

      // Réinitialiser les autres stores
      useMethodCapitalStore.getState().reset();
      useMethodManagerStore.getState().reset();

      // Réinitialiser le store de la méthode Chasse
      useChasseStore.getState().initializeChasse();

      // Réinitialiser le store commun des méthodes
      useCommonMethodsStore.setState((state) => ({
        ...state,
        cyclicMode: true,
        activeMethodId: null,
        pendingMethods: [],
        history: [],
        methods: state.methods.map((method) => ({
          ...method,
          selected: false,
        })),
      }));

      console.log("Réinitialisation terminée");
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
