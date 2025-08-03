import { useEffect, useState } from 'react';

type Choice = {
  id: number;
  name: string;
};

type GameResult = {
  id: string;
  user: string;
  computer: string;
  outcome: 'win' | 'lose' | 'tie';
};

type PlayResponse = {
  id: string;
  results: 'win' | 'lose' | 'tie';
  player: number;
  computer: number;
};

export default function Game() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/choices')
      .then((res) => res.json())
      .then((data: Choice[]) => {
        console.log('Choices:', data);
        setChoices(data);
      })
      .catch((err) => {
        console.error('Failed to fetch choices:', err);
      });
  }, []);

  const handlePlay = (id: number) => {
    fetch('http://localhost:5000/api/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: id }),
    })
      .then((res) => res.json())
      .then((data: PlayResponse) => {
        console.log('Game result:', data);
        const userChoice = choices.find((c) => c.id === data.player)?.name || 'Unknown';
        const computerChoice = choices.find((c) => c.id === data.computer)?.name || 'Unknown';

        const roundResult: GameResult = {
          id: data.id,
          user: userChoice,
          computer: computerChoice,
          outcome: data.results,
        };

        setResult(roundResult);
        setHistory((prev) => [roundResult, ...prev.slice(0, 9)]);
      })
      .catch((err) => {
        console.error('Failed to play game:', err);
      });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>Rock Paper Scissors Lizard Spock</h1>

      <p>Select your move:</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {choices.map((choice) => (
          <button key={choice.id} onClick={() => handlePlay(choice.id)}>
            {choice.name}
          </button>
        ))}
      </div>

      {result && (
        <div style={{ border: '1px solid #ccc', padding: 16, marginBottom: 20 }}>
          <h3>Result</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 10 }}>
            <div>
              <p>You chose:</p>
              <strong>{result.user}</strong>
            </div>
            <div>
              <p>Computer chose:</p>
              <strong>{result.computer}</strong>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 18 }}>
            Outcome: <strong>{result.outcome.toUpperCase()}</strong>
          </p>
        </div>
      )}

      <div>
        <h3>Scoreboard (last 10 rounds)</h3>
        {history.length > 0 ? (
          <ul>
            {history.map((h) => (
              <li key={h.id}>
                You: <strong>{h.user}</strong> vs Computer: <strong>{h.computer}</strong> →{' '}
                <strong>{h.outcome.toUpperCase()}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rounds played yet.</p>
        )}
      </div>
    </div>
  );
}
