import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import './index.css';
import './lib/firebase'; // Import Firebase initialization

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);