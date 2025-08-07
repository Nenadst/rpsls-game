import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { useChoicesQuery, usePlayGameMutation, useRandomChoiceQuery } from '../queries/gameQueries';

import type { GameResult, MatchResult, MatchScore, Score } from '../types/gameTypes';

export function useGameLogic(playSound: (n: string) => void, triggerConfetti: () => void) {
  const [result, setResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [score, setScore] = useState<Score>({ win: 0, lose: 0, tie: 0 });
  const [matchScore, setMatchScore] = useState<MatchScore>({
    playerMatches: 0,
    computerMatches: 0,
  });
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const lastClickRef = useRef(0);
  const matchEndProcessedRef = useRef(false);

  const playerName = localStorage.getItem('playerName') || 'Player';
  const savedMatches = parseInt(localStorage.getItem(`matches_${playerName}`) || '0');

  const { data: choices = [], isLoading, isError } = useChoicesQuery();
  const { refetch: refetchRandom, isFetching: isFetchingRandom } = useRandomChoiceQuery();

  const mutation = usePlayGameMutation({
    choices,
    setResult,
    setHistory,
    setScore,
    setMatchScore,
    setMatchResult,
    matchEndProcessedRef,
    playSound,
    triggerConfetti,
  });

  const play = useCallback(
    (id: number) => {
      const now = Date.now();
      if (now - lastClickRef.current < 500) return;
      lastClickRef.current = now;
      playSound('tap');
      mutation.mutate(id);
    },
    [mutation, playSound]
  );

  const playRandom = useCallback(async () => {
    try {
      const { data } = await refetchRandom();
      if (data?.id) play(data.id);
      else toast.error('Service returned an invalid choice');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch random choice');
    }
  }, [play, refetchRandom]);

  const resetMatch = useCallback(() => {
    setResult(null);
    setHistory([]);
    setScore({ win: 0, lose: 0, tie: 0 });
    setMatchResult(null);
    matchEndProcessedRef.current = false;
  }, []);

  return {
    choices,
    result,
    history,
    score,
    matchScore,
    matchResult,
    savedMatches,
    isLoading,
    isError,
    isFetchingRandom,
    play,
    playRandom,
    resetMatch,
  };
}
