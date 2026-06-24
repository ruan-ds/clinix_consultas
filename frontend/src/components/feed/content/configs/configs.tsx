import React, { useState, useEffect } from 'react';
import { User, LogOut, Eye, EyeOff } from 'lucide-react';
import './configs.css';
import { removeToken } from '../../../../services/tokenService';
import {
  getPatientContact,
  updatePatientContact,
  updatePatientPassword,
} from '../../../../services/patientService';

interface ConfigsProps {
    userName: string; 
}

export const Configs = ({ userName }: ConfigsProps) => {
  // Estados para o formulário de Senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Estados para o formulário de Contato
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loadingContato, setLoadingContato] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setLoadingContato(true);
    getPatientContact()
      .then((data) => {
        setEmail(data.email);
        setTelefone(data.phone ?? '');
      })
      .catch(() => {
        setErro('Não foi possível carregar os dados de contato.');
      })
      .finally(() => setLoadingContato(false));
  }, []);

  const handleSalvarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    setLoadingSenha(true);

    try {
      await updatePatientPassword({
        current_password: senhaAtual,
        new_password: novaSenha,
        confirm_password: confirmarSenha,
      });
      setMensagem('Senha atualizada com sucesso.');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error: any) {
      setErro(error.response?.data?.detail || 'Erro ao atualizar a senha.');
    } finally {
      setLoadingSenha(false);
    }
  };

  const handleSalvarContato = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    setLoadingContato(true);

    try {
      await updatePatientContact({
        email,
        phone: telefone,
      });
      setMensagem('Contato atualizado com sucesso.');
    } catch (error: any) {
      setErro(error.response?.data?.detail || 'Erro ao atualizar o contato.');
    } finally {
      setLoadingContato(false);
    }
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
            <div className="set-input-group password-group">
              <label>Senha atual</label>
              <div className="set-password-field">
                <input 
                  type={showSenhaAtual ? 'text' : 'password'} 
                  placeholder="Digite sua senha atual" 
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
                <button
                  type="button"
                  className="set-password-toggle"
                  onClick={() => setShowSenhaAtual((prev) => !prev)}
                  aria-label={showSenhaAtual ? 'Ocultar senha atual' : 'Mostrar senha atual'}
                >
                  {showSenhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="set-input-group password-group">
              <label>Nova senha</label>
              <div className="set-password-field">
                <input 
                  type={showNovaSenha ? 'text' : 'password'} 
                  placeholder="Digite nova senha forte" 
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="set-password-toggle"
                  onClick={() => setShowNovaSenha((prev) => !prev)}
                  aria-label={showNovaSenha ? 'Ocultar nova senha' : 'Mostrar nova senha'}
                >
                  {showNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="set-input-group password-group">
              <label>Confirmar nova senha</label>
              <div className="set-password-field">
                <input 
                  type={showConfirmarSenha ? 'text' : 'password'} 
                  placeholder="Repita nova senha" 
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="set-password-toggle"
                  onClick={() => setShowConfirmarSenha((prev) => !prev)}
                  aria-label={showConfirmarSenha ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                >
                  {showConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="set-btn" disabled={loadingSenha}>
              {loadingSenha ? 'Salvando...' : 'Salvar nova senha'}
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
                required
              />
            </div>
            
            <div className="set-input-group">
              <label>Telefone</label>
              <input 
                type="text" 
                placeholder="(00) 9 9999-9999" 
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="set-btn" disabled={loadingContato}>
              {loadingContato ? 'Salvando...' : 'Salvar alterações de contato'}
            </button>
          </form>
        </div>

      </div>
      {(mensagem || erro) && (
        <div className="set-feedback">
          {mensagem && <p className="set-success">{mensagem}</p>}
          {erro && <p className="set-error">{erro}</p>}
        </div>
      )}
    </div>
  );
};

export default Configs;