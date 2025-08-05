import { useCallback, useRef, useState } from 'react';

export function useVolumeControl(initialEnabled = false, initialVolume = 0) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [volume, setVolume] = useState(initialVolume);

  const lastNonZero = useRef(initialVolume > 0 ? initialVolume : 0.5);

  const toggle = useCallback(() => {
    if (enabled) {
      if (volume > 0) lastNonZero.current = volume;
      setVolume(0);
    } else {
      setVolume(lastNonZero.current);
    }
    setEnabled(!enabled);
  }, [enabled, volume]);

  const setFromSlider = useCallback(
    (next: number) => {
      if (!enabled && next > 0) setEnabled(true);
      if (enabled && next === 0) setEnabled(false);

      if (next > 0) lastNonZero.current = next;
      setVolume(next);
    },
    [enabled]
  );

  return { enabled, volume, toggle, setFromSlider };
}
