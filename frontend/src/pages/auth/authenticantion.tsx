import React from 'react';
import './authenticantion.css';
import { useEffect, useState } from "react";
import Register from '../../components/register/register';
import Login from '../../components/login/login';

function Authenticantion() {
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search); //pega as info da url pra saber pque renderizar
    const auth = params.get("auth"); //pega a variavel tela passada pela url

    if (auth !== null) {
      setEstado(Number(auth)); //se tela diferente de nulo converte pra numero
    }
  }, []);//esse final significa que roda so quando a pagina carrega

  //verifica o estado pra saber qual componente renderizar
  if (estado === 0) {
    return <Register changeAuth={setEstado} />; //Por props, passo a função setEstado pro componente poder definir o estado e atualizar a tela
  }
  return <Login changeAuth={setEstado} />;
  }

export default Authenticantion;