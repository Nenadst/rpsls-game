import express from 'express';
import cors from 'cors';
import choicesRouter from './routes/choices.ts';
import gameRouter from './routes/game.ts';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api', choicesRouter);
app.use('/api', gameRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
