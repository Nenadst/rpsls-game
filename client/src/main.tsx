import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.js';
import { GAME_CONSTANTS } from './constants/gameConstants.js';
import { SoundProvider } from './context/SoundContext.js';
import './index.css';
import { ErrorBoundary } from './ui/ErrorBoundary/ErrorBoundary.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: GAME_CONSTANTS.QUERY_STALE_TIME,
      gcTime: GAME_CONSTANTS.QUERY_CACHE_TIME,
      retry: (failureCount) => {
        if (failureCount >= 3) return false;
        return true;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SoundProvider>
          <App />
        </SoundProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
