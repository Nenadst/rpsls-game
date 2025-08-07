import type { GameResult, Score } from '../../types/gameTypes';

export interface ScoreboardProps {
  history: GameResult[];
  score: Score;
  savedMatches: number;
}
