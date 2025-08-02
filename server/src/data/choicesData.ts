export type ChoiceName = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export type Choice = {
  id: number;
  name: ChoiceName;
};

export const CHOICES: Choice[] = [
  { id: 1, name: 'rock' },
  { id: 2, name: 'paper' },
  { id: 3, name: 'scissors' },
  { id: 4, name: 'lizard' },
  { id: 5, name: 'spock' },
];
