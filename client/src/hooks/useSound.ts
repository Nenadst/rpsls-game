import { useCallback, useRef } from 'react';
import { useSoundContext } from '../context/SoundContext';

export function useSound() {
  const { enabled, volume } = useSoundContext();
  const current = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(
    (name: string) => {
      if (!enabled) return;

      if (current.current) {
        current.current.pause();
        current.current.currentTime = 0;
      }

      const audio = new Audio(`/sounds/${name}.mp3`);
      audio.volume = volume;
      audio.play().catch(console.warn);

      current.current = audio;
    },
    [enabled, volume]
  );

  return play;
}
