import { useCallback, useRef } from 'react';

export function useSound(enabled: boolean, volume: number) {
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
