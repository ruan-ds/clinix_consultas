import React from 'react';
import ReactDOM from 'react-dom/client';
import Homepage from './components/register/register';
import Login from './components/login/login';

ReactDOM.createRoot(document.getElementById('root-login')!).render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
);
