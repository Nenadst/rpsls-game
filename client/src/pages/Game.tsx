import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import styles from './Game.module.css';

import { ICONS, type ChoiceName } from '../constants/icons';
import { useChoicesQuery, usePlayGameMutation, useRandomChoiceQuery } from '../queries/gameQueries';
import type { GameResult, Score } from '../types/gameTypes';

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

  const { data: choices = [], isLoading, isError } = useChoicesQuery();

  const { refetch: refetchRandomChoice, isFetching: isFetchingRandom } = useRandomChoiceQuery();

  const mutation = usePlayGameMutation({
    choices,
    setResult,
    setHistory,
    setScore,
    playSound,
    triggerConfetti,
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

  function triggerConfetti() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  function playSound(type: string) {
    if (!soundOn) return;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = volume;
    audio.play().catch(console.warn);

    currentAudioRef.current = audio;
  }

  if (isLoading) return <p>Loading choices...</p>;
  if (isError) return <p>Error loading choices</p>;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, transform: 'scale(0.97)' }}
      animate={{ opacity: 1, transform: 'scale(1)' }}
      transition={{ duration: 0.5 }}
    >
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
              <motion.button
                key={choice.id}
                className={`${styles.choiceButton} ${shake ? styles.shake : ''}`}
                onClick={() => handlePlay(choice.id)}
                disabled={mutation.isPending}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95, rotate: [0, -5, 5, -3, 0] }}
              >
                <img
                  src={ICONS[choice.name as ChoiceName]}
                  alt={choice.name}
                  className={styles.choiceIcon}
                />
                <span className={styles.choiceLabel}>{choice.name}</span>
              </motion.button>
            ))}
            <motion.button
              className={`${styles.choiceButton} ${styles.randomChoiceButton}`}
              onClick={handleRandomChoicePlay}
              disabled={isFetchingRandom || mutation.isPending}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95, rotate: [0, 5, -5, 3, 0] }}
            >
              🎲
              <span className={styles.choiceLabel}>
                {isFetchingRandom ? 'Picking...' : 'Random'}
              </span>
            </motion.button>
          </div>

          <motion.div
            className={styles.resultBox}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2>Result</h2>

            {result && (
              <motion.div
                className={styles.vsBox}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: result ? 1 : 0, y: result ? 0 : 15 }}
                transition={{ duration: 0.4 }}
                style={{ pointerEvents: result ? 'auto' : 'none' }}
              >
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
              </motion.div>
            )}

            <div className={styles.liveScore}>
              <p>
                🏆 Wins:{' '}
                <motion.span key={`win-${score.win}`} animate={{ scale: [1.3, 1] }}>
                  {score.win}
                </motion.span>{' '}
                | 💀 Losses:{' '}
                <motion.span key={`lose-${score.lose}`} animate={{ scale: [1.3, 1] }}>
                  {score.lose}
                </motion.span>{' '}
                | 🤝 Ties:{' '}
                <motion.span key={`tie-${score.tie}`} animate={{ scale: [1.3, 1] }}>
                  {score.tie}
                </motion.span>
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
              <motion.p
                className={`${styles.outcome} ${styles[result.outcome]}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: result ? 1 : 0, scale: result ? 1.1 : 0.9 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                {result.outcome.toUpperCase()}
              </motion.p>
            )}
          </motion.div>
        </div>

        <motion.div
          className={styles.scoreboard}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Scoreboard (last 10 rounds)</h3>
          {history.length > 0 ? (
            <ul>
              {history.map((h, idx) => (
                <motion.li
                  key={h.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  You: <strong>{h.user}</strong> vs Computer: <strong>{h.computer}</strong> →{' '}
                  <strong>{h.outcome.toUpperCase()}</strong>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p>No rounds played yet.</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
