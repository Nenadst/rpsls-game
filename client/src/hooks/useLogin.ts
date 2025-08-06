import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MAX_NAME_LENGTH = 20;

export function useLogin() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [limitHit, setLimitHit] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.length > MAX_NAME_LENGTH) {
      setLimitHit(true);
      setName(raw.slice(0, MAX_NAME_LENGTH));
    } else {
      setLimitHit(false);
      setName(raw);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return toast.error('Enter a name to play');

    localStorage.setItem('playerName', trimmed);
    nav('/game', { replace: true });
  };

  return {
    name,
    limitHit,
    handleChange,
    handleSubmit,
  };
}
