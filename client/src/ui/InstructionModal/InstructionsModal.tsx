import { motion } from 'motion/react';
import { createPortal } from 'react-dom';
import rpslsDiagram from '../../assets/gif/rpssl.gif';
import styles from './InstructionsModal.module.css';
import type { InstructionModalProps } from './InstructionsModal.types';

export function InstructionsModal({ open, onClose }: InstructionModalProps) {
  if (!open) return null;

  return createPortal(
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Game instructions</h2>

        <img
          src={rpslsDiagram}
          alt="Rock-Paper-Scissors-Lizard-Spock diagram"
          className={styles.diagram}
        />

        <ul className={styles.rules}>
          <li>Rock crushes Scissors and Lizard.</li>
          <li>Paper covers Rock and disproves Spock.</li>
          <li>Scissors cuts Paper and decapitates Lizard.</li>
          <li>Lizard eats Paper and poisons Spock.</li>
          <li>Spock smashes Scissors and vaporises Rock.</li>
        </ul>

        <button className={styles.close} onClick={onClose}>
          Got it
        </button>
      </motion.div>
    </motion.div>,
    document.body
  );
}
