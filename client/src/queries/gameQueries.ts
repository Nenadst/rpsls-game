import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchChoices, fetchRandomChoice, playGame } from '../api/gameApi';

import type { Choice, GameResult, MatchResult, MatchScore, OutcomeType } from '../types/gameTypes';

type UsePlayGameOptions = {
  choices: Choice[];
  setResult: React.Dispatch<React.SetStateAction<GameResult | null>>;
  setHistory: React.Dispatch<React.SetStateAction<GameResult[]>>;
  setScore: React.Dispatch<React.SetStateAction<{ win: number; lose: number; tie: number }>>;
  setMatchScore: React.Dispatch<React.SetStateAction<MatchScore>>;
  setMatchResult: React.Dispatch<React.SetStateAction<MatchResult | null>>;
  matchEndProcessedRef: React.MutableRefObject<boolean>;
  playSound: (type: string) => void;
  triggerConfetti: () => void;
};

interface GameApiResponse {
  id: number;
  player: number;
  computer: number;
  results: OutcomeType;
}

const createRoundResult = (res: GameApiResponse, choices: Choice[]): GameResult => {
  const userChoice = choices.find((c) => c.id === res.player);
  const computerChoice = choices.find((c) => c.id === res.computer);
  const outcome: OutcomeType = res.results;

  return {
    id: res.id.toString(),
    user: userChoice?.name || '',
    computer: computerChoice?.name || '',
    outcome,
  };
};

const updateGameHistory = (
  roundResult: GameResult,
  setResult: React.Dispatch<React.SetStateAction<GameResult | null>>,
  setHistory: React.Dispatch<React.SetStateAction<GameResult[]>>
) => {
  setResult(roundResult);
  setHistory((prev) => [roundResult, ...prev.slice(0, 9)]);
};

const saveMatchToLocalStorage = (winner: 'player' | 'computer') => {
  if (winner === 'player') {
    const playerName = localStorage.getItem('playerName') || 'Player';
    const currentMatches = parseInt(localStorage.getItem(`matches_${playerName}`) || '0');
    localStorage.setItem(`matches_${playerName}`, (currentMatches + 1).toString());
  }
};

const handleMatchEnd = (
  winner: 'player' | 'computer',
  finalScore: { win: number; lose: number; tie: number },
  setMatchResult: React.Dispatch<React.SetStateAction<MatchResult | null>>,
  setMatchScore: React.Dispatch<React.SetStateAction<MatchScore>>,
  playSound: (type: string) => void,
  triggerConfetti: () => void
) => {
  setMatchResult({
    winner,
    finalScore,
  });

  setMatchScore((prevMatch) => {
    const newMatchScore =
      winner === 'player'
        ? { ...prevMatch, playerMatches: prevMatch.playerMatches + 1 }
        : { ...prevMatch, computerMatches: prevMatch.computerMatches + 1 };

    return newMatchScore;
  });

  saveMatchToLocalStorage(winner);

  if (winner === 'player') {
    triggerConfetti();
    playSound('win');
  } else {
    playSound('lose');
  }
};

const processGameRound = (
  outcome: OutcomeType,
  setScore: React.Dispatch<React.SetStateAction<{ win: number; lose: number; tie: number }>>,
  setMatchResult: React.Dispatch<React.SetStateAction<MatchResult | null>>,
  setMatchScore: React.Dispatch<React.SetStateAction<MatchScore>>,
  matchEndProcessedRef: React.MutableRefObject<boolean>,
  playSound: (type: string) => void,
  triggerConfetti: () => void
) => {
  setScore((prev) => {
    const newScore = {
      ...prev,
      [outcome]: prev[outcome] + 1,
    };

    if ((newScore.win >= 10 || newScore.lose >= 10) && !matchEndProcessedRef.current) {
      matchEndProcessedRef.current = true;
      const winner = newScore.win >= 10 ? 'player' : 'computer';

      handleMatchEnd(winner, newScore, setMatchResult, setMatchScore, playSound, triggerConfetti);
    } else {
      playSound(outcome);
    }

    return newScore;
  });
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
  setMatchScore,
  setMatchResult,
  matchEndProcessedRef,
  playSound,
  triggerConfetti,
}: UsePlayGameOptions) =>
  useMutation({
    mutationFn: playGame,
    onSuccess: (res) => {
      const roundResult = createRoundResult(res, choices);
      const outcome: OutcomeType = res.results;

      updateGameHistory(roundResult, setResult, setHistory);
      processGameRound(
        outcome,
        setScore,
        setMatchResult,
        setMatchScore,
        matchEndProcessedRef,
        playSound,
        triggerConfetti
      );
    },
  });
