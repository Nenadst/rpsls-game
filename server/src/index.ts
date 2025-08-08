import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import choicesRouter from './routes/choices.ts';
import gameRouter from './routes/game.ts';

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions = {
  origin: NODE_ENV === 'production' && ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : true,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const API_PREFIX = process.env.API_PREFIX || '/api';
app.use(API_PREFIX, choicesRouter);
app.use(API_PREFIX, gameRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
