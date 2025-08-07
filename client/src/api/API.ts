import axios, { AxiosError } from 'axios';

import { GAME_CONSTANTS } from '../constants/gameConstants';
import { toastError } from '../lib/toastErrors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: GAME_CONSTANTS.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string; error?: string }>) => {
    const cfg = err.config || {};
    const data = err.response?.data || {};

    const msg =
      data.message ||
      data.error ||
      (cfg as { errorMessage?: string }).errorMessage ||
      'Unexpected error';

    toastError(msg);
    return Promise.reject(err);
  }
);
