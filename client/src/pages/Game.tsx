import { useEffect, useState } from 'react';

type Choice = {
  id: number;
  name: string;
};

type PlayResponse = {
  results: string;
  player: number;
  computer: number;
};

export default function Game() {
  const [choices, setChoices] = useState<Choice[]>([]);

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
      })
      .catch((err) => {
        console.error('Failed to play game:', err);
      });
  };

  return (
    <div>
      <h1>Rock Paper Scissors Lizard Spock</h1>
      <p>Select your move:</p>
      <div>
        {choices.map((choice) => (
          <button key={choice.id} onClick={() => handlePlay(choice.id)}>
            {choice.name}
          </button>
        ))}
      </div>
    </div>
  );
}
