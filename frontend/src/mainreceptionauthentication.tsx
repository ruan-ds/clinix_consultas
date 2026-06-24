import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './components-reception/login/login';

function ReceptionAuth() {
  const [tela, setTela] = useState(0);
  return <Login changeAuth={setTela} />;
}

ReactDOM.createRoot(document.getElementById('root-reception-auth')!).render(
  <React.StrictMode>
    <ReceptionAuth />
  </React.StrictMode>,
);
