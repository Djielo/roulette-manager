import { Method, MethodConfig } from '../types/methodsTypes';
import { BetPosition } from '../types/roulette';

export interface CombinedStoreState {
  methods: Method[];
  methodConfigs: Record<string, MethodConfig>;
  pendingMethods: string[];
  cyclicMode: boolean;
  deductBets: (methodId: string, bets: BetPosition[]) => void;
  switchToNextMethod: (currentMethodId: string, nextMethodId: string) => void;
} 