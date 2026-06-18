import React, { useState } from 'react';
import { User, LogOut, Eye, EyeOff } from 'lucide-react';
import './configs.css';
import { removeToken } from '../../../../services/tokenService';

interface ConfigsProps {
    userName: string; 
}

export const Configs = ({ userName }: ConfigsProps) => {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarAtual, setMostrarAtual] = useState(false);
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [email, setEmail] = useState('exemplo@gamil.com');
  const [telefone, setTelefone] = useState('(00) 9 9999-9999');

  const handleSalvarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvar nova senha clicado");
  };

  const handleSalvarContato = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvar contato clicado");
  };

  const handleLogout = () => {
    removeToken();
    window.location.href = "/authenticantion.html";
  };

  return (
    <div className="set-container">
      
      <div className="set-header">
        <h1 className="set-title">Configurações</h1>
        
        <div className="set-profile-card">
          <div className="set-profile-left">
            <div className="set-avatar-placeholder">
              <User size={28} color="#ffffff" strokeWidth={2} />
            </div>
            <div className="set-profile-info">
              <h2 className="set-profile-name">{userName.split(" ")[0]}!</h2>
              <p className="set-profile-role">Paciente</p>
            </div>
          </div>
          <button className="set-logout-btn" onClick={handleLogout} title="Sair do sistema">
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="set-grid">
        
        {/* CARD 1: Alterar Senha */}
        <div className="set-card">
          <h2 className="set-card-title">Alterar Senha</h2>
          
          <form onSubmit={handleSalvarSenha} className="set-form">
            <div className="set-input-group">
              <label>Senha atual</label>
              <div className="set-password-field">
                <input 
                  type={mostrarAtual ? 'text' : 'password'}
                  placeholder="Digite sua senha atual" 
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
                <button type="button" className="set-password-toggle" onClick={() => setMostrarAtual(!mostrarAtual)}>
                  {mostrarAtual ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="set-input-group">
              <label>Nova senha</label>
              <div className="set-password-field">
                <input 
                  type={mostrarNova ? 'text' : 'password'}
                  placeholder="Digite nova senha forte" 
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
                <button type="button" className="set-password-toggle" onClick={() => setMostrarNova(!mostrarNova)}>
                  {mostrarNova ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="set-input-group">
              <label>Confirmar nova senha</label>
              <div className="set-password-field">
                <input 
                  type={mostrarConfirmar ? 'text' : 'password'}
                  placeholder="Repita nova senha" 
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <button type="button" className="set-password-toggle" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                  {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="set-btn">
              Salvar nova senha
            </button>
          </form>
        </div>

        {/* CARD 2: Informações de Contato */}
        <div className="set-card">
          <h2 className="set-card-title">Informações de Contato</h2>
          
          <form onSubmit={handleSalvarContato} className="set-form">
            <div className="set-input-group">
              <label>E-mail</label>
              <input 
                type="email" 
                placeholder="exemplo@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="set-input-group">
              <label>Telefone</label>
              <input 
                type="text" 
                placeholder="(00) 9 9999-9999" 
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <button type="submit" className="set-btn" style={{marginTop: 'auto'}}>
              Salvar alterações de contato
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Configs;