import { motion } from 'motion/react';
import { memo } from 'react';

import diceImg from '../../assets/images/two-dices-white-background.png';
import { ICONS, type ChoiceName } from '../../constants/icons';
import { capitalizeFirst } from '../../utils/helpers';
import styles from './ChoiceButtons.module.css';

import type { ChoiceButtonsProps } from './ChoiceButton.types';

export const ChoiceButtons = memo(function ChoiceButtons({
  choices,
  disabled,
  play,
  playRandom,
  isFetchingRandom,
}: ChoiceButtonsProps) {
  return (
    <div className={styles.buttons}>
      {choices.map((c) => (
        <motion.button
          key={c.id}
          className={styles.choiceButton}
          onClick={() => play(c.id)}
          disabled={disabled}
          aria-label={`Choose ${c.name}`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault();
              play(c.id);
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95, rotate: [0, -5, 5, -3, 0] }}
        >
          <img src={ICONS[c.name as ChoiceName]} alt={c.name} className={styles.choiceIcon} />
          <span className={styles.choiceLabel}>{capitalizeFirst(c.name)}</span>
        </motion.button>
      ))}

      <motion.button
        className={`${styles.choiceButton} ${styles.randomChoiceButton}`}
        onClick={playRandom}
        disabled={disabled || isFetchingRandom}
        aria-label={isFetchingRandom ? 'Picking random choice' : 'Choose random option'}
        role="button"
        tabIndex={disabled || isFetchingRandom ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isFetchingRandom) {
            e.preventDefault();
            playRandom();
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95, rotate: [0, 5, -5, 3, 0] }}
      >
        <img src={diceImg} alt="Random dice" className={styles.choiceIconDice} />
        <span className={styles.choiceLabel}>{isFetchingRandom ? 'Picking…' : 'Random'}</span>
      </motion.button>
    </div>
  );
});
