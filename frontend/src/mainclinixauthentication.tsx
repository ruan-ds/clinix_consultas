import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from '../src/components-clinix/login/login';

function ClinixAuth() {
  const [tela, setTela] = useState(0);
  return <Login changeAuth={setTela} />;
}

ReactDOM.createRoot(document.getElementById('root-clinix-auth')!).render(
  <React.StrictMode>
    <ClinixAuth />
  </React.StrictMode>,
);