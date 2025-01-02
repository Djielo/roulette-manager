export type MethodType = 'ChasseNumbers' | 'SDC' | 'SixainThirds';

export interface Method {
  id: string;
  name: string;
  selected: boolean;
  order: number;
}

export interface MethodConfig {
  betUnit: number;
  riskLevel?: 'low' | 'medium' | 'high';
  progressionType?: 'classic' | 'progressive';
  // Les configurations spécifiques à chaque méthode seront étendues à partir de cette interface
}