import React, { useEffect, useState } from 'react';
import './staffManagement.css';
import { Loader2, X, Check } from 'lucide-react';
import {
  listMedicos,
  listRecepcionistas,
  toggleFuncionarioStatus,
  criarNovoAcesso,
  type Funcionario,
  type NovoAcesso,
} from '../../../../services/adminService';

type Tab = 'medicos' | 'recepcionistas';

function StaffManagement() {
  const [tab, setTab] = useState<Tab>('medicos');
  const [medicos, setMedicos] = useState<Funcionario[]>([]);
  const [recepcionistas, setRecepcionistas] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  // Modal novo acesso
  const [modalAberto, setModalAberto] = useState(false);
  const [novoAcesso, setNovoAcesso] = useState<NovoAcesso>({
    nome: '', email: '', senha: '', tipo: 'medico', especialidade: '',
  });
  const [criando, setCriando] = useState(false);
  const [confirmandoAlteracoes, setConfirmandoAlteracoes] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([listMedicos(), listRecepcionistas()])
      .then(([meds, recs]) => { setMedicos(meds); setRecepcionistas(recs); })
      .finally(() => setLoading(false));
  }, []);

  const lista = tab === 'medicos' ? medicos : recepcionistas;

  const handleToggle = async (id: string, tipo: 'medico' | 'recepcionista') => {
    setToggling(id);
    await toggleFuncionarioStatus(id, tipo);
    if (tipo === 'medico') {
      setMedicos((prev) =>
        prev.map((m) => m.id === id ? { ...m, status: m.status === 'Ativo' ? 'Inativo' : 'Ativo' } : m)
      );
    } else {
      setRecepcionistas((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: r.status === 'Ativo' ? 'Inativo' : 'Ativo' } : r)
      );
    }
    setToggling(null);
  };

  const handleCriarAcesso = async () => {
    setCriando(true);
    await criarNovoAcesso(novoAcesso);
    setCriando(false);
    setModalAberto(false);
    setNovoAcesso({ nome: '', email: '', senha: '', tipo: 'medico', especialidade: '' });
  };

  const handleConfirmarAlteracoes = async () => {
    setConfirmandoAlteracoes(true);
    await new Promise((r) => setTimeout(r, 600));
    setConfirmandoAlteracoes(false);
    alert('Alterações confirmadas com sucesso!');
  };

  if (loading) {
    return (
      <div className="sm-loading">
        <Loader2 size={32} className="sm-spin" />
        <p>Carregando equipe...</p>
      </div>
    );
  }

  return (
    <div className="sm-container">
      <h1 className="sm-title">ADMINISTRAÇÃO DE EQUIPES E ACESSOS</h1>

      {/* Modal novo acesso */}
      {modalAberto && (
        <div className="sm-modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sm-modal-close" onClick={() => setModalAberto(false)}><X size={18} /></button>
            <h3 className="sm-modal-title">Criar Novo Acesso</h3>

            <label className="sm-label">Nome</label>
            <input className="sm-input" value={novoAcesso.nome}
              onChange={(e) => setNovoAcesso({ ...novoAcesso, nome: e.target.value })} />

            <label className="sm-label">E-mail</label>
            <input className="sm-input" type="email" value={novoAcesso.email}
              onChange={(e) => setNovoAcesso({ ...novoAcesso, email: e.target.value })} />

            <label className="sm-label">Senha</label>
            <input className="sm-input" type="password" value={novoAcesso.senha}
              onChange={(e) => setNovoAcesso({ ...novoAcesso, senha: e.target.value })} />

            <label className="sm-label">Tipo</label>
            <select className="sm-input" value={novoAcesso.tipo}
              onChange={(e) => setNovoAcesso({ ...novoAcesso, tipo: e.target.value as 'medico' | 'recepcionista' })}>
              <option value="medico">Médico</option>
              <option value="recepcionista">Recepcionista</option>
            </select>

            {novoAcesso.tipo === 'medico' && (
              <>
                <label className="sm-label">Especialidade</label>
                <input className="sm-input" value={novoAcesso.especialidade}
                  onChange={(e) => setNovoAcesso({ ...novoAcesso, especialidade: e.target.value })} />
              </>
            )}

            <div className="sm-modal-footer">
              <button className="sm-btn-cancel" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="sm-btn-save" onClick={handleCriarAcesso} disabled={criando}>
                {criando ? <Loader2 size={14} className="sm-spin" /> : <><Check size={14} /> Criar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="sm-card">
        <div className="sm-tabs">
          <button
            className={`sm-tab ${tab === 'recepcionistas' ? 'sm-tab--active' : ''}`}
            onClick={() => setTab('recepcionistas')}
          >
            RECEPCIONISTAS
          </button>
          <button
            className={`sm-tab ${tab === 'medicos' ? 'sm-tab--active' : ''}`}
            onClick={() => setTab('medicos')}
          >
            MÉDICOS
          </button>
        </div>

        <table className="sm-table">
          <thead>
            <tr>
              <th>Nome</th>
              {tab === 'medicos' && <th>Especialidade</th>}
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((f) => (
              <tr key={f.id}>
                <td className="sm-td-nome">{f.nome}</td>
                {tab === 'medicos' && <td className="sm-td-esp">{f.especialidade}</td>}
                <td className="sm-td-status">{f.status}</td>
                <td>
                  <button
                    className="sm-btn-toggle"
                    onClick={() => handleToggle(f.id, f.tipo)}
                    disabled={toggling === f.id}
                  >
                    {toggling === f.id ? <Loader2 size={13} className="sm-spin" /> : 'Desativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rodapé de ações */}
      <div className="sm-footer">
        <button className="sm-btn-new" onClick={() => setModalAberto(true)}>
          Criar Novo Acesso
        </button>
        <button className="sm-btn-confirm" onClick={handleConfirmarAlteracoes} disabled={confirmandoAlteracoes}>
          {confirmandoAlteracoes ? <Loader2 size={16} className="sm-spin" /> : 'Confirmar Alterações'}
        </button>
      </div>
    </div>
  );
}

export default StaffManagement;
