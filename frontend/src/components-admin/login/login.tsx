import React from 'react';
import './login.css';
import logo from '../../assets/images/logoNome.png';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {
  changeAuth: (valor: number) => void;
};

function Login({ changeAuth }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: integrar com endpoint real de autenticação do administrador da
  // clínica quando o back-end estiver pronto. Por enquanto, o login é
  // simulado: qualquer envio do formulário redireciona direto para o
  // dashboard administrativo da clínica.
  async function sign_in() {
    setIsSubmitting(true);
    setErro("");
    try {
      // Simulação de chamada à API.
      await new Promise((resolve) => setTimeout(resolve, 400));
      window.location.href = "/admin.html";
    } catch {
      setErro("Não foi possível entrar. Tente novamente.");
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
        <h2>Área do Administrador<br />Bem-vindo de volta!</h2>
        <p>Gerencie serviços, especialidades,<br />equipe e agenda da sua clínica</p>
      </aside>
    </main>
  );
}

export default Login;