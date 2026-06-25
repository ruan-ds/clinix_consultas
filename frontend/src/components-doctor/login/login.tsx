import React from 'react';
import './login.css';
import logo from '../../assets/images/logoNome.png';
import { useState } from "react"
import { getLogin } from "../../services/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { saveToken } from "../../services/tokenService";

type Props = {
  changeAuth: (valor: number) => void;
};

function Login({changeAuth}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseLoginError = (error: any) => {
    const detail = error?.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((item: any) => {
        if (typeof item === 'string') return item;
        if (item?.msg) return item.msg;
        if (item?.detail) return item.detail;
        if (item?.loc) return `${item.loc.join('.')} ${item.msg ?? ''}`.trim();
        return JSON.stringify(item);
      }).join(' | ');
    }
    return 'E-mail ou senha incorretos.';
  };

  // TODO: usar getLogin/saveToken/parseLoginError de verdade quando o
  // back-end estiver pronto. Por enquanto, o login é simulado: qualquer
  // envio do formulário redireciona direto para a tela do médico.
  async function sign_in() {
    setIsSubmitting(true);
    setErro("");
    try {
      // Simulação de chamada à API.
      await new Promise((resolve) => setTimeout(resolve, 400));
      window.location.href = '/';
    } catch {
      setErro("Não foi possível entrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      <div className="login-page-wrapper">
    <main className="login-container">
      <section className="login-card">
        <div className="logo-box">
          <img src={logo} alt="Clinix Consultas" className="logo" />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sign_in(); }}>
          <div className="input-group">
            <input type="email" id="user" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type={showPassword ? "text" : "password"} id="password" minLength={8} placeholder="Senha" onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="btn-login" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar na Conta'}
          </button>
          {erro && <p className="erro-msg">{erro}</p>}
        </form>
      </section>
      <aside className="promo-card">
        <h2>Área do Médico<br />Bom trabalho!</h2>
        <p>Acesse sua agenda e gerencie<br />seus pacientes</p>
      </aside>
    </main>
    </div>
  );
}

export default Login;