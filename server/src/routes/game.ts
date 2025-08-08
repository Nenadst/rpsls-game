import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BEATS, ChoiceId, CHOICES } from '../data/choicesData.ts';

const RANDOM_API_URL = process.env.RANDOM_API_URL || 'https://codechallenge.boohma.com/random';

function determineWinner(playerId: ChoiceId, computerId: ChoiceId): 'win' | 'lose' | 'tie' {
  if (playerId === computerId) return 'tie';
  return BEATS[playerId].includes(computerId) ? 'win' : 'lose';
}

const router = express.Router();

type PlayRequestBody = {
  player: number;
};

router.post('/play', async (req: Request<{}, {}, PlayRequestBody>, res: Response) => {
  try {
    const { player } = req.body;

    if (!player || typeof player !== 'number' || player < 1 || player > CHOICES.length) {
      return res.status(400).json({ 
        error: 'Invalid player choice',
        message: `Player choice must be a number between 1 and ${CHOICES.length}` 
      });
    }

    const response = await fetch(RANDOM_API_URL);
    
    if (!response.ok) {
      console.error(`Random API error: ${response.status} ${response.statusText}`);
      return res.status(503).json({ 
        error: 'Random number service unavailable',
        message: 'Unable to generate computer choice at this time'
      });
    }

    const { random_number }: { random_number: number } = await response.json();

    if (typeof random_number !== 'number') {
      return res.status(500).json({ error: 'Invalid random number from API' });
    }

    const computerChoice = CHOICES[random_number % CHOICES.length];
    const playerChoice = CHOICES.find((c) => c.id === player);

    if (!computerChoice || !playerChoice) {
      return res.status(400).json({ error: 'Invalid choice ID' });
    }

    const result = determineWinner(playerChoice.name, computerChoice.name);

    res.json({
      id: uuidv4(),
      results: result,
      player: playerChoice.id,
      computer: computerChoice.id,
    });
  } catch (err) {
    console.error('Error in /play:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
