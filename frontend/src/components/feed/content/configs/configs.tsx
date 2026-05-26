import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import './configs.css';

// 1. Definimos a interface (formato do JSON) que o backend vai nos enviar
interface UserProfile {
  nome: string;
  perfil: string;
  email: string;
  telefone: string;
}

export const Configs = () => {
  // 2. Estado principal do usuário começa "vazio" (null)
  const [usuario, setUsuario] = useState<UserProfile | null>(null);

  // Estados para o formulário de Senha (iniciam vazios)
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados para o formulário de Contato (iniciam vazios)
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  // 3. useEffect para buscar os dados assim que a tela carregar
  useEffect(() => {
    // AQUI ENTRARÁ SUA REQUISIÇÃO REAL:
    // fetch('https://sua-api.com/usuario/perfil')
    //   .then(res => res.json())
    //   .then((data: UserProfile) => {
    //      setUsuario(data);
    //      setEmail(data.email);
    //      setTelefone(data.telefone);
    //   });

    // Simulando a chegada do JSON do backend para você ver funcionando:
    const mockJsonBackend: UserProfile = {
      nome: "Sr. João Silva",
      perfil: "Paciente",
      email: "exemplo@gmail.com",
      telefone: "(00) 9 9999-9999"
    };

    // Preenchemos os estados com as informações que vieram da "API"
    setUsuario(mockJsonBackend);
    setEmail(mockJsonBackend.email);
    setTelefone(mockJsonBackend.telefone);
  }, []);

  const handleSalvarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    // JSON que será enviado no POST/PUT de alteração de senha
    const payloadSenha = {
      senhaAtual,
      novaSenha,
      confirmarSenha
    };
    console.log("Enviando JSON de nova senha:", payloadSenha);
  };

  const handleSalvarContato = (e: React.FormEvent) => {
    e.preventDefault();
    // JSON que será enviado no POST/PUT de alteração de contato
    const payloadContato = {
      email,
      telefone
    };
    console.log("Enviando JSON de contato:", payloadContato);
  };

  return (
    <div className="set-container">
      
      {/* Cabeçalho: Título e Card de Perfil */}
      <div className="set-header">
        <h1 className="set-title">Configurações</h1>
        
        <div className="set-profile-card">
          <div className="set-avatar-placeholder">
            <User size={36} color="#ffffff" strokeWidth={2} />
          </div>
          <div className="set-profile-info">
            {/* Renderiza o nome se o JSON já chegou, senão mostra "Carregando..." */}
            <h2 className="set-profile-name">{usuario ? usuario.nome : 'Carregando...'}</h2>
            <p className="set-profile-role">{usuario ? usuario.perfil : '...'}</p>
          </div>
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
                required
              />
            </div>
            
            <div className="set-input-group">
              <label>Nova senha</label>
              <input 
                type="password" 
                placeholder="Digite nova senha forte" 
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
            </div>
            
            <div className="set-input-group">
              <label>Confirmar nova senha</label>
              <input 
                type="password" 
                placeholder="Repita nova senha" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
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