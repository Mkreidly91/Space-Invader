import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GameContextProvider } from './Components/GameContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <GameContextProvider>
    <App />
  </GameContextProvider>
);
