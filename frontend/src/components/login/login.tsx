import React from 'react';
import './login.css';
import logo from '../../assets/images/logoNome.png';

function Login() {
  return (
     <main className="login-container">

      <section className="login-card">
        
        <div className="logo-box">
          <img src={logo} alt="Clinix Consultas" className="logo" />
        </div>

        <form>
          <div className="input-group">
            <input type="text" id="user" placeholder="E-mail" required />
          </div>
          
          <div className="input-group">
            <input type="password" id="password" placeholder="Senha" required />
          </div>

          <button type="submit" className="btn-login">Criar Conta</button>
          
        </form>

        <div className="signup-footer">
          <p>Não possui uma conta? <a href="/register">Cadastre-se aqui</a></p>
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
