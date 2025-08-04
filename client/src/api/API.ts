import axios, { AxiosError } from 'axios';
import { toastError } from '../lib/toastErrors';

export const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string; error?: string }>) => {
    const cfg = err.config || {};
    const data = err.response?.data || {};

    const msg = data.message || data.error || (cfg as any).errorMessage || 'Unexpected error';

    toastError(msg);
    return Promise.reject(err);
  }
);
