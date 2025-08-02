import express from 'express';
import cors from 'cors';
import choicesRouter from './routes/choices.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', choicesRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
