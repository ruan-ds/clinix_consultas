import React from 'react';
import './register.css';
import logo from '../../assets/images/logoNome.png';
import { useState } from "react";
import { createAccount } from "../../services/auth";

function Register() {
  //armazena dados
  //obs:fazer um para atualizar inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // a função sign_up armazena os datos no data, que são passados para fazer a requisição
  async function sign_up() {
    const data = {
      access: {
        email: email,
        password: password
      }
    };
    //a linha abaixo envia o data para fazer a requisição
    const response = await createAccount(data);
  }
  return (
    <main className="login-container">

      <section className="login-card">
        
        <div className="logo-box">
          <img src={logo} alt="Clinix Consultas" className="logo" />
        </div>

        <form>
          <div className="input-group">
            <input type="text" id="user" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)}required /* Aqui pega as informaçoes alteradas no input*/ /> 
          </div>
          
          <div className="input-group">
            <input type="password" id="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-login">PROSSEGUIR</button>
          
        </form>

        <div className="signup-footer">
          <p>Você já possui uma conta? <a href="/login">Entre aqui</a></p>
        </div>

      </section>

      <aside className="promo-card">
        <h2>Agende consultas<br />com 1 Clique</h2>
        <p>Acesse milhares de especialistas e<br />gerencie sua saúde</p>
      </aside>

    </main>
  );
}

export default Register;