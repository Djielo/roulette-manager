import { create } from 'zustand'
import { GameSettings, SessionStats } from '../types/manager'
import { Method } from '../types/methods'
import { RouletteHistory } from '../types/roulette'
import { validateRouletteNumber } from '../utils/validation'

interface State {
  // Paramètres du jeu
  settings: GameSettings
  methods: Method[]
  activeMethodId: string | null
  history: RouletteHistory[]
  isPlaying: boolean
  stats: SessionStats
  
  // Actions
  updateSettings: (settings: Partial<GameSettings>) => void
  setMethods: (methods: Method[]) => void
  updateMethod: (methodId: string, updates: Partial<Method>) => void
  setActiveMethod: (methodId: string | null) => void
  addToHistory: (number: number) => void
  clearHistory: () => void
  togglePlay: () => void
  resetSession: () => void
}

const DEFAULT_SETTINGS: GameSettings = {
  initialCapital: 30,
  currentCapital: 30,
  betUnit: 0.2,
  maxLoss: 10,
  targetProfit: 5,
  timer: 20,
  isCyclicMode: false,
}

const DEFAULT_STATS: SessionStats = {
  profit: 0,
  profitPercentage: 0,
  totalSpins: 0,
  methodStats: {},
}

export const useStore = create<State>((set) => ({
  settings: DEFAULT_SETTINGS,
  methods: [],
  activeMethodId: null,
  history: [],
  isPlaying: false,
  stats: DEFAULT_STATS,

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  setMethods: (methods) => set({ methods }),

  updateMethod: (methodId, updates) =>
    set((state) => ({
      methods: state.methods.map((method) =>
        method.id === methodId ? { ...method, ...updates } : method
      ),
    })),

  setActiveMethod: (methodId) => set({ activeMethodId: methodId }),

  addToHistory: (number: number) =>
    set((state) => {
      const validNumber = validateRouletteNumber(number)
      return {
        history: [...state.history, { number: validNumber, timestamp: Date.now() }],
      }
    }),

  clearHistory: () => set({ history: [] }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  resetSession: () => set({
    settings: DEFAULT_SETTINGS,
    history: [],
    stats: DEFAULT_STATS,
  }),
}))