import confetti from 'canvas-confetti';
import { useCallback } from 'react';

export function useConfetti() {
  return useCallback(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }, []);
}
