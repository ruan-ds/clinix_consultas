import React from 'react';
import ReactDOM from 'react-dom/client';
import Homepage from './pages/homepage/Homepage';
import Login from './components/login/login';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Homepage />
  </React.StrictMode>,
);
