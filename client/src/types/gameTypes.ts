import type { ICONS } from '../constants/icons.js';

export interface Choice {
  id: number;
  name: keyof typeof ICONS;
}

export interface GameResult {
  id: string;
  user: string;
  computer: string;
  outcome: OutcomeType;
}

export type OutcomeType = 'win' | 'lose' | 'tie';

export interface Score {
  win: number;
  lose: number;
  tie: number;
}
