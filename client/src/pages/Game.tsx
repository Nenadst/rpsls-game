import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';

import { fetchChoices, fetchRandomChoice, playGame } from '../api/gameApi';
import { ICONS, type ChoiceName } from '../constants/icons';
import styles from './Game.module.css';

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

export default function Game() {
  const [result, setResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [score, setScore] = useState<Score>({ win: 0, lose: 0, tie: 0 });
  const [lastClickTime, setLastClickTime] = useState(0);
  const [shake, setShake] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showSlider, setShowSlider] = useState(false);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const {
    data: choices = [],
    isLoading,
    isError,
  } = useQuery<Choice[]>({
    queryKey: ['choices'],
    queryFn: fetchChoices,
  });

  const { refetch: refetchRandomChoice, isFetching: isFetchingRandom } = useQuery({
    queryKey: ['randomChoice'],
    queryFn: fetchRandomChoice,
    enabled: false,
  });

  const mutation = useMutation({
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

      playSound(outcome);
    },
  });

  const handlePlay = (id: number) => {
    const now = Date.now();
    if (now - lastClickTime < 500) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
    setLastClickTime(now);
    playSound('tap');
    mutation.mutate(id);
  };

  const handleReset = () => {
    setResult(null);
    setHistory([]);
    setScore({ win: 0, lose: 0, tie: 0 });
  };

  const handleRandomChoicePlay = async () => {
    try {
      const { data } = await refetchRandomChoice();
      if (data?.id) {
        handlePlay(data.id);
      }
    } catch (err) {
      console.error('Failed to play random choice', err);
    }
  };

  const playSound = (type: string) => {
    if (!soundOn) return;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = volume;
    audio.play().catch(console.warn);
    currentAudioRef.current = audio;
  };

  if (isLoading) return <p>Loading choices...</p>;
  if (isError) return <p>Error loading choices</p>;

  return (
    <div className={styles.container}>
      <div className={styles.topColumn}>
        <h1 className={styles.gameTitle}>Rock Paper Scissors Lizard Spock</h1>
        <div className={styles.soundWrapper}>
          <div
            className={styles.soundIconWithSlider}
            onMouseEnter={() => setShowSlider(true)}
            onMouseLeave={() => setShowSlider(false)}
          >
            <button
              className={soundOn ? styles.soundOn : styles.soundOff}
              onClick={() => setSoundOn((prev) => !prev)}
            >
              {soundOn ? <HiVolumeUp size={24} /> : <HiVolumeOff size={24} />}
            </button>

            {showSlider && (
              <div className={styles.volumeSlider}>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.mainWrapper}>
        <div className={styles.mainContent}>
          <p className={styles.selectMoveText}>Select your move:</p>
          <div className={styles.buttons}>
            {choices.map((choice) => (
              <button
                key={choice.id}
                className={`${styles.choiceButton} ${shake ? styles.shake : ''}`}
                onClick={() => handlePlay(choice.id)}
                disabled={mutation.isPending}
              >
                <img
                  src={ICONS[choice.name as ChoiceName]}
                  alt={choice.name}
                  className={styles.choiceIcon}
                />
                <span className={styles.choiceLabel}>{choice.name}</span>
              </button>
            ))}
            <button
              className={`${styles.choiceButton} ${styles.randomChoiceButton}`}
              onClick={handleRandomChoicePlay}
              disabled={isFetchingRandom || mutation.isPending}
            >
              🎲
              <span className={styles.choiceLabel}>
                {isFetchingRandom ? 'Picking...' : 'Random'}
              </span>
            </button>
          </div>

          <div className={styles.resultBox}>
            <h2>Result</h2>

            {result && (
              <div className={styles.vsBox}>
                <div className={styles.playerSide}>
                  <p>You Chose</p>
                  <img
                    src={ICONS[result.user as ChoiceName]}
                    alt={result.user}
                    className={styles.resultIcon}
                  />
                  <p className={styles.resultLabel}>{result.user}</p>
                </div>

                <div className={styles.vsText}>VS</div>

                <div className={styles.computerSide}>
                  <p>Computer Chose</p>
                  <img
                    src={ICONS[result.computer as ChoiceName]}
                    alt={result.computer}
                    className={styles.resultIcon}
                  />
                  <p className={styles.resultLabel}>{result.computer}</p>
                </div>
              </div>
            )}

            <div className={styles.liveScore}>
              <p>
                🏆 Wins: <span>{score.win}</span> | 💀 Losses: <span>{score.lose}</span> | 🤝 Ties:{' '}
                <span>{score.tie}</span>
              </p>
              <button
                className={styles.resetButton}
                onClick={handleReset}
                disabled={!result && history.length === 0}
              >
                Reset Game
              </button>
            </div>

            {result && (
              <p className={`${styles.outcome} ${styles[result.outcome]}`}>
                {result.outcome.toUpperCase()}
              </p>
            )}
          </div>
        </div>

        <div className={styles.scoreboard}>
          <h3>Scoreboard (last 10 rounds)</h3>
          {history.length > 0 ? (
            <ul>
              {history.map((h) => (
                <li key={h.id}>
                  You: <strong>{h.user}</strong> vs Computer: <strong>{h.computer}</strong> →{' '}
                  <strong>{h.outcome.toUpperCase()}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rounds played yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
