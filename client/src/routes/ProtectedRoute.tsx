import { Navigate } from 'react-router-dom';

import type { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const name = localStorage.getItem('playerName') || '';
  return name ? children : <Navigate to="/login" replace />;
}
