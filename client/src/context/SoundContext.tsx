/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useRef, useState } from 'react';

type SoundContextType = {
  enabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
};

export const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [volume, _setVolume] = useState(0);
  const lastNonZero = useRef(0.5);

  const toggle = useCallback(() => {
    if (enabled) {
      if (volume > 0) lastNonZero.current = volume;
      _setVolume(0);
    } else {
      _setVolume(lastNonZero.current);
    }
    setEnabled((e) => !e);
  }, [enabled, volume]);

  const setVolume = useCallback(
    (v: number) => {
      if (!enabled && v > 0) setEnabled(true);
      if (enabled && v === 0) setEnabled(false);
      if (v > 0) lastNonZero.current = v;
      _setVolume(v);
    },
    [enabled]
  );

  const value = { enabled, volume, toggle, setVolume };
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
