import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { useChoicesQuery, usePlayGameMutation, useRandomChoiceQuery } from '../queries/gameQueries';

import type { GameResult, Score } from '../types/gameTypes';

export function useGameLogic(playSound: (n: string) => void, triggerConfetti: () => void) {
  const [result, setResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [score, setScore] = useState<Score>({ win: 0, lose: 0, tie: 0 });
  const lastClickRef = useRef(0);

  const { data: choices = [], isLoading, isError } = useChoicesQuery();
  const { refetch: refetchRandom, isFetching: isFetchingRandom } = useRandomChoiceQuery();

  const mutation = usePlayGameMutation({
    choices,
    setResult,
    setHistory,
    setScore,
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

  const reset = useCallback(() => {
    setResult(null);
    setHistory([]);
    setScore({ win: 0, lose: 0, tie: 0 });
  }, []);

  return {
    choices,
    result,
    history,
    score,
    isLoading,
    isError,
    isFetchingRandom,
    play,
    playRandom,
    reset,
  };
}
