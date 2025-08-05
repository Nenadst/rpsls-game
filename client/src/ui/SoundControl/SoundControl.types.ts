export interface SoundControlProps {
  enabled: boolean;
  volume: number;
  onToggle(): void;
  onVolume(v: number): void;
}
