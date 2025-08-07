import { useCallback, useEffect, useRef } from 'react';

import { useSoundContext } from './useSoundContext';

export function useSound() {
  const { enabled, volume } = useSoundContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(
    (name: string) => {
      if (!enabled) return;

      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } else {
          audioRef.current = new Audio();
        }

        audioRef.current.src = `/sounds/${name}.mp3`;
        audioRef.current.volume = volume;
        audioRef.current.play().catch((error) => {
          console.warn('Failed to play sound:', error);
        });
      } catch (error) {
        console.warn('Audio error:', error);
      }
    },
    [enabled, volume]
  );

  return play;
}
