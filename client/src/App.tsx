import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { SoundProvider } from './context/SoundContext';
import Game from './pages/GamePage/Game';
import Login from './pages/LoginPage/Login';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <SoundProvider>
                <Game />
              </SoundProvider>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/game" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}
