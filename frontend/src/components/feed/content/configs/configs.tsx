import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react'; // Importado o ícone LogOut
import './configs.css';
import { removeToken } from '../../../../services/tokenService';

interface ConfigsProps {
    userName: string; 
}

export const Configs = ({ userName }: ConfigsProps) => {
  // Estados para o formulário de Senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados para o formulário de Contato
  const [email, setEmail] = useState('exemplo@gamil.com');
  const [telefone, setTelefone] = useState('(00) 9 9999-9999');

  const handleSalvarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvar nova senha clicado");
    // Lógica da API aqui
  };

  const handleSalvarContato = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvar contato clicado");
    // Lógica da API aqui
  };

  // Função para gerenciar o clique de logout
  const handleLogout = () => {
    removeToken();                                    // apaga o token do localStorage
    window.location.href = "/authenticantion.html";
  };

  return (
    <div className="set-container">
      
      {/* Cabeçalho: Título e Card de Perfil */}
      <div className="set-header">
        <h1 className="set-title">Configurações</h1>
        
        <div className="set-profile-card">
          <div className="set-profile-left">
            <div className="set-avatar-placeholder">
              <User size={36} color="#ffffff" strokeWidth={2} />
            </div>
            <div className="set-profile-info">
              <h2 className="set-profile-name">{userName.split(" ")[0]}!</h2>
              <p className="set-profile-role">Paciente</p>
            </div>
          </div>

          {/* Novo Botão de Logout */}
          <button className="set-logout-btn" onClick={handleLogout} title="Sair do sistema">
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Grid de Formulários */}
      <div className="set-grid">
        
        {/* CARD 1: Alterar Senha */}
        <div className="set-card">
          <h2 className="set-card-title">Alterar Senha</h2>
          
          <form onSubmit={handleSalvarSenha} className="set-form">
            <div className="set-input-group">
              <label>Senha atual</label>
              <input 
                type="password" 
                placeholder="Digite sua senha atual" 
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
            </div>
            
            <div className="set-input-group">
              <label>Nova senha</label>
              <input 
                type="password" 
                placeholder="Digite nova senha forte" 
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>
            
            <div className="set-input-group">
              <label>Confirmar nova senha</label>
              <input 
                type="password" 
                placeholder="Repita nova senha" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
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