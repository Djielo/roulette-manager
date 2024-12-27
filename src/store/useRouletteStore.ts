// src/store/useRouletteStore.ts
import { create } from 'zustand'
import { Method } from '../types/methods'
import { RouletteNumber } from '../types/roulette'
import { MethodCapital } from '../types/manager'
import { validateRouletteNumber } from '../utils/validation'

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
}

interface StoreActions {
  setCapital: (type: 'initial' | 'current', value: number) => void
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

const DEFAULT_METHODS: Method[] = [
  { id: 'chase', name: 'Chasse aux Numéros', active: false, order: 0 },
  { id: 'sdc', name: 'SDC', active: false, order: 1 },
  { id: 'sixains', name: 'Tiers sur Sixains', active: false, order: 2 }
]

export const useRouletteStore = create<StoreState & StoreActions>((set, get) => ({
  // État initial
  capital: DEFAULT_CAPITAL,
  timer: DEFAULT_TIMER,
  limits: DEFAULT_LIMITS,
  session: DEFAULT_SESSION,
  methods: DEFAULT_METHODS,
  activeMethodId: null,
  cyclicMode: false,
  history: [],
  stats: {},
  isPlaying: false,
  methodCapital: {},

  // Actions sur le capital
  setCapital: (type: 'initial' | 'current', value: number) => {
    set((state: StoreState) => {
      const newCapital = {
        ...state.capital,
        [type]: value
      }
      
      if (type === 'current') {
        newCapital.evolution = {
          amount: value - state.capital.initial,
          percentage: ((value - state.capital.initial) / state.capital.initial) * 100
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
    }, 1000)
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

  togglePlay: () => {
    const state = get()
    if (!state.isPlaying) {
      set({ 
        isPlaying: true,
        session: { 
          isActive: true, 
          hasExpired: false,
          stoppedBy: null
        }
      })
      get().startTimer()
    } else {
      set({ 
        isPlaying: false,
        session: {
          isActive: false,
          hasExpired: false,
          stoppedBy: null
        }
      })
    }
  },

  addSpin: (number: RouletteNumber) => {
    const validNumber = validateRouletteNumber(number)
    const { activeMethodId, capital } = get()
    
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
    set({
      capital: { ...DEFAULT_CAPITAL },
      timer: { ...DEFAULT_TIMER },
      session: { ...DEFAULT_SESSION },
      isPlaying: false,
      history: [],
      activeMethodId: null,
      stats: {}
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
  }
}))