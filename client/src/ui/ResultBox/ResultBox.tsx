import { motion } from 'motion/react';
import { memo } from 'react';

import { ICONS, type ChoiceName } from '../../constants/icons';
import styles from './ResultBox.module.css';

import type { ResultBoxProps } from './ResultBox.types';

export const ResultBox = memo(function ResultBox({
  result,
  score,
  history,
  onReset,
}: ResultBoxProps) {
  return (
    <motion.div
      className={styles.box}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {result && (
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

      <div className={styles.scoreRow}>
        <p>
          🏆 Wins:&nbsp;
          <motion.span key={`w${score.win}`} animate={{ scale: [1.3, 1] }}>
            {score.win}
          </motion.span>
          &nbsp;| 💀 Losses:&nbsp;
          <motion.span key={`l${score.lose}`} animate={{ scale: [1.3, 1] }}>
            {score.lose}
          </motion.span>
          &nbsp;| 🤝 Ties:&nbsp;
          <motion.span key={`t${score.tie}`} animate={{ scale: [1.3, 1] }}>
            {score.tie}
          </motion.span>
        </p>

        <button
          className={styles.reset}
          onClick={onReset}
          disabled={!result && history.length === 0}
        >
          Reset game
        </button>
      </div>

      {result && (
        <motion.p
          className={`${styles.outcome} ${styles[result.outcome]}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          {result.outcome.toUpperCase()}
        </motion.p>
      )}
    </motion.div>
  );
});
