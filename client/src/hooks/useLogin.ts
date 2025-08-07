import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { GAME_CONSTANTS, ROUTES } from '../constants/gameConstants';

export function useLogin() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [limitHit, setLimitHit] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = raw.replace(/[<>"/\\&{}[\]]/g, '');

    if (sanitized.length > GAME_CONSTANTS.MAX_PLAYER_NAME_LENGTH) {
      setLimitHit(true);
      setName(sanitized.slice(0, GAME_CONSTANTS.MAX_PLAYER_NAME_LENGTH));
    } else {
      setLimitHit(false);
      setName(sanitized);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return toast.error('Enter a name to play');

    if (trimmed.length < GAME_CONSTANTS.MIN_PLAYER_NAME_LENGTH) {
      return toast.error(
        `Name must be at least ${GAME_CONSTANTS.MIN_PLAYER_NAME_LENGTH} characters`
      );
    }

    const finalName = trimmed.replace(/[<>"/\\&{}[\]]/g, '');
    if (finalName !== trimmed) {
      return toast.error('Name contains invalid characters');
    }

    localStorage.setItem('playerName', finalName);
    nav(ROUTES.GAME, { replace: true });
  };

  return {
    name,
    limitHit,
    handleChange,
    handleSubmit,
  };
}
