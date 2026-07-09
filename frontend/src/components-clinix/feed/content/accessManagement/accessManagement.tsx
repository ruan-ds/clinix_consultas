import React, { useEffect, useState } from 'react';
import { Search, Loader2, User, Building2, ShieldCheck, Mail, Lock } from 'lucide-react';
import './accessManagement.css';
import {
  listClinics,
  searchPersons,
  registerPerson,
  createClinicAccess,
  createBpoAccess,
  listClinicUsers,
  toggleClinicUserStatus,
  type Clinic,
  type Person,
  type AccessProfile,
  type NewPersonData,
  type ClinicUser,
} from '../../../../services/clinixService';

const initialPersonForm: NewPersonData = {
  name: '',
  phone: '',
  gender: '',
  cpf: '',
  street: '',
  number: '',
  complement: '',
  city: '',
  state: '',
};

export const AccessManagement = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [users, setUsers] = useState<ClinicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Criar Acesso Clínico
  const [buscaPessoaClinico, setBuscaPessoaClinico] = useState('');
  const [pessoasClinico, setPessoasClinico] = useState<Person[]>([]);
  const [pessoaSelecionadaClinico, setPessoaSelecionadaClinico] = useState<Person | null>(null);
  const [buscaClinica, setBuscaClinica] = useState('');
  const [clinicaSelecionada, setClinicaSelecionada] = useState<Clinic | null>(null);
  const [perfilAcesso, setPerfilAcesso] = useState<AccessProfile>('receptionist');
  const [vinculandoClinico, setVinculandoClinico] = useState(false);

  // Criar Acesso BPO
  const [buscaPessoaBpo, setBuscaPessoaBpo] = useState('');
  const [pessoasBpo, setPessoasBpo] = useState<Person[]>([]);
  const [pessoaSelecionadaBpo, setPessoaSelecionadaBpo] = useState<Person | null>(null);
  const [emailBpo, setEmailBpo] = useState('');
  const [senhaBpo, setSenhaBpo] = useState('');
  const [vinculandoBpo, setVinculandoBpo] = useState(false);

  // Cadastrar Nova Pessoa
  const [personForm, setPersonForm] = useState<NewPersonData>(initialPersonForm);
  const [cadastrandoPessoa, setCadastrandoPessoa] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([listClinics(), listClinicUsers()])
      .then(([clinicsData, usersData]) => {
        setClinics(clinicsData);
        setUsers(usersData);
      })
      .catch(() => setErro('Não foi possível carregar os dados de acesso.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (buscaPessoaClinico.trim().length === 0) {
      setPessoasClinico([]);
      return;
    }
    searchPersons(buscaPessoaClinico).then(setPessoasClinico).catch(() => {});
  }, [buscaPessoaClinico]);

  useEffect(() => {
    if (buscaPessoaBpo.trim().length === 0) {
      setPessoasBpo([]);
      return;
    }
    searchPersons(buscaPessoaBpo).then(setPessoasBpo).catch(() => {});
  }, [buscaPessoaBpo]);

  const clinicasFiltradas = clinics.filter((c) =>
    c.trade_name.toLowerCase().includes(buscaClinica.toLowerCase())
  );

  const handleVincularClinico = async () => {
    if (!pessoaSelecionadaClinico || !clinicaSelecionada) {
      setErro('Selecione uma pessoa e uma clínica associada.');
      return;
    }
    setVinculandoClinico(true);
    setErro(null);
    try {
      await createClinicAccess({
        person_id: pessoaSelecionadaClinico.id,
        clinic_id: clinicaSelecionada.id,
        profile: perfilAcesso,
      });
      setPessoaSelecionadaClinico(null);
      setClinicaSelecionada(null);
      setBuscaPessoaClinico('');
      setBuscaClinica('');
    } catch {
      setErro('Não foi possível vincular o acesso clínico.');
    } finally {
      setVinculandoClinico(false);
    }
  };

  const handleVincularBpo = async () => {
    if (!pessoaSelecionadaBpo || !emailBpo || !senhaBpo) {
      setErro('Selecione uma pessoa e informe email e senha.');
      return;
    }
    setVinculandoBpo(true);
    setErro(null);
    try {
      await createBpoAccess({
        person_id: pessoaSelecionadaBpo.id,
        email: emailBpo,
        password: senhaBpo,
      });
      setPessoaSelecionadaBpo(null);
      setEmailBpo('');
      setSenhaBpo('');
      setBuscaPessoaBpo('');
    } catch {
      setErro('Não foi possível vincular o acesso BPO.');
    } finally {
      setVinculandoBpo(false);
    }
  };

  const handlePersonFieldChange = (field: keyof NewPersonData, value: string) => {
    setPersonForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCadastrarPessoa = async () => {
    if (!personForm.name || !personForm.cpf) {
      setErro('Preencha ao menos Nome completo e CPF.');
      return;
    }
    setCadastrandoPessoa(true);
    setErro(null);
    try {
      await registerPerson(personForm);
      setPersonForm(initialPersonForm);
    } catch {
      setErro('Não foi possível cadastrar a pessoa.');
    } finally {
      setCadastrandoPessoa(false);
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      await toggleClinicUserStatus(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
      );
    } catch {
      setErro('Não foi possível alterar o status do acesso.');
    }
  };

  if (loading) {
    return (
      <div className="am-loading">
        <Loader2 size={36} className="am-spin" />
        <p>Carregando gestão de acesso...</p>
      </div>
    );
  }

  return (
    <div className="am-container">
      <h1 className="am-title">Gestão de Acesso</h1>
      {erro && <p className="am-erro">{erro}</p>}

      <div className="am-card">
        <h2 className="am-section-title">Criar Acesso Clínico</h2>
        <div className="am-grid-3">
          <div className="am-column">
            <h3 className="am-column-title"><User size={16} /> Pessoa</h3>
            <div className="am-search-wrap">
              <Search size={14} className="am-search-icon" />
              <input
                className="am-search-input"
                placeholder="pesquisar pessoa..."
                value={buscaPessoaClinico}
                onChange={(e) => { setBuscaPessoaClinico(e.target.value); setPessoaSelecionadaClinico(null); }}
              />
            </div>
            {pessoaSelecionadaClinico ? (
              <span className="am-chip am-chip--selected">{pessoaSelecionadaClinico.name}</span>
            ) : (
              pessoasClinico.map((p) => (
                <button key={p.id} className="am-chip" onClick={() => { setPessoaSelecionadaClinico(p); setBuscaPessoaClinico(p.name); }}>
                  {p.name}
                </button>
              ))
            )}
          </div>

          <div className="am-column">
            <h3 className="am-column-title"><Building2 size={16} /> Clínica Associada</h3>
            <div className="am-search-wrap">
              <Search size={14} className="am-search-icon" />
              <input
                className="am-search-input"
                placeholder="pesquisar clínica associada..."
                value={buscaClinica}
                onChange={(e) => { setBuscaClinica(e.target.value); setClinicaSelecionada(null); }}
              />
            </div>
            {clinicaSelecionada ? (
              <span className="am-chip am-chip--selected">{clinicaSelecionada.trade_name}</span>
            ) : (
              buscaClinica && clinicasFiltradas.map((c) => (
                <button key={c.id} className="am-chip" onClick={() => { setClinicaSelecionada(c); setBuscaClinica(c.trade_name); }}>
                  {c.trade_name}
                </button>
              ))
            )}
          </div>

          <div className="am-column">
            <h3 className="am-column-title"><ShieldCheck size={16} /> Perfil de Acesso</h3>
            <div className="am-radio-group">
              <label className="am-radio">
                <input type="radio" checked={perfilAcesso === 'admin'} onChange={() => setPerfilAcesso('admin')} />
                Administrador
              </label>
              <label className="am-radio">
                <input type="radio" checked={perfilAcesso === 'receptionist'} onChange={() => setPerfilAcesso('receptionist')} />
                Recepcionista
              </label>
              <label className="am-radio">
                <input type="radio" checked={perfilAcesso === 'doctor'} onChange={() => setPerfilAcesso('doctor')} />
                Médico
              </label>
            </div>
          </div>
        </div>
        <button className="am-btn-primary" onClick={handleVincularClinico} disabled={vinculandoClinico}>
          {vinculandoClinico ? <Loader2 size={16} className="am-spin" /> : 'Vincular e Aplicar Acesso'}
        </button>
      </div>

      <div className="am-card">
        <h2 className="am-section-title">Criar Acesso BPO</h2>
        <div className="am-grid-3">
          <div className="am-column">
            <h3 className="am-column-title"><User size={16} /> Pessoa</h3>
            <div className="am-search-wrap">
              <Search size={14} className="am-search-icon" />
              <input
                className="am-search-input"
                placeholder="pesquisar pessoa..."
                value={buscaPessoaBpo}
                onChange={(e) => { setBuscaPessoaBpo(e.target.value); setPessoaSelecionadaBpo(null); }}
              />
            </div>
            {pessoaSelecionadaBpo ? (
              <span className="am-chip am-chip--selected">{pessoaSelecionadaBpo.name}</span>
            ) : (
              pessoasBpo.map((p) => (
                <button key={p.id} className="am-chip" onClick={() => { setPessoaSelecionadaBpo(p); setBuscaPessoaBpo(p.name); }}>
                  {p.name}
                </button>
              ))
            )}
          </div>

          <div className="am-column">
            <h3 className="am-column-title"><Mail size={16} /> Email</h3>
            <input
              className="am-input"
              type="email"
              placeholder="teste@e-mail.com"
              value={emailBpo}
              onChange={(e) => setEmailBpo(e.target.value)}
            />
          </div>

          <div className="am-column">
            <h3 className="am-column-title"><Lock size={16} /> Senha</h3>
            <input
              className="am-input"
              type="password"
              placeholder="********"
              value={senhaBpo}
              onChange={(e) => setSenhaBpo(e.target.value)}
            />
          </div>
        </div>
        <button className="am-btn-primary" onClick={handleVincularBpo} disabled={vinculandoBpo}>
          {vinculandoBpo ? <Loader2 size={16} className="am-spin" /> : 'Vincular e Aplicar Acesso'}
        </button>
      </div>

      <div className="am-card">
        <h2 className="am-section-title">Cadastrar Nova Pessoa</h2>
        <div className="am-form-grid">
          <input className="am-input" placeholder="Nome completo" value={personForm.name} onChange={(e) => handlePersonFieldChange('name', e.target.value)} />
          <input className="am-input" placeholder="Telefone" value={personForm.phone} onChange={(e) => handlePersonFieldChange('phone', e.target.value)} />
          <input className="am-input" placeholder="Gênero" value={personForm.gender} onChange={(e) => handlePersonFieldChange('gender', e.target.value)} />
          <input className="am-input" placeholder="CPF" value={personForm.cpf} onChange={(e) => handlePersonFieldChange('cpf', e.target.value)} />
          <input className="am-input" placeholder="Rua" value={personForm.street} onChange={(e) => handlePersonFieldChange('street', e.target.value)} />
          <input className="am-input" placeholder="Nº" value={personForm.number} onChange={(e) => handlePersonFieldChange('number', e.target.value)} />
          <input className="am-input" placeholder="Complemento" value={personForm.complement} onChange={(e) => handlePersonFieldChange('complement', e.target.value)} />
          <input className="am-input" placeholder="Cidade" value={personForm.city} onChange={(e) => handlePersonFieldChange('city', e.target.value)} />
          <input className="am-input" placeholder="Estado" value={personForm.state} onChange={(e) => handlePersonFieldChange('state', e.target.value)} />
          <button className="am-btn-primary" onClick={handleCadastrarPessoa} disabled={cadastrandoPessoa}>
            {cadastrandoPessoa ? <Loader2 size={16} className="am-spin" /> : 'Cadastrar Pessoa'}
          </button>
        </div>
      </div>

      <div className="am-card">
        <h2 className="am-section-title">Usuários e Níveis de Acesso Atribuídos</h2>
        <div className="am-table-header">
          <span>ID Usuário</span>
          <span>Clínica Associada</span>
          <span>Status</span>
          <span>Ações</span>
        </div>
        <div className="am-table-body">
          {users.map((u) => (
            <div key={u.id} className="am-table-row">
              <span>{u.id}</span>
              <span>{u.clinic_name}</span>
              <span className={`am-status am-status--${u.status}`}>{u.status === 'active' ? 'Ativa' : 'Inativa'}</span>
              <span>
                <button
                  className={u.status === 'active' ? 'am-btn-danger' : 'am-btn-success'}
                  onClick={() => handleToggleUser(u.id)}
                >
                  {u.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>
              </span>
            </div>
          ))}
        </div>
        <div className="am-pagination">
          Anterior | <span className="am-page am-page--active">1</span> 2 3 ... 10 | Próximo
        </div>
      </div>
    </div>
  );
};

export default AccessManagement;
