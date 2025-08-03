import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

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
  return res.data; // { id, name }
};
