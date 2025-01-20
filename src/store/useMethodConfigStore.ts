// src/store/useMethodConfigStore.ts
import { create } from 'zustand';

interface MethodConfig {
  betUnit: number;
  isConfigured: boolean;
}

interface StoreState {
  methodConfigs: Record<string, MethodConfig>;
}

interface StoreActions {
  updateMethodConfig: (methodId: string, config: Partial<MethodConfig>) => void;
  getMethodConfig: (methodId: string) => MethodConfig | undefined;
}

const DEFAULT_METHOD_CONFIG: MethodConfig = {
  betUnit: 0.2,
  isConfigured: false,
};

export const useMethodConfigStore = create<StoreState & StoreActions>((set, get) => ({
  methodConfigs: {},

  updateMethodConfig: (methodId, config) => {
    const currentConfig = get().methodConfigs[methodId] || DEFAULT_METHOD_CONFIG;
    const newConfig = {
      ...currentConfig,
      ...config,
      isConfigured: true,
    };

    set((state) => ({
      methodConfigs: {
        ...state.methodConfigs,
        [methodId]: newConfig,
      },
    }));

    localStorage.setItem('methodConfigs', JSON.stringify({
      ...get().methodConfigs,
      [methodId]: newConfig,
    }));
  },

  getMethodConfig: (methodId) => {
    return get().methodConfigs[methodId] || DEFAULT_METHOD_CONFIG;
  },
}));

// Au démarrage, charger les configs depuis localStorage
const savedConfigs = localStorage.getItem('methodConfigs');
if (savedConfigs) {
  useMethodConfigStore.setState({
    methodConfigs: JSON.parse(savedConfigs),
  });
}