export interface GameSettings {
  initialCapital: number;
  currentCapital: number;
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
}