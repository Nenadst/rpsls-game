import { createContext, useCallback, useContext, useRef, useState } from 'react';

type Ctx = {
  enabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
};

const SoundCtx = createContext<Ctx | null>(null);

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
  return <SoundCtx.Provider value={value}>{children}</SoundCtx.Provider>;
}

export function useSoundContext() {
  const ctx = useContext(SoundCtx);
  if (!ctx) throw new Error('Must be inside <SoundProvider>');
  return ctx;
}
