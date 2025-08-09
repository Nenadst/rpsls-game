import lizardIcon from '../assets/icons/Lizard.svg';
import paperIcon from '../assets/icons/Paper.svg';
import rockIcon from '../assets/icons/Rock.svg';
import scissorsIcon from '../assets/icons/Scissors.svg';
import spockIcon from '../assets/icons/Spock.svg';

export type ChoiceName = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export const ICONS: Record<ChoiceName, string> = {
  rock: rockIcon,
  paper: paperIcon,
  scissors: scissorsIcon,
  lizard: lizardIcon,
  spock: spockIcon,
};
