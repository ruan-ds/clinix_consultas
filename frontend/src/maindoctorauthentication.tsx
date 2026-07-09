import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './components-doctor/login/login';

function DoctorAuth() {
  const [tela, setTela] = useState(0);
  return <Login changeAuth={setTela} />;
}

ReactDOM.createRoot(document.getElementById('root-doctor-auth')!).render(
  <React.StrictMode>
    <DoctorAuth />
  </React.StrictMode>,
);