import { useState } from 'react';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import styles from './SoundControl.module.css';
import type { SoundControlProps } from './SoundControl.types';

export function SoundControl({ enabled, volume, onToggle, onVolume }: SoundControlProps) {
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
        onClick={onToggle}
      >
        {enabled ? <HiVolumeUp size={24} /> : <HiVolumeOff size={24} />}
      </button>

      {hover && (
        <div className={styles.volumeSlider}>
          <input
            type="range"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      )}
    </div>
  );
}
