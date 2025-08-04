import { API } from './API';

export const fetchChoices = async () => {
  const res = await API.get('/choices');
  return res.data;
};

export const playGame = async (playerId: number) => {
  const res = await API.post('/play', { player: playerId });
  return res.data;
};

export const fetchRandomChoice = async () => {
  const res = await API.get('/choice');
  return res.data;
};
