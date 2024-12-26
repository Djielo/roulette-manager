import { create } from 'zustand'
import { Method } from '../types/methods'

interface TimerState {
  duration: number
  remaining: number
  isRunning: boolean
}

interface SessionState {
  isActive: boolean
  hasExpired: boolean
  stoppedBy: 'timer' | 'maxLoss' | 'targetProfit' | null
}

interface MethodState {
  capital: {
    initial: number
    current: number
    evolution: {
      amount: number
      percentage: number
    }
  }
  timer: TimerState
  limits: {
    maxLoss: number
    targetProfit: number
  }
  session: SessionState
  cyclicMode: boolean
  isPlaying: boolean
  methods: Method[]
  activeMethodId: string | null
  history: {
    number: number,
    timestamp: number,
    capital: number
  }[]

  setCapital: (type: 'initial' | 'current', value: number) => void
  setTimer: (value: number) => void
  setMaxLoss: (value: number) => void
  setTargetProfit: (value: number) => void
  toggleMethod: (id: string) => void
  toggleCyclicMode: () => void
  togglePlay: () => void
  startTimer: () => void
  addSpin: (number: number) => void
  updateEvolution: () => void
  reset: () => void
}

export const useMethodStore = create<MethodState>((set, get) => ({
  capital: {
    initial: 30,
    current: 30,
    evolution: {
      amount: 0,
      percentage: 0
    }
  },
  timer: {
    duration: 20,
    remaining: 20,
    isRunning: false
  },
  limits: {
    maxLoss: 10,
    targetProfit: 5
  },
  session: {
    isActive: false,
    hasExpired: false,
    stoppedBy: null
  },
  cyclicMode: false,
  isPlaying: false,
  methods: [
    { id: 'chase', name: 'Chasse aux Numéros', active: false, order: 0 },
    { id: 'sdc', name: 'SDC', active: false, order: 1 },
    { id: 'sixains', name: 'Tiers sur Sixains', active: false, order: 2 }
  ],
  activeMethodId: null,
  history: [],

  setCapital: (type, value) => set(state => ({
    capital: { 
      ...state.capital, 
      [type]: value,
      evolution: type === 'current' ? {
        amount: value - state.capital.initial,
        percentage: ((value - state.capital.initial) / state.capital.initial) * 100
      } : state.capital.evolution
    }
  })),

  setTimer: (value) => set(state => ({
    timer: { ...state.timer, duration: value, remaining: value }
  })),

  setMaxLoss: (value) => set(state => ({
    limits: { ...state.limits, maxLoss: value }
  })),

  setTargetProfit: (value) => set(state => ({
    limits: { ...state.limits, targetProfit: value }
  })),

  toggleMethod: (id) => set(state => ({
    methods: state.methods.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    )
  })),

  toggleCyclicMode: () => set(state => ({
    cyclicMode: !state.cyclicMode
  })),

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
    }
  },

  startTimer: () => {
    const interval = setInterval(() => {
      const state = get()
      if (state.timer.remaining <= 0) {
        clearInterval(interval)
        set({
          isPlaying: false,
          session: { 
            isActive: false, 
            hasExpired: true,
            stoppedBy: 'timer'
          }
        })
        return
      }

      const lossPercentage = ((state.capital.initial - state.capital.current) / state.capital.initial) * 100
      const profitPercentage = ((state.capital.current - state.capital.initial) / state.capital.initial) * 100

      if (lossPercentage >= state.limits.maxLoss) {
        clearInterval(interval)
        set({
          isPlaying: false,
          session: {
            isActive: false,
            hasExpired: true,
            stoppedBy: 'maxLoss'
          }
        })
        return
      }

      if (profitPercentage >= state.limits.targetProfit) {
        clearInterval(interval)
        set({
          isPlaying: false,
          session: {
            isActive: false,
            hasExpired: true,
            stoppedBy: 'targetProfit'
          }
        })
        return
      }

      set(state => ({
        timer: { ...state.timer, remaining: state.timer.remaining - 1 }
      }))
    }, 1000)
  },

  addSpin: (number) => set(state => ({
    history: [
      ...state.history,
      {
        number,
        timestamp: Date.now(),
        capital: state.capital.current
      }
    ]
  })),

  updateEvolution: () => {
    const { initial, current } = get().capital
    set(state => ({
      capital: {
        ...state.capital,
        evolution: {
          amount: current - initial,
          percentage: ((current - initial) / initial) * 100
        }
      }
    }))
  },

  reset: () => set(state => ({
    capital: { ...state.capital, current: state.capital.initial },
    timer: { duration: state.timer.duration, remaining: state.timer.duration, isRunning: false },
    session: { isActive: false, hasExpired: false, stoppedBy: null },
    isPlaying: false,
    history: [],
    activeMethodId: null
  }))
}))