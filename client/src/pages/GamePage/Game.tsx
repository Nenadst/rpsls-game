import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useConfetti } from '../../hooks/useConfetti';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useSound } from '../../hooks/useSound';
import { ChoiceButtons } from '../../ui/ChoiceButtons/ChoiceButtons';
import { InstructionsButton } from '../../ui/InstructionsButton/InstructionsButton';
import { InstructionsModal } from '../../ui/InstructionsModal/InstructionsModal';
import CustomDropdown from '../../ui/ProfileDropdown/ProfileDropdown';
import { ResultBox } from '../../ui/ResultBox/ResultBox';
import { Scoreboard } from '../../ui/Scoreboard/Scoreboard';
import { SoundControl } from '../../ui/SoundControl/SoundControl';
import { Spinner } from '../../ui/Spinner/Spinner';
import styles from './Game.module.css';

export default function Game() {
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  const playerName = localStorage.getItem('playerName') || 'Player';

  const openModal = () => setShowInstructions(true);
  const closeModal = () => setShowInstructions(false);

  const playSound = useSound();
  const triggerConfetti = useConfetti();

  const handleLogout = () => {
    localStorage.removeItem('playerName');
    navigate('/login', { replace: true });
  };

  const {
    choices,
    result,
    history,
    score,
    matchResult,
    savedMatches,
    isLoading,
    isError,
    isFetchingRandom,
    play,
    playRandom,
    resetMatch,
  } = useGameLogic(playSound, triggerConfetti);

  if (isLoading) return <Spinner />;
  if (isError) return <p>Failed to load choices.</p>;

  return (
    <main className={styles.main}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <header className={styles.header}>
          <InstructionsButton onClick={openModal} />

          <h1 className={styles.gameTitle}>Rock Paper Scissors Lizard Spock</h1>

          <div className={styles.rightArea}>
            <SoundControl />

            <div className={styles.profile}>
              <CustomDropdown playerName={playerName} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        <section className={styles.mainWrapper}>
          <div className={styles.mainContent}>
            <p className={styles.selectMoveText}>
              {matchResult ? 'Match Over!' : 'Select your move:'}
            </p>

            <ChoiceButtons
              choices={choices}
              disabled={!!matchResult}
              play={play}
              playRandom={playRandom}
              isFetchingRandom={isFetchingRandom}
            />

            <ResultBox
              result={result}
              score={score}
              matchResult={matchResult}
              history={history}
              playerName={playerName}
              onReset={resetMatch}
              onResetMatch={resetMatch}
            />
          </div>

          <Scoreboard history={history} score={score} savedMatches={savedMatches} />
        </section>
      </motion.div>

      <InstructionsModal open={showInstructions} onClose={closeModal} />
    </main>
  );
}
