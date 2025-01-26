import { create } from 'zustand';
import { useMethodCapitalStore } from './useMethodCapitalStore';
import { useCommonMethodsStore } from './useCommonMethodsStore';
import { useChasseStore } from './useChasseStore';
import { useMethodManagerStore } from './useMethodManagerStore';

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
  stoppedBy: 'timer' | 'maxLoss' | 'targetProfit' | null;
}

export interface StoreState {
  capital: Capital;
  timer: TimerState;
  limits: GameLimits;
  session: SessionState;
  sessionLocked: boolean;
  isPlaying: boolean;
}

export interface StoreActions {
  setCapital: (type: 'initial' | 'current', value: string | number) => void;
  setTimer: (value: number) => void;
  startTimer: () => void;
  updateLimits: (updates: Partial<GameLimits>) => void;
  setMaxLoss: (value: number) => void;
  setTargetProfit: (value: number) => void;
  togglePlay: () => void;
  reset: () => void;
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

export const useAppManagerStore = create<StoreState & StoreActions>((set, get) => ({
  capital: DEFAULT_CAPITAL,
  timer: DEFAULT_TIMER,
  limits: DEFAULT_LIMITS,
  session: DEFAULT_SESSION,
  sessionLocked: false,
  isPlaying: false,

  setCapital: (type, value) => {
    set((state) => {
      const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      const newCapital = { ...state.capital, [type]: value };

      if (type === 'initial') {
        newCapital.current = numericValue;
      }

      if (type === 'current') {
        const initialValue = typeof state.capital.initial === 'string' ? parseFloat(state.capital.initial) || 0 : state.capital.initial;
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
        const lossPercentage = ((capital.initial - capital.current) / capital.initial) * 100;
        const profitPercentage = ((capital.current - capital.initial) / capital.initial) * 100;

        if (state.timer.remaining <= 0) return 'timer';
        if (lossPercentage >= limits.maxLoss) return 'maxLoss';
        if (profitPercentage >= limits.targetProfit) return 'targetProfit';
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
        useMethodCapitalStore.getState().initializeMethodCapital(firstMethodId);
        useCommonMethodsStore.setState(state => ({
          ...state,
          activeMethodId: firstMethodId,
        }));
      }

      get().startTimer();
    }
  },

  reset: () => {
    set({
      capital: { ...DEFAULT_CAPITAL },
      timer: { ...DEFAULT_TIMER },
      limits: { ...DEFAULT_LIMITS },
      session: { ...DEFAULT_SESSION },
      isPlaying: false,
      sessionLocked: false,
    });

    useCommonMethodsStore.setState(state => ({
      ...state,
      activeMethodId: null,
      pendingMethods: [],
      history: [],
      methods: state.methods.map(method => ({
        ...method,
        selected: false,
      })),
      stats: state.stats,
    }));

    useMethodCapitalStore.setState({
      methodCapital: {},
    });

    useMethodManagerStore.setState({
      activeMethodId: null,
    });

    useChasseStore.getState().initializeChasse();
  },
}));
