import confetti from 'canvas-confetti';
import { useCallback } from 'react';

export function useConfetti() {
  return useCallback(() => {
    confetti({
      particleCount: 300,
      spread: 120,
      origin: { x: 0.5, y: 0.5 },
      scalar: 1.2,
      gravity: 0.5,
    });
  }, []);
}
