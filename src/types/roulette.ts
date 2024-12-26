export type RouletteNumber = 0 | 37 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 ;

export interface BetPosition {
  type: 'number' | 'dozen' | 'column' | 'sixain' | 'simple';
  value: number | string;
  amount: number;
}

export interface RouletteHistory {
  number: RouletteNumber;
  timestamp: number;
}