import type { GameResult, Score } from '../../types/gameTypes';

export interface ResultBoxProps {
  result: GameResult | null;
  score: Score;
  history: GameResult[];
  onReset(): void;
}
