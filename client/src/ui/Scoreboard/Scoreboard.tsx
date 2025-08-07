import { motion } from 'motion/react';
import { memo, useState } from 'react';

import styles from './Scoreboard.module.css';

import type { ScoreboardProps } from './Scoreboard.types';

export const Scoreboard = memo(function Scoreboard({
  history,
  score,
  savedMatches,
}: ScoreboardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={styles.scoreboard}>
      <div className={styles.matchDetails}>
        {!showDetails ? (
          <div className={styles.compactStats} onClick={() => setShowDetails(true)}>
            <span className={styles.compactItem}>🏆 {score.win}</span>
            <span className={styles.compactItem}>💀 {score.lose}</span>
            <span className={styles.compactItem}>🤝 {score.tie}</span>
            <span className={styles.compactItem}>🎯 {savedMatches}</span>
            <span className={styles.expandButton}>▼</span>
          </div>
        ) : (
          <motion.div
            className={styles.detailsContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button className={styles.collapseButton} onClick={() => setShowDetails(false)}>
              ▲ Hide Details
            </button>
            <div className={styles.statsRow}>
              🏆 Wins:{' '}
              <motion.span key={`w${score.win}`} animate={{ scale: [1.3, 1] }}>
                {score.win}
              </motion.span>
              {' | '}
              💀 Losses:{' '}
              <motion.span key={`l${score.lose}`} animate={{ scale: [1.3, 1] }}>
                {score.lose}
              </motion.span>
              {' | '}
              🤝 Ties:{' '}
              <motion.span key={`t${score.tie}`} animate={{ scale: [1.3, 1] }}>
                {score.tie}
              </motion.span>
            </div>
            <div className={styles.totalMatches}>Total Matches Won: {savedMatches}</div>
          </motion.div>
        )}
      </div>

      {!history.length ? (
        <section className={styles.section}>
          <h3>Scoreboard (last 10 rounds)</h3>
          <p className={styles.emptyText}>No rounds played yet.</p>
        </section>
      ) : (
        <>
          <h3>Scoreboard (last 10 rounds)</h3>
          <ul className={styles.list}>
            {history.slice(0, 10).map((h, idx) => (
              <motion.li
                key={h.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                You:&nbsp;<strong>{h.user}</strong>&nbsp;vs&nbsp;Computer:&nbsp;
                <strong>{h.computer}</strong> → <strong>{h.outcome.toUpperCase()}</strong>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
});
