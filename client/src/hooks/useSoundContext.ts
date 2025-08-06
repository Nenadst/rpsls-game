import { useContext } from 'react';

import { SoundContext } from '../context/SoundContext';

export function useSoundContext() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('Must be inside <SoundProvider>');
  return ctx;
}
