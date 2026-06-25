import React, { useEffect, useState } from 'react';
import { Search, Loader2, KeyRound } from 'lucide-react';
import './masterConfig.css';
import {
  listClinicsForDeactivation,
  toggleClinicStatus,
  listClinicAccessForDeactivation,
  toggleClinicAccessStatus,
  listClinixAccessForDeactivation,
  toggleClinixAccessStatus,
  updateMasterPassword,
  type ClinicForDeactivation,
  type ClinicAccessForDeactivation,
  type ClinixAccessForDeactivation,
} from '../../../../services/clinixService';

export const MasterConfig = () => {
  const [clinics, setClinics] = useState<ClinicForDeactivation[]>([]);
  const [clinicAccess, setClinicAccess] = useState<ClinicAccessForDeactivation[]>([]);
  const [clinixAccess, setClinixAccess] = useState<ClinixAccessForDeactivation[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [buscaUsuarioSenha, setBuscaUsuarioSenha] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [atualizandoSenha, setAtualizandoSenha] = useState(false);

  const [buscaFuncionario, setBuscaFuncionario] = useState('');
  const [buscaUsuarioClinix, setBuscaUsuarioClinix] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      listClinicsForDeactivation(),
      listClinicAccessForDeactivation(),
      listClinixAccessForDeactivation(),
    ])
      .then(([clinicsData, clinicAccessData, clinixAccessData]) => {
        setClinics(clinicsData);
        setClinicAccess(clinicAccessData);
        setClinixAccess(clinixAccessData);
      })
      .catch(() => setErro('Não foi possível carregar a configuração master.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAtualizarSenha = async () => {
    if (!buscaUsuarioSenha || !novaSenha || novaSenha !== confirmarSenha) {
      setErro('Verifique o usuário e se as senhas coincidem.');
      return;
    }
    setAtualizandoSenha(true);
    setErro(null);
    try {
      await updateMasterPassword({ user_id: buscaUsuarioSenha, new_password: novaSenha });
      setNovaSenha('');
      setConfirmarSenha('');
      setBuscaUsuarioSenha('');
    } catch {
      setErro('Não foi possível atualizar a senha.');
    } finally {
      setAtualizandoSenha(false);
    }
  };

  const handleToggleClinic = async (id: string) => {
    try {
      await toggleClinicStatus(id);
      setClinics((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c)));
    } catch {
      setErro('Não foi possível alterar o status da clínica.');
    }
  };

  const handleToggleClinicAccess = async (id: string) => {
    try {
      await toggleClinicAccessStatus(id);
      setClinicAccess((prev) => prev.map((a) => (a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a)));
    } catch {
      setErro('Não foi possível alterar o status do acesso clínico.');
    }
  };

  const handleToggleClinixAccess = async (id: string) => {
    try {
      await toggleClinixAccessStatus(id);
      setClinixAccess((prev) => prev.map((a) => (a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a)));
    } catch {
      setErro('Não foi possível alterar o status do acesso Clinix.');
    }
  };

  const funcionariosFiltrados = clinicAccess.filter((a) =>
    a.employee_name.toLowerCase().includes(buscaFuncionario.toLowerCase())
  );

  const usuariosClinixFiltrados = clinixAccess.filter((a) =>
    a.name.toLowerCase().includes(buscaUsuarioClinix.toLowerCase())
  );

  if (loading) {
    return (
      <div className="mc-loading">
        <Loader2 size={36} className="mc-spin" />
        <p>Carregando configuração master...</p>
      </div>
    );
  }

  return (
    <div className="mc-container">
      <h1 className="mc-title">Configuração Master</h1>
      {erro && <p className="mc-erro">{erro}</p>}

      <div className="mc-row-2">
        <div className="mc-card">
          <h2 className="mc-section-title"><KeyRound size={16} /> Alterar Senha de Acesso</h2>
          <div className="mc-search-wrap">
            <Search size={14} className="mc-search-icon" />
            <input
              className="mc-search-input"
              placeholder="pesquisar usuário..."
              value={buscaUsuarioSenha}
              onChange={(e) => setBuscaUsuarioSenha(e.target.value)}
            />
          </div>
          <div className="mc-password-grid">
            <input className="mc-input" type="password" placeholder="Nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
            <input className="mc-input" type="password" placeholder="Confirmar senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
          </div>
          <button className="mc-btn-primary" onClick={handleAtualizarSenha} disabled={atualizandoSenha}>
            {atualizandoSenha ? <Loader2 size={16} className="mc-spin" /> : 'Atualizar Senha'}
          </button>
        </div>

        <div className="mc-card">
          <h2 className="mc-section-title">Desativar Clínica</h2>
          <div className="mc-table-header mc-table-header--3">
            <span>ID Clinica</span>
            <span>Nome da Clínica</span>
            <span>Status</span>
            <span>Ações</span>
          </div>
          <div className="mc-table-body">
            {clinics.map((c) => (
              <div key={c.id} className="mc-table-row mc-table-row--3">
                <span>{c.id}</span>
                <span>{c.name}</span>
                <span className={`mc-status mc-status--${c.status}`}>{c.status === 'active' ? 'Ativa' : 'Inativa'}</span>
                <span>
                  <button
                    className={c.status === 'active' ? 'mc-btn-danger' : 'mc-btn-success'}
                    onClick={() => handleToggleClinic(c.id)}
                  >
                    {c.status === 'active' ? 'Desativar' : 'Ativar'}
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mc-card">
        <div className="mc-list-header">
          <h2 className="mc-section-title">Desativar Acesso Clínico</h2>
          <div className="mc-search-wrap">
            <Search size={14} className="mc-search-icon" />
            <input
              className="mc-search-input"
              placeholder="pesquisar funcionário..."
              value={buscaFuncionario}
              onChange={(e) => setBuscaFuncionario(e.target.value)}
            />
          </div>
        </div>
        <div className="mc-table-header mc-table-header--5">
          <span>ID Func.</span>
          <span>Nome do Func.</span>
          <span>CPF</span>
          <span>Nome Clínica</span>
          <span>Cargo</span>
          <span>Status</span>
          <span>Ações</span>
        </div>
        <div className="mc-table-body">
          {funcionariosFiltrados.map((a) => (
            <div key={a.id} className="mc-table-row mc-table-row--5">
              <span>{a.id}</span>
              <span>{a.employee_name}</span>
              <span>{a.cpf}</span>
              <span>{a.clinic_name}</span>
              <span>{a.role}</span>
              <span className={`mc-status mc-status--${a.status}`}>{a.status === 'active' ? 'Ativa' : 'Inativa'}</span>
              <span>
                <button
                  className={a.status === 'active' ? 'mc-btn-danger' : 'mc-btn-success'}
                  onClick={() => handleToggleClinicAccess(a.id)}
                >
                  {a.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>
              </span>
            </div>
          ))}
        </div>
        <div className="mc-pagination">
          Anterior | <span className="mc-page mc-page--active">1</span> 2 3 ... 10 | Próximo
        </div>
      </div>

      <div className="mc-card">
        <div className="mc-list-header">
          <h2 className="mc-section-title">Desativar Acesso Clinix</h2>
          <div className="mc-search-wrap">
            <Search size={14} className="mc-search-icon" />
            <input
              className="mc-search-input"
              placeholder="pesquisar usuário..."
              value={buscaUsuarioClinix}
              onChange={(e) => setBuscaUsuarioClinix(e.target.value)}
            />
          </div>
        </div>
        <div className="mc-table-header mc-table-header--4">
          <span>ID Usuário</span>
          <span>Nome do Func.</span>
          <span>CPF</span>
          <span>Status</span>
          <span>Ações</span>
        </div>
        <div className="mc-table-body">
          {usuariosClinixFiltrados.map((a) => (
            <div key={a.id} className="mc-table-row mc-table-row--4">
              <span>{a.id}</span>
              <span>{a.name}</span>
              <span>{a.cpf}</span>
              <span className={`mc-status mc-status--${a.status}`}>{a.status === 'active' ? 'Ativa' : 'Inativa'}</span>
              <span>
                <button
                  className={a.status === 'active' ? 'mc-btn-danger' : 'mc-btn-success'}
                  onClick={() => handleToggleClinixAccess(a.id)}
                >
                  {a.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>
              </span>
            </div>
          ))}
        </div>
        <div className="mc-pagination">
          Anterior | <span className="mc-page mc-page--active">1</span> 2 3 ... 10 | Próximo
        </div>
      </div>
    </div>
  );
};

export default MasterConfig;
