// src/store/useRouletteStore.ts
import { create } from 'zustand'
import { Method } from '../types/methodsTypes'
import { RouletteNumber } from '../types/roulette'
import { MethodCapital } from '../types/manager'
import { validateRouletteNumber } from '../utils/validation'
import { ChasseMethodState, chasseActions } from '../types/methods/chasse'

interface Capital {
  initial: number
  current: number
  evolution: {
    amount: number
    percentage: number
  }
}

interface TimerState {
  duration: number
  remaining: number
  isRunning: boolean
}

interface GameLimits {
  maxLoss: number
  targetProfit: number
  betUnit: number
}

interface SessionState {
  isActive: boolean
  hasExpired: boolean
  stoppedBy: 'timer' | 'maxLoss' | 'targetProfit' | null
}

interface SpinHistory {
  number: RouletteNumber
  timestamp: number
  capital: number
  methodId: string | null
}

interface MethodStats {
  wins: number
  losses: number
  profit: number
  spinsCount: number
}

interface MethodConfig {
  betUnit: number;
  isConfigured: boolean;
}

interface StoreState {
  capital: Capital
  timer: TimerState
  limits: GameLimits
  session: SessionState
  methods: Method[]
  activeMethodId: string | null
  cyclicMode: boolean
  history: SpinHistory[]
  stats: Record<string, MethodStats>
  isPlaying: boolean
  methodCapital: Record<string, MethodCapital>
  methodConfigs: Record<string, MethodConfig>
  chasseState: ChasseMethodState;
  validationErrors: string[];
  sessionLocked: boolean;
  getSortedMethods: () => Method[]
}

interface StoreActions {
  setCapital: (type: 'initial' | 'current', value: string | number) => void;
  setTimer: (value: number) => void
  startTimer: () => void
  toggleMethod: (id: string) => void
  setActiveMethod: (id: string | null) => void
  toggleCyclicMode: () => void
  togglePlay: () => void
  addSpin: (number: RouletteNumber) => void
  reset: () => void
  updateLimits: (updates: Partial<GameLimits>) => void
  setMaxLoss: (value: number) => void
  setTargetProfit: (value: number) => void
  initializeMethodCapital: (methodId: string) => void
  updateMethodCapital: (methodId: string, current: number) => void
  validateMethodCapital: (methodId: string, final: number) => void
  updateMethodConfig: (methodId: string, config: Partial<MethodConfig>) => void
  getMethodConfig: (methodId: string) => MethodConfig | undefined
  initializeChasse: () => void
  updateChasseState: (number: RouletteNumber) => void
  validateStart: () => string[];
  reorderMethods: (startIndex: number, endIndex: number) => void;
}

const DEFAULT_CAPITAL: Capital = {
  initial: 30,
  current: 30,
  evolution: {
    amount: 0,
    percentage: 0
  }
}

const DEFAULT_TIMER: TimerState = {
  duration: 20,
  remaining: 20,
  isRunning: false
}

const DEFAULT_LIMITS: GameLimits = {
  maxLoss: 10,
  targetProfit: 5,
  betUnit: 0.2
}

const DEFAULT_SESSION: SessionState = {
  isActive: false,
  hasExpired: false,
  stoppedBy: null
}

const DEFAULT_METHOD_CONFIG: MethodConfig = {
  betUnit: 0.2,
  isConfigured: false
}

const DEFAULT_METHODS: Method[] = [
  { id: 'chasse', name: 'Chasse aux Numéros', active: false, order: 0 },
  { id: 'sdc', name: 'SDC', active: false, order: 1 },
  { id: 'sixains', name: 'Tiers sur Sixains', active: false, order: 2 }
]

const DEFAULT_CHASSE_STATE: ChasseMethodState = {
  phase: 'observation',
  observationCount: 0,
  playCount: 0,
  remainingObservationTours: 24,
  remainingPlayTours: 12,
  numberCounts: {},
  selectedNumbers: []
}

export const useRouletteStore = create<StoreState & StoreActions>((set, get) => ({
  // État initial
  capital: DEFAULT_CAPITAL,
  timer: DEFAULT_TIMER,
  limits: DEFAULT_LIMITS,
  session: DEFAULT_SESSION,
  isPlaying: false,
  history: [],
  activeMethodId: null,
  methods: DEFAULT_METHODS,
  methodCapital: {},
  chasseState: {
    ...DEFAULT_CHASSE_STATE,
    numberCounts: {},
    selectedNumbers: []
  },
  stats: {},
  methodConfigs: {},
  cyclicMode: true,
  validationErrors: [] as string[],
  sessionLocked: false,
  

  // Actions sur le capital
  setCapital: (type: 'initial' | 'current', value: string | number) => {
    set((state: StoreState) => {
      const numericValue = typeof value === 'string' ? 
        parseFloat(value) || 0 : 
        value;
  
      const newCapital = {
        ...state.capital,
        [type]: value
      }
  
      if (type === 'current') {
        const initialValue = typeof state.capital.initial === 'string' ? 
          parseFloat(state.capital.initial) || 0 : 
          state.capital.initial;
  
        newCapital.evolution = {
          amount: numericValue - initialValue,
          percentage: ((numericValue - initialValue) / initialValue) * 100
        }
      }
  
      return { capital: newCapital }
    })
  },

  setTimer: (value: number) => {
    set((state: StoreState) => ({
      timer: { ...state.timer, duration: value, remaining: value }
    }))
  },

  startTimer: () => {
    const interval = setInterval(() => {
      const state = get()
      
      const shouldStop = () => {
        const { capital, limits } = state
        const lossPercentage = ((capital.initial - capital.current) / capital.initial) * 100
        const profitPercentage = ((capital.current - capital.initial) / capital.initial) * 100
        
        if (state.timer.remaining <= 0) return 'timer'
        if (lossPercentage >= limits.maxLoss) return 'maxLoss'
        if (profitPercentage >= limits.targetProfit) return 'targetProfit'
        return null
      }

      const stopReason = shouldStop()
      if (stopReason) {
        clearInterval(interval)
        set({
          isPlaying: false,
          session: {
            isActive: false,
            hasExpired: true,
            stoppedBy: stopReason
          }
        })
        return
      }

      set((state: StoreState) => ({
        timer: { ...state.timer, remaining: state.timer.remaining - 1 }
      }))
    }, 60000)
  },

  toggleMethod: (id: string) => {
    set((state: StoreState) => ({
      methods: state.methods.map((m: Method) => 
        m.id === id ? { ...m, active: !m.active } : m
      )
    }))
  },

  setActiveMethod: (id: string | null) => {
    set({ activeMethodId: id })
  },

  toggleCyclicMode: () => {
    set((state: StoreState) => ({ cyclicMode: !state.cyclicMode }))
  },

  // Ajouter la fonction validateStart dans le store
  validateStart: () => {
    const errors: string[] = [];
    const state = get();

    if (state.capital.initial <= 0) errors.push('Le capital initial doit être positif');
    if (state.timer.duration <= 0) errors.push('Le temps doit être positif');
    if (state.limits.maxLoss <= 0) errors.push('La perte maximale doit être positive');
    if (state.limits.targetProfit <= 0) errors.push('L\'objectif de gain doit être positif');

    const activeMethods = state.methods.filter((m: Method) => m.active);
    if (activeMethods.length === 0) {
      errors.push('Sélectionnez au moins une méthode');
    } else {
      const unconfiguredMethods = activeMethods.filter((m: Method) => 
        !state.methodConfigs[m.id]?.isConfigured
      );
      if (unconfiguredMethods.length > 0) {
        errors.push(`Configurez les méthodes suivantes : ${unconfiguredMethods.map((m: Method) => m.name).join(', ')}`);
      }
    }

    return errors;
  },

// Modifier le togglePlay existant
togglePlay: () => {
  const state = get()
  if (!state.sessionLocked) {
    const errors = get().validateStart();
    if (errors.length > 0) {
      set({ validationErrors: errors });
      return;
    }

    if (!state.activeMethodId) {
      const firstMethod = state.methods.find(m => m.active);
      if (firstMethod) {
        set({ activeMethodId: firstMethod.id });
      }
    }

    const chasseMethod = state.methods.find(m => m.id === 'chasse' && m.active)      
    if (chasseMethod) {       
      get().initializeChasse()
    }

    // Si historique vide, on vide les numéros
    if (state.history.length === 0) {
      set({
        chasseState: {
          ...DEFAULT_CHASSE_STATE,
          numberCounts: {},
          selectedNumbers: []
        }
      })
    }

    set({ 
      isPlaying: true,
      sessionLocked: true,
      validationErrors: [],
      session: { 
        isActive: true, 
        hasExpired: false,
        stoppedBy: null
      }
    })
    get().startTimer()
  }
},

  addSpin: (number: RouletteNumber) => {
    const validNumber = validateRouletteNumber(number)
    const { activeMethodId, capital } = get()
    
    // Ajoute à l'historique général
    set((state: StoreState) => ({
      history: [
        ...state.history,
        {
          number: validNumber,
          timestamp: Date.now(),
          capital: capital.current,
          methodId: activeMethodId
        }
      ]
    }))
  
    // Si la méthode Chasse est active, met à jour son état
    const chasseMethod = get().methods.find(m => m.id === 'chasse' && m.active)
    if (chasseMethod && get().isPlaying) {
      get().updateChasseState(validNumber)
    }
  
    // Mise à jour des stats si une méthode est active
    if (activeMethodId) {
      set((state: StoreState) => {
        const currentStats = state.stats[activeMethodId] || {
          wins: 0,
          losses: 0,
          profit: 0,
          spinsCount: 0
        }
        
        return {
          stats: {
            ...state.stats,
            [activeMethodId]: {
              ...currentStats,
              spinsCount: currentStats.spinsCount + 1
            }
          }
        }
      })
    }
  },

  reset: () => {
    const currentStats = get().stats;
    const currentConfigs = get().methodConfigs;
  
    set({
      capital: { ...DEFAULT_CAPITAL },
      timer: { ...DEFAULT_TIMER },
      limits: { ...DEFAULT_LIMITS },
      session: { ...DEFAULT_SESSION },
      isPlaying: false,
      history: [],
      activeMethodId: null,
      methods: DEFAULT_METHODS,
      chasseState: {
        ...DEFAULT_CHASSE_STATE,
        numberCounts: {},
        selectedNumbers: []
      },
      stats: currentStats,
      methodConfigs: currentConfigs,
      cyclicMode: true,
      sessionLocked: false,
    })
  },

  updateLimits: (updates: Partial<GameLimits>) => {
    set((state: StoreState) => ({
      limits: { ...state.limits, ...updates }
    }))
  },

  setMaxLoss: (value: number) => {
    set((state: StoreState) => ({
      limits: { ...state.limits, maxLoss: value }
    }))
  },
  
  setTargetProfit: (value: number) => {
    set((state: StoreState) => ({
      limits: { ...state.limits, targetProfit: value }
    }))
  },

  initializeMethodCapital: (methodId: string) => {
    set((state: StoreState) => ({
      methodCapital: {
        ...state.methodCapital,
        [methodId]: {
          initial: state.capital.current,
          current: state.capital.current
        }
      }
    }))
  },

  updateMethodCapital: (methodId: string, current: number) => {
    set((state: StoreState) => ({
      methodCapital: {
        ...state.methodCapital,
        [methodId]: {
          ...state.methodCapital[methodId],
          current
        }
      }
    }))
  },

  validateMethodCapital: (methodId: string, final: number) => {
    set((state: StoreState) => ({
      methodCapital: {
        ...state.methodCapital,
        [methodId]: {
          ...state.methodCapital[methodId],
          validated: final,
          current: final
        }
      },
      capital: {
        ...state.capital,
        current: final
      }
    }))
  },

  updateMethodConfig: (methodId: string, config: Partial<MethodConfig>) => {
    const currentConfig = get().methodConfigs[methodId] || DEFAULT_METHOD_CONFIG;
    const newConfig = { 
      ...currentConfig, 
      ...config,
      isConfigured: true 
    };

    set((state) => ({
      methodConfigs: {
        ...state.methodConfigs,
        [methodId]: newConfig
      }
    }));

    // Sauvegarde dans localStorage
    localStorage.setItem('methodConfigs', JSON.stringify({
      ...get().methodConfigs,
      [methodId]: newConfig
    }));
  },

  getMethodConfig: (methodId: string) => {
    return get().methodConfigs[methodId] || DEFAULT_METHOD_CONFIG;
  },

  getSortedMethods: () => {
    const state = get();
    return [...state.methods].sort((a, b) => {
      if (a.active === b.active) return a.order - b.order; // Préserve l'ordre existant
      return a.active ? -1 : 1; // Méthodes sélectionnées en premier
    });
  },

  reorderMethods: (startIndex: number, endIndex: number) => {
    set((state) => {
      const sortedMethods = [...state.methods];  // Copie pour ne pas muter directement
      const [removed] = sortedMethods.splice(startIndex, 1);
      sortedMethods.splice(endIndex, 0, removed);
      
      // Mise à jour des ordres uniquement pour les méthodes sélectionnées
      const updatedMethods = sortedMethods.map((method, index) => ({
        ...method,
        order: index
      }));
  
      return { methods: updatedMethods };
    });
  },

  // Actions pour la méthode Chasse
  initializeChasse: () => {
    const history = get().history
    const state = {...DEFAULT_CHASSE_STATE}
    if (history.length > 0) {
      chasseActions.analyzeHistory(state, history.map(h => h.number))
    }
    set({ chasseState: state })
  },

  updateChasseState: (number: RouletteNumber) => {
    const state = {...get().chasseState}
    chasseActions.addNumber(state, number) // on utilise directement le number passé
    set({ chasseState: state })
  }
}))

// Au démarrage, charger les configs depuis localStorage
const savedConfigs = localStorage.getItem('methodConfigs');
if (savedConfigs) {
  useRouletteStore.setState({ 
    methodConfigs: JSON.parse(savedConfigs) 
  });
}