import { toast } from 'react-toastify';

export const toastError = (input: unknown, fallback = 'Something went wrong') => {
  const message =
    typeof input === 'string'
      ? input
      : input instanceof Error && input.message
        ? input.message
        : fallback;

  toast.error(message);
};
