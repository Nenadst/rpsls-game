import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Scoreboard } from '../Scoreboard';

const mockScore = { win: 5, lose: 3, tie: 2 };
const mockHistory = [
  { id: '1', user: 'rock', computer: 'scissors', outcome: 'win' as const },
  { id: '2', user: 'paper', computer: 'rock', outcome: 'win' as const },
  { id: '3', user: 'scissors', computer: 'rock', outcome: 'lose' as const },
];

const defaultProps = {
  history: mockHistory,
  score: mockScore,
  savedMatches: 10,
};

describe('Scoreboard', () => {
  test('renders scoreboard title', () => {
    render(<Scoreboard {...defaultProps} />);
    expect(screen.getByText('Scoreboard (last 10 rounds)')).toBeInTheDocument();
  });

  test('displays compact stats by default', () => {
    render(<Scoreboard {...defaultProps} />);

    expect(screen.getByText('🏆 5')).toBeInTheDocument();
    expect(screen.getByText('💀 3')).toBeInTheDocument();
    expect(screen.getByText('🤝 2')).toBeInTheDocument();
    expect(screen.getByText('🎯 10')).toBeInTheDocument();
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  test('shows detailed stats when compact stats are clicked', async () => {
    const user = userEvent.setup();
    render(<Scoreboard {...defaultProps} />);

    const compactStats = screen.getByText('🏆 5').closest('div');
    await user.click(compactStats!);

    expect(screen.getByText('▲ Hide Details')).toBeInTheDocument();
    expect(screen.getByText(/Wins:/)).toBeInTheDocument();
    expect(screen.getByText(/Losses:/)).toBeInTheDocument();
    expect(screen.getByText(/Ties:/)).toBeInTheDocument();
    expect(screen.getByText('Total Matches Won: 10')).toBeInTheDocument();
  });

  test('hides detailed stats when collapse button is clicked', async () => {
    const user = userEvent.setup();
    render(<Scoreboard {...defaultProps} />);

    const compactStats = screen.getByText('🏆 5').closest('div');
    await user.click(compactStats!);

    const hideButton = screen.getByText('▲ Hide Details');
    await user.click(hideButton);

    expect(screen.getByText('▼')).toBeInTheDocument();
    expect(screen.queryByText('▲ Hide Details')).not.toBeInTheDocument();
  });

  test('displays game history correctly', () => {
    render(<Scoreboard {...defaultProps} />);

    // Check that game history entries are displayed
    const historyItems = screen.getAllByRole('listitem');
    expect(historyItems).toHaveLength(3);

    // Check for outcome results in history
    expect(screen.getAllByText('WIN')).toHaveLength(2);
    expect(screen.getByText('LOSE')).toBeInTheDocument();

    // Check that choices are displayed (using getAllByText since they appear multiple times)
    expect(screen.getAllByText('rock').length).toBeGreaterThan(0);
    expect(screen.getAllByText('paper').length).toBeGreaterThan(0);
    expect(screen.getAllByText('scissors').length).toBeGreaterThan(0);
  });

  test('shows empty state when no games played', () => {
    const emptyProps = {
      ...defaultProps,
      history: [],
      score: { win: 0, lose: 0, tie: 0 },
    };

    render(<Scoreboard {...emptyProps} />);

    expect(screen.getByText('No rounds played yet.')).toBeInTheDocument();
  });

  test('limits history display to 10 rounds', () => {
    const longHistory = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      user: 'rock',
      computer: 'scissors',
      outcome: 'win' as const,
    }));

    const propsWithLongHistory = {
      ...defaultProps,
      history: longHistory,
    };

    render(<Scoreboard {...propsWithLongHistory} />);

    const historyItems = screen.getAllByRole('listitem');
    expect(historyItems).toHaveLength(10);
  });

  test('handles zero scores correctly', () => {
    const zeroScoreProps = {
      ...defaultProps,
      score: { win: 0, lose: 0, tie: 0 },
      savedMatches: 0,
    };

    render(<Scoreboard {...zeroScoreProps} />);

    expect(screen.getByText('🏆 0')).toBeInTheDocument();
    expect(screen.getByText('💀 0')).toBeInTheDocument();
    expect(screen.getByText('🤝 0')).toBeInTheDocument();
    expect(screen.getByText('🎯 0')).toBeInTheDocument();
  });
});
