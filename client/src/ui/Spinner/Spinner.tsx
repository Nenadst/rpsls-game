import { motion } from 'motion/react';
import styles from './Spinner.module.css';

export function Spinner() {
  return (
    <div className={styles.overlay}>
      <motion.div
        className={styles.spinner}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }}
      />
    </div>
  );
}
