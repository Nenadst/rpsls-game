import type { Choice } from '../../types/gameTypes';

export interface ChoiceButtonsProps {
  choices: Choice[];
  disabled: boolean;
  play(id: number): void;
  playRandom(): void;
  isFetchingRandom: boolean;
}
