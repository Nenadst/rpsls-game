import { motion } from 'motion/react';
import { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useConfetti } from '../hooks/useConfetti';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSound } from '../hooks/useSound';
import { useVolumeControl } from '../hooks/useVolumeControl';
import { ChoiceButtons } from '../ui/ChoiceButtons/ChoiceButtons';
import { InstructionsModal } from '../ui/InstructionModal/InstructionsModal';
import { ResultBox } from '../ui/ResultBox/ResultBox';
import { Scoreboard } from '../ui/Scoreboard/Scoreboard';
import { SoundControl } from '../ui/SoundControl/SoundControl';
import styles from './Game.module.css';

export default function Game() {
  const [showInstructions, setShowInstructions] = useState(false);

  const { enabled: soundOn, volume, toggle, setFromSlider } = useVolumeControl(false, 0);
  const playSound = useSound(soundOn, volume);
  const triggerConfetti = useConfetti();

  const {
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
  } = useGameLogic(playSound, triggerConfetti);

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Failed to load choices.</p>;

  return (
    <>
      <motion.main
        className={styles.container}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <header className={styles.topColumn}>
          <button
            className={styles.instructionsButton}
            aria-label="Show instructions"
            onClick={() => setShowInstructions(true)}
          >
            <FaQuestionCircle size={24} />
          </button>
          <h1 className={styles.gameTitle}>Rock Paper Scissors Lizard Spock</h1>
          <SoundControl
            enabled={soundOn}
            volume={volume}
            onToggle={toggle}
            onVolume={setFromSlider}
          />
        </header>

        <section className={styles.mainWrapper}>
          <div className={styles.mainContent}>
            <p className={styles.selectMoveText}>Select your move:</p>

            <ChoiceButtons
              choices={choices}
              disabled={false}
              play={play}
              playRandom={playRandom}
              isFetchingRandom={isFetchingRandom}
            />

            <ResultBox result={result} score={score} history={history} onReset={reset} />
          </div>

          <Scoreboard history={history} />
        </section>
      </motion.main>

      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
    </>
  );
}
