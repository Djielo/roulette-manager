export interface GameSettings {
  initialCapital: string | number;
  currentCapital: string | number;
  betUnit: number;
  maxLoss: number;
  targetProfit: number;
  timer: number;
  isCyclicMode: boolean;
}

export interface SessionStats {
  profit: number;
  profitPercentage: number;
  totalSpins: number;
  methodStats: Record<string, MethodStats>;
}

export interface MethodStats {
  wins: number;
  losses: number;
  profit: number;
  spinsCount: number;
}

export interface MethodCapital {
  initial: number      // Capital reçu du manager
  current: number      // Capital évolutif de la méthode
  validated?: number   // Capital validé en fin de méthode
}
