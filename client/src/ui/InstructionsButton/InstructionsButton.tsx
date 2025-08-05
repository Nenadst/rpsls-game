import { memo } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import styles from './InstructionsButton.module.css';
import type { InstructionsButtonProps } from './InstructionsButton.types';

export const InstructionsButton = memo(function InstructionsButton({
  onClick,
}: InstructionsButtonProps) {
  return (
    <button className={styles.instructionsButton} aria-label="Show instructions" onClick={onClick}>
      <FaQuestionCircle size={24} />
    </button>
  );
});
