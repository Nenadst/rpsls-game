import express, { Request, Response } from 'express';
import { CHOICES } from '../data/choicesData.ts';

const router = express.Router();
const RANDOM_API_URL = process.env.RANDOM_API_URL || 'https://codechallenge.boohma.com/random';

type RandomApiResponse = {
  random_number: number;
};

router.get('/choices', (_req: Request, res: Response) => {
  res.json(CHOICES);
});

router.get('/choice', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(RANDOM_API_URL);
    const data = (await response.json()) as RandomApiResponse;
    const choice = CHOICES[data.random_number % CHOICES.length];
    res.json(choice);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch random choice' });
  }
});

export default router;
