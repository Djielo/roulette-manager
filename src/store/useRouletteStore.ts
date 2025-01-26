// src/store/useRouletteStore.ts
import { useAppManagerStore } from './useAppManagerStore';
import { useCommonMethodsStore } from './useCommonMethodsStore';
import { useChasseStore } from './useChasseStore';
import { useMethodConfigStore } from './useMethodConfigStore';
import { useMethodCapitalStore } from './useMethodCapitalStore';
import { useMethodManagerStore } from './useMethodManagerStore';
import type { StoreState as AppManagerState, StoreActions as AppManagerActions } from './useAppManagerStore';
import type { StoreState as CommonMethodsState, StoreActions as CommonMethodsActions } from './useCommonMethodsStore';
import type { StoreState as ChasseState, StoreActions as ChasseActions } from './useChasseStore';
import type { StoreState as MethodConfigState, StoreActions as MethodConfigActions } from './useMethodConfigStore';
import type { StoreState as MethodCapitalState, StoreActions as MethodCapitalActions } from './useMethodCapitalStore';
import type { StoreState as MethodManagerState, StoreActions as MethodManagerActions } from './useMethodManagerStore';

type CombinedStore = 
  AppManagerState & AppManagerActions &
  CommonMethodsState & CommonMethodsActions &
  ChasseState & ChasseActions &
  MethodConfigState & MethodConfigActions &
  MethodCapitalState & MethodCapitalActions &
  MethodManagerState & MethodManagerActions;

export const useRouletteStore = (): CombinedStore => {
  const appManager = useAppManagerStore();
  const commonMethods = useCommonMethodsStore();
  const chasse = useChasseStore();
  const methodConfigs = useMethodConfigStore();
  const methodCapital = useMethodCapitalStore();
  const methodManager = useMethodManagerStore();

  // Créer une fonction reset qui coordonne tous les stores
  const reset = () => {
    appManager.reset();
    // Les autres réinitialisations sont gérées dans appManager.reset()
  };

  return {
    ...appManager,
    ...commonMethods,
    ...chasse,
    ...methodConfigs,
    ...methodCapital,
    ...methodManager,
    // Surcharger la fonction reset
    reset,
  };
};