import React, { useEffect, useState } from 'react';
import { User, LogOut, Eye, EyeOff } from 'lucide-react';
import './configs.css';
import { removeToken } from '../../../../services/tokenService';
import { getPatientContact, updatePatientContact, updatePatientPassword } from '../../../../services/patientService';

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

  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loadingContato, setLoadingContato] = useState(true);
  const [contatoStatus, setContatoStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [senhaStatus, setSenhaStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadContact() {
      try {
        const contact = await getPatientContact();
        setEmail(contact.email ?? '');
        setTelefone(contact.phone ?? '');
      } catch (error) {
        console.error('Erro ao carregar contato', error);
      } finally {
        setLoadingContato(false);
      }
    }

    loadContact();
  }, []);

  const handleSalvarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setSenhaStatus(null);

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setSenhaStatus({ type: 'error', message: 'Preencha todos os campos de senha.' });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setSenhaStatus({ type: 'error', message: 'A nova senha e a confirmação não coincidem.' });
      return;
    }

    try {
      await updatePatientPassword({
        current_password: senhaAtual,
        new_password: novaSenha,
        confirm_password: confirmarSenha,
      });

      setSenhaStatus({ type: 'success', message: 'Senha atualizada com sucesso.' });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      console.error('Erro ao salvar senha', error);
      setSenhaStatus({ type: 'error', message: 'Não foi possível atualizar a senha. Verifique seus dados.' });
    }
  };

  const handleSalvarContato = async (e: React.FormEvent) => {
    e.preventDefault();
    setContatoStatus(null);

    try {
      await updatePatientContact({
        email,
        phone: telefone || undefined,
      });
      setContatoStatus({ type: 'success', message: 'Informações de contato atualizadas.' });
    } catch (error) {
      console.error('Erro ao salvar contato', error);
      setContatoStatus({ type: 'error', message: 'Não foi possível atualizar as informações de contato. Tente novamente.' });
    }
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

          {senhaStatus && (
            <div className="set-feedback">
              <p className={senhaStatus.type === 'success' ? 'set-success' : 'set-error'}>
                {senhaStatus.message}
              </p>
            </div>
          )}
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

          {contatoStatus && (
            <div className="set-feedback">
              <p className={contatoStatus.type === 'success' ? 'set-success' : 'set-error'}>
                {contatoStatus.message}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Configs;