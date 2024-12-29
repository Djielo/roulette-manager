export type BetType = 'simple' | 'number' | 'dozen' | 'column' | 'sixain' | 'carre' | 'transversale' ;
export type SimpleValue = 'ROUGE' | 'NOIR' | 'PAIR' | 'IMPAIR' | '1-18' | '19-36';
export type ColumnValue = 'C1' | 'C2' | 'C3';


export interface Bet {
  type: BetType
  value: number | SimpleValue | ColumnValue
  amount: number
};

export const getSimplePosition = (value: SimpleValue): string => {
  const positions: Record<SimpleValue, string> = {
    '1-18': 'col-start-1 row-start-5',
    'PAIR': 'col-start-2 row-start-5',
    'ROUGE': 'col-start-4 row-start-5 -translate-y-1/2',
    'NOIR': 'col-start-5 row-start-5',
    'IMPAIR': 'col-start-6 row-start-5',
    '19-36': 'col-start-7 row-start-5'
  }
  return positions[value]
};

export const getNumberPosition = (num: number): string => {
  if (num === 0) return 'row-start-1'
  if (num === 37) return 'row-start-2' // Pour le 00
  
  const row = Math.floor((num - 1) / 12)
  const col = ((num - 1) % 12) + 2
  
  return `col-start-${col} row-start-${3 - row}`
};

export type SixainValue =
 | '1-4'
 | '7-10'
 | '13-16'
 | '19-22'
 | '25-28'
 | '31-34';

export type CarreValueHight = 
  | '1-2-4-5'
  | '4-5-7-8'
  | '7-8-10-11'
  | '10-11-13-14'
  | '13-14-16-17'
  | '16-17-19-20'
  | '19-20-22-23'
  | '22-23-25-26'
  | '25-26-28-29'
  | '28-29-31-32'
  | '31-32-34-35';

export type CarreValueLow =
  | '2-3-5-6'
  | '5-6-8-9'
  | '8-9-11-12'
  | '11-12-14-15'
  | '14-15-17-18'
  | '17-18-20-21'
  | '20-21-23-24'
  | '23-24-26-27'
  | '26-27-29-30'
  | '29-30-32-33'
  | '32-33-35-36';

export type TransversaleValue =
  | '1-2-3'
  | '4-5-6'
  | '7-8-9'
  | '10-11-12'
  | '13-14-15'
  | '16-17-18'
  | '19-20-21'
  | '22-23-24'
  | '25-26-27'
  | '28-29-30'
  | '31-32-33'
  | '34-35-36';  