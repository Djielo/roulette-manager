// src/store/useRouletteStore.ts
import { useAppManagerStore } from './useAppManagerStore';
import { useCommonMethodsStore } from './useCommonMethodsStore';
import { useChasseStore } from './useChasseStore';
import { useMethodConfigStore } from './useMethodConfigStore';
import { useMethodCapitalStore } from './useMethodCapitalStore';
import { useMethodManagerStore } from './useMethodManagerStore';

export const useRouletteStore = () => {
  const appManager = useAppManagerStore();
  const commonMethods = useCommonMethodsStore();
  const chasse = useChasseStore();
  const methodConfigs = useMethodConfigStore();
  const methodCapital = useMethodCapitalStore();
  const methodManager = useMethodManagerStore();

  return {
    ...appManager,
    ...commonMethods,
    ...chasse,
    ...methodConfigs,
    ...methodCapital,
    ...methodManager,
  };
};