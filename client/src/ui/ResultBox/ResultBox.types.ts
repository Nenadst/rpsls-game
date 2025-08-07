import type { GameResult, Score, MatchResult } from '../../types/gameTypes';

export interface ResultBoxProps {
  result: GameResult | null;
  score: Score;
  matchResult: MatchResult | null;
  history: GameResult[];
  playerName: string;
  onReset(): void;
  onResetMatch(): void;
}
