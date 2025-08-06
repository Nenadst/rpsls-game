import { memo, useState } from 'react';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';

import { useSoundContext } from '../../hooks/useSoundContext';
import styles from './SoundControl.module.css';

export const SoundControl = memo(function SoundControl() {
  const { enabled, volume, toggle, setVolume } = useSoundContext();
  const [hover, setHover] = useState(false);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        aria-label={enabled ? 'Mute sound' : 'Enable sound'}
        className={enabled ? styles.on : styles.off}
        onClick={toggle}
      >
        {enabled ? <HiVolumeUp size={24} /> : <HiVolumeOff size={24} />}
      </button>

      {hover && (
        <div className={styles.volumeSlider}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      )}
    </div>
  );
});
