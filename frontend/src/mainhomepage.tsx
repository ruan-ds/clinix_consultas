import React from 'react';
import ReactDOM from 'react-dom/client';
import Homepage from './pages/homepage/Homepage';
import Login from './pages/login/Login';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Homepage />
  </React.StrictMode>,
);
