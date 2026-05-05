import React from 'react';
import './login.css';
import logo from '../../assets/images/logoNome.png';
import { useState } from "react"
import { getLogin } from "../../services/auth";

// Typescript pede que defina os tipos que podem ser passados em cada parâmetro da props, isso ocorre na linha abaixo
type Props = {
  changeAuth: (valor: number) => void;//defino que o parâmetro changeAuth deve receber somente numeros, é void pois nao retorna nada
};

function Login({changeAuth}:  Props) {

  //requisicao do login 
  //vai chamar os dados 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    async function sign_in() {

      const login = {
           email: email,
           password: password
      };
      //linha pra fazer a requisicao, assim como no register
      const response = await getLogin(login);
    }

  
  return (
     <main className="login-container">

      <section className="login-card">
        
        <div className="logo-box">
          <img src={logo} alt="Clinix Consultas" className="logo" />
        </div>

        <form onSubmit={(e) => {e.preventDefault(); sign_in();}}>
          <div className="input-group">
            <input type="text" id="user" placeholder="Login" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="input-group">
            <input type="password" id="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-login">Criar Conta</button>
          
        </form>

        <div className="signup-footer">
          <p>Não possui uma conta? <a href="#" onClick={()=> changeAuth(0)}>Cadastre-se aqui</a></p>
        </div>

      </section>

      <aside className="promo-card">
        <h2>Agende consultas<br />com 1 Clique</h2>
        <p>Acesse milhares de especialistas e<br />gerencie sua saúde</p>
      </aside>

    </main>
  );
}

export default Login;
