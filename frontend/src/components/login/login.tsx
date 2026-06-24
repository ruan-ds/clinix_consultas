import React from 'react';
import './login.css';
import logo from '../../assets/images/logoNome.png';
import { useState } from "react"
import { getLogin } from "../../services/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { saveToken } from "../../services/tokenService";


// Typescript pede que defina os tipos que podem ser passados em cada parâmetro da props, isso ocorre na linha abaixo
type Props = {
  changeAuth: (valor: number) => void;//defino que o parâmetro changeAuth deve receber somente numeros, é void pois nao retorna nada
};
function Login({changeAuth}:  Props) {

  // variavel pra alterar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);
  //requisicao do login 
  //vai chamar os dados 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseLoginError = (error: any) => {
    const detail = error?.response?.data?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((item: any) => {
          if (typeof item === 'string') return item;
          if (item?.msg) return item.msg;
          if (item?.detail) return item.detail;
          if (item?.loc) return `${item.loc.join('.')} ${item.msg ?? ''}`.trim();
          return JSON.stringify(item);
        })
        .join(' | ');
    }
    return 'E-mail ou senha incorretos.';
  };

  async function sign_in() {
    setIsSubmitting(true);
    try {
      const login = { email, password };
      const response = await getLogin(login);

      if (response.status === 200) {
        saveToken(response.data.access_token);
        window.location.href = "/feed.html";
      }
    } catch (error: any) {
      setErro(parseLoginError(error));
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
     <main className="login-container">

      <section className="login-card">
        
        <div className="logo-box">
          <img src={logo} alt="Clinix Consultas" className="logo" />
        </div>

        <form onSubmit={(e) => {e.preventDefault(); sign_in();}}>
          <div className="input-group">
            <input type ="email" id="user" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="input-group">
            <input type={showPassword ? "text" : "password"} id="password" minLength={8} placeholder="Senha" onChange={(e) => setPassword(e.target.value)} required/>
            <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button> 
          </div>

          <button type="submit" className="btn-login" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar na Conta'}
          </button>
          {erro && <p className="erro-msg">{erro}</p>}
          
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
//condição ? valor_se_true : valor_se_false ISSO É USADO NA VISIBILADE DA SENHA
export default Login;
