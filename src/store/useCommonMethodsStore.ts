import { create } from "zustand";
import { MethodStats } from "../types/manager";
import { Method } from "../types/methodsTypes";
import { RouletteNumber } from "../types/roulette";
import { useAppManagerStore } from "./useAppManagerStore";
import { useChasseStore } from "./useChasseStore";

interface SpinHistory {
  number: RouletteNumber;
  timestamp: number;
  capital: number;
  methodId: string | null;
}

export interface StoreState {
  history: SpinHistory[];
  stats: Record<string, MethodStats>;
  methods: Method[];
  activeMethodId: string | null;
  cyclicMode: boolean;
  pendingMethods: string[];
}

export interface StoreActions {
  addSpin: (number: RouletteNumber) => void;
  setActiveMethod: (id: string | null) => void;
  toggleCyclicMode: () => void;
  toggleMethod: (id: string) => void;
  reorderMethods: (startIndex: number, endIndex: number) => void;
  setPendingMethods: (methods: string[]) => void;
  getSortedMethods: () => Method[];
}

const DEFAULT_METHODS: Method[] = [
  { id: "chasse", name: "Chasse aux Numéros", selected: false, order: 0 },
  { id: "sdc", name: "SDC", selected: false, order: 1 },
  { id: "sixains", name: "Tiers sur Sixains", selected: false, order: 2 },
];

export const useCommonMethodsStore = create<StoreState & StoreActions>(
  (set, get) => ({
    history: [],
    stats: {},
    methods: DEFAULT_METHODS,
    activeMethodId: null,
    cyclicMode: true,
    pendingMethods: [],

    addSpin: (number) => {
      const { activeMethodId } = get();
      set((state) => ({
        history: [
          ...state.history,
          {
            number,
            timestamp: Date.now(),
            capital: useAppManagerStore.getState().capital.current,
            methodId: activeMethodId,
          },
        ],
      }));

      if (activeMethodId) {
        set((state) => {
          const currentStats = state.stats[activeMethodId] || {
            wins: 0,
            losses: 0,
            profit: 0,
            spinsCount: 0,
          };

          return {
            stats: {
              ...state.stats,
              [activeMethodId]: {
                ...currentStats,
                spinsCount: currentStats.spinsCount + 1,
              },
            },
          };
        });
      }

      // Appeler la logique spécifique à la méthode "Chasse" si elle est active
      const isChasseActive = get().activeMethodId === "chasse";
      if (isChasseActive && useAppManagerStore.getState().isPlaying) {
        const chasseStore = useChasseStore.getState();
        chasseStore.updateChasseState(number);

        // Décrémenter le compteur de tours en phase de jeu si nécessaire
        if (chasseStore.chasseState.phase === "play") {
          chasseStore.decrementPlayTours();
        }
      }
    },

    setActiveMethod: (id) => {
      set({ activeMethodId: id });
    },

    toggleCyclicMode: () => {
      set((state) => ({ cyclicMode: !state.cyclicMode }));
    },

    toggleMethod: (id) => {
      set((state) => ({
        methods: state.methods.map((m) =>
          m.id === id ? { ...m, selected: !m.selected } : m
        ),
      }));
    },

    reorderMethods: (startIndex, endIndex) => {
      set((state) => {
        const sortedMethods = [...state.methods];
        const pendingMethods = state.pendingMethods;

        const selectedMethods = sortedMethods.filter((m) =>
          pendingMethods.includes(m.id)
        );
        const unselectedMethods = sortedMethods.filter(
          (m) => !pendingMethods.includes(m.id)
        );

        const [removed] = selectedMethods.splice(startIndex, 1);
        selectedMethods.splice(endIndex, 0, removed);

        const reorderedMethods = [
          ...selectedMethods.map((m, i) => ({ ...m, order: i })),
          ...unselectedMethods,
        ];

        return { methods: reorderedMethods };
      });
    },

    setPendingMethods: (methods) => {
      set({ pendingMethods: methods });
    },

    getSortedMethods: () => {
      const state = get();
      return [...state.methods].sort((a, b) => {
        const aSelected = state.pendingMethods.includes(a.id);
        const bSelected = state.pendingMethods.includes(b.id);

        if (aSelected === bSelected) return a.order - b.order;
        return aSelected ? -1 : 1;
      });
    },
  })
);
