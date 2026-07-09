import React, { useEffect, useState } from 'react';
import './servicesSpecialties.css';
import { Loader2, X, Check, Plus } from 'lucide-react';
import {
  listServicos,
  listEspecialidades,
  updateServico,
  criarServico,
  deleteEspecialidade,
  type Servico,
  type Especialidade,
  type NovoServico,
} from '../../../../services/adminService';

function ServicesSpecialties() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de edição de serviço
  const [editandoServico, setEditandoServico] = useState<Servico | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editEsp, setEditEsp] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Modal de criação de serviço
  const [criandoServico, setCriandoServico] = useState(false);
  const [novoServico, setNovoServico] = useState<NovoServico>({ nome: '', especialidade: '', preco: 0 });
  const [salvandoNovo, setSalvandoNovo] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([listServicos(), listEspecialidades()])
      .then(([svcs, esps]) => {
        setServicos(svcs);
        setEspecialidades(esps);
      })
      .finally(() => setLoading(false));
  }, []);

  const abrirEdicao = (s: Servico) => {
    setEditandoServico(s);
    setEditNome(s.nome);
    setEditEsp(s.especialidade);
    setEditPreco(String(s.preco));
  };

  const salvarEdicao = async () => {
    if (!editandoServico) return;
    setSalvando(true);
    await updateServico(editandoServico.id, {
      nome: editNome,
      especialidade: editEsp,
      preco: Number(editPreco),
    });
    setServicos((prev) =>
      prev.map((s) =>
        s.id === editandoServico.id
          ? { ...s, nome: editNome, especialidade: editEsp, preco: Number(editPreco) }
          : s
      )
    );
    setSalvando(false);
    setEditandoServico(null);
  };

  const excluirEspecialidade = async (id: string) => {
    await deleteEspecialidade(id);
    setEspecialidades((prev) => prev.filter((e) => e.id !== id));
  };

  const abrirCriacao = () => {
    setNovoServico({ nome: '', especialidade: especialidades[0]?.nome ?? '', preco: 0 });
    setCriandoServico(true);
  };

  const salvarNovoServico = async () => {
    if (!novoServico.nome || !novoServico.especialidade) return;
    setSalvandoNovo(true);
    const criado = await criarServico(novoServico);
    setServicos((prev) => [...prev, criado]);
    if (!especialidades.some((e) => e.nome.toLowerCase() === novoServico.especialidade.toLowerCase())) {
      setEspecialidades((prev) => [
        ...prev,
        { id: `tmp-${Date.now()}`, nome: novoServico.especialidade, qtdProfissionais: 0 },
      ]);
    }
    setSalvandoNovo(false);
    setCriandoServico(false);
  };

  if (loading) {
    return (
      <div className="ss-loading">
        <Loader2 size={32} className="ss-spin" />
        <p>Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="ss-container">
      <h1 className="ss-title">Gestão de Serviços e Especialidades</h1>

      {/* Modal edição de serviço */}
      {editandoServico && (
        <div className="ss-modal-overlay" onClick={() => setEditandoServico(null)}>
          <div className="ss-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ss-modal-close" onClick={() => setEditandoServico(null)}>
              <X size={18} />
            </button>
            <h3 className="ss-modal-title">Editar Serviço</h3>

            <label className="ss-label">Nome</label>
            <input className="ss-input" value={editNome} onChange={(e) => setEditNome(e.target.value)} />

            <label className="ss-label">Especialidade</label>
            <input className="ss-input" value={editEsp} onChange={(e) => setEditEsp(e.target.value)} />

            <label className="ss-label">Preço (R$)</label>
            <input className="ss-input" type="number" value={editPreco} onChange={(e) => setEditPreco(e.target.value)} />

            <div className="ss-modal-footer">
              <button className="ss-btn-cancel" onClick={() => setEditandoServico(null)}>Cancelar</button>
              <button className="ss-btn-save" onClick={salvarEdicao} disabled={salvando}>
                {salvando ? <Loader2 size={14} className="ss-spin" /> : <><Check size={14} /> Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal criação de serviço */}
      {criandoServico && (
        <div className="ss-modal-overlay" onClick={() => setCriandoServico(false)}>
          <div className="ss-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ss-modal-close" onClick={() => setCriandoServico(false)}>
              <X size={18} />
            </button>
            <h3 className="ss-modal-title">Criar Serviço</h3>

            <label className="ss-label">Nome</label>
            <input
              className="ss-input"
              placeholder="Ex.: Consulta de Rotina"
              value={novoServico.nome}
              onChange={(e) => setNovoServico({ ...novoServico, nome: e.target.value })}
            />

            <label className="ss-label">Especialidade</label>
            <input
              className="ss-input"
              list="ss-especialidades-lista"
              placeholder="Ex.: Cardiologia"
              value={novoServico.especialidade}
              onChange={(e) => setNovoServico({ ...novoServico, especialidade: e.target.value })}
            />
            <datalist id="ss-especialidades-lista">
              {especialidades.map((e) => (
                <option key={e.id} value={e.nome} />
              ))}
            </datalist>

            <label className="ss-label">Preço (R$)</label>
            <input
              className="ss-input"
              type="number"
              min={0}
              value={novoServico.preco}
              onChange={(e) => setNovoServico({ ...novoServico, preco: Number(e.target.value) })}
            />

            <div className="ss-modal-footer">
              <button className="ss-btn-cancel" onClick={() => setCriandoServico(false)}>Cancelar</button>
              <button
                className="ss-btn-save"
                onClick={salvarNovoServico}
                disabled={salvandoNovo || !novoServico.nome || !novoServico.especialidade}
              >
                {salvandoNovo ? <Loader2 size={14} className="ss-spin" /> : <><Check size={14} /> Criar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISÃO GERAL DE SERVIÇOS */}
      <div className="ss-section">
        <div className="ss-section-header">
          <h2 className="ss-section-title">VISÃO GERAL DE SERVIÇOS</h2>
          <button className="ss-btn-criar" onClick={abrirCriacao}>
            <Plus size={15} /> Criar Serviço
          </button>
        </div>
        <table className="ss-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((s) => (
              <tr key={s.id}>
                <td>{s.nome}</td>
                <td>{s.especialidade}</td>
                <td>R${s.preco.toLocaleString('pt-BR')}</td>
                <td>
                  <button className="ss-btn-edit" onClick={() => abrirEdicao(s)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GESTÃO DE ESPECIALIDADES */}
      <div className="ss-section">
        <h2 className="ss-section-title">GESTÃO DE ESPECIALIDADES</h2>
        <table className="ss-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Qtd. Profissionais</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {especialidades.map((e) => (
              <tr key={e.id}>
                <td>{e.nome}</td>
                <td>{e.qtdProfissionais}</td>
                <td>
                  <button className="ss-btn-delete" onClick={() => excluirEspecialidade(e.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServicesSpecialties;
