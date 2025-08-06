import { motion } from 'motion/react';
import { memo } from 'react';

import styles from './Scoreboard.module.css';

import type { ScoreboardProps } from './Scoreboard.types';

export const Scoreboard = memo(function Scoreboard({ history }: ScoreboardProps) {
  return (
    <div className={styles.scoreboard}>
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
