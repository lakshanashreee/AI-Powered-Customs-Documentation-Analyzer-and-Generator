import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ShipmentProvider } from './context/ShipmentContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ShipmentProvider>
      <App />
    </ShipmentProvider>
  </React.StrictMode>
);

