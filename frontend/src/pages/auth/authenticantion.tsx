import React from 'react';
import './authenticantion.css';
import { useEffect, useState } from "react";
import Register from '../../components/register/register';
import Login from '../../components/login/login';

function Authenticantion() {
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search); //pega as info da url pra saber pque renderizar
    const tela = params.get("tela"); //pega a variavel tela passada pela url

    if (tela !== null) {
      setEstado(Number(tela)); //se tela diferente de nulo converte pra numero
    }
  }, []);//esse final significa que roda so quando a pagina carrega

  //verifica o estado pra saber qual componente renderizar
  if (estado === 0) {
    return <Register />;
  }
  return <Login />;
  }

export default Authenticantion;