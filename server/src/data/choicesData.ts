export type ChoiceName = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export type Choice = {
  id: number;
  name: ChoiceName;
};

export type ChoiceId = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export const CHOICES: Choice[] = [
  { id: 1, name: 'rock' },
  { id: 2, name: 'paper' },
  { id: 3, name: 'scissors' },
  { id: 4, name: 'lizard' },
  { id: 5, name: 'spock' },
];

export const BEATS: Record<ChoiceId, ChoiceId[]> = {
  rock: ['scissors', 'lizard'], // Rock beats Scissors, Lizard
  paper: ['rock', 'spock'], // Paper beats Rock, Spock
  scissors: ['paper', 'lizard'], // Scissors beats Paper, Lizard
  lizard: ['spock', 'paper'], // Lizard beats Spock, Paper
  spock: ['scissors', 'rock'], // Spock beats Scissors, Rock
};
