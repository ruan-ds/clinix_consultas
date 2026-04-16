import React from 'react';
import './login.css';
import logo from '../../assets/images/logoNome.png';
// Typescript pede que defina os tipos que podem ser passados em cada parâmetro da props, isso ocorre na linha abaixo
type Props = {
  changeAuth: (valor: number) => void;//defino que o parâmetro changeAuth deve receber somente numeros, é void pois nao retorna nada
};

function Login({changeAuth}:  Props) {
  return (
     <main className="login-container">

      <section className="login-card">
        
        <div className="logo-box">
          <img src={logo} alt="Clinix Consultas" className="logo" />
        </div>

        <form>
          <div className="input-group">
            <input type="text" id="user" placeholder="Login" required />
          </div>
          
          <div className="input-group">
            <input type="password" id="password" placeholder="Senha" required />
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
