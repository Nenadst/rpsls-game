import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ChoiceButtons } from '../ChoiceButtons';

import type { Choice } from '../../../types/gameTypes';

const mockChoices: Choice[] = [
  { id: 1, name: 'rock' },
  { id: 2, name: 'paper' },
  { id: 3, name: 'scissors' },
  { id: 4, name: 'lizard' },
  { id: 5, name: 'spock' },
];

const defaultProps = {
  choices: mockChoices,
  disabled: false,
  play: jest.fn(),
  playRandom: jest.fn(),
  isFetchingRandom: false,
};

describe('ChoiceButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all choice buttons', () => {
    render(<ChoiceButtons {...defaultProps} />);

    expect(screen.getByLabelText('Choose rock')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose paper')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose scissors')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose lizard')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose spock')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose random option')).toBeInTheDocument();
  });

  test('calls play function when choice button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChoiceButtons {...defaultProps} />);

    const rockButton = screen.getByLabelText('Choose rock');
    await user.click(rockButton);

    expect(defaultProps.play).toHaveBeenCalledWith(1);
  });

  test('calls playRandom function when random button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChoiceButtons {...defaultProps} />);

    const randomButton = screen.getByLabelText('Choose random option');
    await user.click(randomButton);

    expect(defaultProps.playRandom).toHaveBeenCalledTimes(1);
  });

  test('disables all buttons when disabled prop is true', () => {
    render(<ChoiceButtons {...defaultProps} disabled={true} />);

    mockChoices.forEach((choice) => {
      expect(screen.getByLabelText(`Choose ${choice.name}`)).toBeDisabled();
    });
    expect(screen.getByLabelText('Choose random option')).toBeDisabled();
  });

  test('shows loading state for random button when fetching', () => {
    render(<ChoiceButtons {...defaultProps} isFetchingRandom={true} />);

    const randomButton = screen.getByLabelText('Picking random choice');
    expect(randomButton).toBeDisabled();
    expect(screen.getByText('Picking…')).toBeInTheDocument();
  });

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<ChoiceButtons {...defaultProps} />);

    const rockButton = screen.getByLabelText('Choose rock');

    // Focus the button directly for testing
    rockButton.focus();
    expect(rockButton).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(defaultProps.play).toHaveBeenCalledWith(1);
  });

  test('handles space key press', () => {
    render(<ChoiceButtons {...defaultProps} />);

    const rockButton = screen.getByLabelText('Choose rock');
    fireEvent.keyDown(rockButton, { key: ' ' });

    expect(defaultProps.play).toHaveBeenCalledWith(1);
  });

  test('prevents keyboard interaction when disabled', () => {
    render(<ChoiceButtons {...defaultProps} disabled={true} />);

    const rockButton = screen.getByLabelText('Choose rock');
    fireEvent.keyDown(rockButton, { key: 'Enter' });

    expect(defaultProps.play).not.toHaveBeenCalled();
  });

  test('capitalizes choice names correctly', () => {
    render(<ChoiceButtons {...defaultProps} />);

    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('Paper')).toBeInTheDocument();
    expect(screen.getByText('Scissors')).toBeInTheDocument();
    expect(screen.getByText('Lizard')).toBeInTheDocument();
    expect(screen.getByText('Spock')).toBeInTheDocument();
  });
});
