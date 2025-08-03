import lizardIcon from '../assets/icons/lizard.svg';
import paperIcon from '../assets/icons/paper.svg';
import rockIcon from '../assets/icons/rock.svg';
import scissorsIcon from '../assets/icons/scissors.svg';
import spockIcon from '../assets/icons/spock.svg';

export type ChoiceName = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export const ICONS: Record<ChoiceName, string> = {
  rock: rockIcon,
  paper: paperIcon,
  scissors: scissorsIcon,
  lizard: lizardIcon,
  spock: spockIcon,
};
