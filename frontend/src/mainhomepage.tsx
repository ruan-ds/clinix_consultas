import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 👉 Aqui é o segredo: você PRECISA importar o seu arquivo de rotas!
import AppRoutes from './approutes'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 👉 E colocar ele para renderizar aqui dentro */}
      <AppRoutes /> 
    </BrowserRouter>
  </React.StrictMode>
);