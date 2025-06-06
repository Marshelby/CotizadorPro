import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'leaflet/dist/leaflet.css'; // ✅ Importación del CSS
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);