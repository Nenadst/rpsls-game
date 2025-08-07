import { motion } from 'motion/react';
import { memo, useEffect, useRef } from 'react';

import { ICONS, type ChoiceName } from '../../constants/icons';
import styles from './ResultBox.module.css';

import type { ResultBoxProps } from './ResultBox.types';

export const ResultBox = memo(function ResultBox({
  result,
  score,
  matchResult,
  history,
  playerName,
  onReset,
  onResetMatch,
}: ResultBoxProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (matchResult && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [matchResult]);

  return (
    <motion.div
      className={styles.box}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {result && !matchResult && (
        <motion.p
          className={`${styles.outcome} ${styles[result.outcome]}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          {result.outcome.toUpperCase()}
        </motion.p>
      )}

      {result && !matchResult && (
        <motion.div
          className={styles.vsBox}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.side}>
            <p className={styles.text}>You chose</p>
            <img src={ICONS[result.user as ChoiceName]} alt={result.user} className={styles.icon} />
            <span className={styles.label}>{result.user}</span>
          </div>

          <div className={styles.vsText}>VS</div>

          <div className={styles.side}>
            <p className={styles.text}>Computer chose</p>
            <img
              src={ICONS[result.computer as ChoiceName]}
              alt={result.computer}
              className={styles.icon}
            />
            <span className={styles.label}>{result.computer}</span>
          </div>
        </motion.div>
      )}

      {matchResult && (
        <motion.div
          className={styles.matchResult}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <h3
            className={`${styles.matchTitle} ${matchResult.winner === 'player' ? styles.matchWon : styles.matchLost}`}
          >
            🎉 MATCH {matchResult.winner === 'player' ? 'WON' : 'LOST'}! 🎉
          </h3>
          <p className={styles.matchInfo}>
            Final Score: {matchResult.finalScore.win} - {matchResult.finalScore.lose}
          </p>
        </motion.div>
      )}

      <div className={styles.gameInterface}>
        <div className={styles.progressSection}>
          <div className={styles.playerSection}>
            <div className={styles.playerHeader}>
              <span className={styles.playerName}>{playerName.toUpperCase()}</span>
              <span className={styles.scoreCounter}>{score.win}/10</span>
            </div>
            <div className={styles.verticalProgressBar}>
              <div
                className={styles.playerProgressFill}
                style={{ height: `${(score.win / 10) * 100}%` }}
              />
              <div className={styles.progressMarkers}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className={styles.marker} />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.centerStats}>
            <div className={styles.matchTitle}>First to 10 Wins</div>
            <div className={styles.currentScore}>
              <div className={styles.scoreStats}>
                🏆{' '}
                <motion.span key={`w${score.win}`} animate={{ scale: [1.3, 1] }}>
                  {score.win}
                </motion.span>
                <span className={styles.separator}>-</span>
                <motion.span key={`l${score.lose}`} animate={{ scale: [1.3, 1] }}>
                  {score.lose}
                </motion.span>{' '}
                💀
              </div>
            </div>

            <button
              ref={buttonRef}
              className={styles.reset}
              onClick={matchResult ? onResetMatch : onReset}
              disabled={!matchResult && !result && history.length === 0}
            >
              {matchResult ? 'New Match' : 'Reset Match'}
            </button>
          </div>

          <div className={styles.computerSection}>
            <div className={styles.computerHeader}>
              <span className={styles.computerName}>COMPUTER</span>
              <span className={styles.scoreCounter}>{score.lose}/10</span>
            </div>
            <div className={styles.verticalProgressBar}>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: score.lose > 0 ? `${(score.lose / 10) * 100}%` : '0',
                  backgroundColor: '#dc2626',
                  borderRadius: '0 0 20px 20px',
                  transition: 'height 0.5s ease',
                  zIndex: 10,
                }}
              />
              <div className={styles.progressMarkers}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className={styles.marker} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
