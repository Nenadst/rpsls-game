import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchChoices, fetchRandomChoice, playGame } from '../api/gameApi';
import type { Choice, GameResult, OutcomeType } from '../types/gameTypes';

type UsePlayGameOptions = {
  choices: Choice[];
  setResult: React.Dispatch<React.SetStateAction<GameResult | null>>;
  setHistory: React.Dispatch<React.SetStateAction<GameResult[]>>;
  setScore: React.Dispatch<React.SetStateAction<{ win: number; lose: number; tie: number }>>;
  playSound: (type: string) => void;
  triggerConfetti: () => void;
};

export const useChoicesQuery = () =>
  useQuery<Choice[]>({
    queryKey: ['choices'],
    queryFn: fetchChoices,
  });

export const useRandomChoiceQuery = () =>
  useQuery({
    queryKey: ['randomChoice'],
    queryFn: fetchRandomChoice,
    enabled: false,
  });

export const usePlayGameMutation = ({
  choices,
  setResult,
  setHistory,
  setScore,
  playSound,
  triggerConfetti,
}: UsePlayGameOptions) =>
  useMutation({
    mutationFn: playGame,
    onSuccess: (res) => {
      const userChoice = choices.find((c) => c.id === res.player);
      const computerChoice = choices.find((c) => c.id === res.computer);
      const outcome: OutcomeType = res.results;

      const roundResult: GameResult = {
        id: res.id,
        user: userChoice?.name || '',
        computer: computerChoice?.name || '',
        outcome,
      };

      setResult(roundResult);
      setHistory((prev) => [roundResult, ...prev.slice(0, 9)]);
      setScore((prev) => ({
        ...prev,
        [outcome]: prev[outcome] + 1,
      }));

      if (outcome === 'win') triggerConfetti();
      playSound(outcome);
    },
  });
