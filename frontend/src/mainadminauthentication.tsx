import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './components-admin/login/login';

function AdminAuth() {
  const [tela, setTela] = useState(0);
  return <Login changeAuth={setTela} />;
}

ReactDOM.createRoot(document.getElementById('root-admin-auth')!).render(
  <React.StrictMode>
    <AdminAuth />
  </React.StrictMode>,
);
