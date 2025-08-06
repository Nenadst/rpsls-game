import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const name = localStorage.getItem('playerName') || '';
  return name ? children : <Navigate to="/login" replace />;
}
