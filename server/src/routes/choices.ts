import express, { Request, Response } from 'express';
import { CHOICES } from '../data/choicesData.ts';

const router = express.Router();

type RandomApiResponse = {
  random_number: number;
};

router.get('/choices', (_req: Request, res: Response) => {
  res.json(CHOICES);
});

router.get('/choice', async (_req: Request, res: Response) => {
  try {
    const response = await fetch('https://codechallenge.boohma.com/random');
    const data = (await response.json()) as RandomApiResponse;
    const choice = CHOICES[data.random_number % CHOICES.length];
    res.json(choice);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch random choice' });
  }
});

export default router;
