import React, { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import './clinicManagement.css';
import {
  listClinics,
  createClinic,
  type Clinic,
  type NewClinicData,
} from '../../../../services/clinixService';

const initialForm: NewClinicData = {
  trade_name: '',
  legal_name: '',
  phone: '',
  cnpj: '',
  street: '',
  number: '',
  complement: '',
  city: '',
  state: '',
  services: '',
};

export const ClinicManagement = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState<NewClinicData>(initialForm);

  useEffect(() => {
    setLoading(true);
    listClinics()
      .then(setClinics)
      .catch(() => setErro('Não foi possível carregar as clínicas.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof NewClinicData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCadastrar = async () => {
    if (!form.trade_name || !form.legal_name || !form.cnpj) {
      setErro('Preencha ao menos Nome fantasia, Razão social e CNPJ.');
      return;
    }
    setSubmitting(true);
    setErro(null);
    try {
      const novaClinica = await createClinic(form);
      setClinics((prev) => [...prev, novaClinica]);
      setForm(initialForm);
    } catch {
      setErro('Não foi possível cadastrar a clínica. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtradas = clinics.filter(
    (c) =>
      c.trade_name.toLowerCase().includes(busca.toLowerCase()) ||
      c.id.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="cm-container">
      <h1 className="cm-title">Gestão de Clínicas</h1>

      <div className="cm-card">
        <h2 className="cm-section-title">Novo Cadastro e Configuração de Clínicas</h2>
        {erro && <p className="cm-erro">{erro}</p>}
        <div className="cm-form-grid">
          <input className="cm-input" placeholder="Nome fantasia" value={form.trade_name} onChange={(e) => handleChange('trade_name', e.target.value)} />
          <input className="cm-input" placeholder="Razão social" value={form.legal_name} onChange={(e) => handleChange('legal_name', e.target.value)} />
          <input className="cm-input" placeholder="Telefone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          <input className="cm-input" placeholder="CNPJ" value={form.cnpj} onChange={(e) => handleChange('cnpj', e.target.value)} />
          <input className="cm-input" placeholder="Rua" value={form.street} onChange={(e) => handleChange('street', e.target.value)} />
          <input className="cm-input" placeholder="Nº" value={form.number} onChange={(e) => handleChange('number', e.target.value)} />
          <input className="cm-input" placeholder="Complemento" value={form.complement} onChange={(e) => handleChange('complement', e.target.value)} />
          <input className="cm-input" placeholder="Cidade" value={form.city} onChange={(e) => handleChange('city', e.target.value)} />
          <input className="cm-input" placeholder="Estado" value={form.state} onChange={(e) => handleChange('state', e.target.value)} />
          <input className="cm-input" placeholder="Serviços" value={form.services} onChange={(e) => handleChange('services', e.target.value)} />
          <button className="cm-btn-primary" onClick={handleCadastrar} disabled={submitting}>
            {submitting ? <Loader2 size={16} className="cm-spin" /> : 'Cadastrar Clínica'}
          </button>
        </div>
      </div>

      <div className="cm-card">
        <div className="cm-list-header">
          <h2 className="cm-section-title">Listagem de Clínicas e Status de Gerenciamento</h2>
          <div className="cm-search-wrap">
            <Search size={16} className="cm-search-icon" />
            <input
              className="cm-search-input"
              placeholder="pesquisar clínica..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="cm-loading"><Loader2 size={28} className="cm-spin" /></div>
        ) : (
          <>
            <div className="cm-table-header">
              <span>ID Clínica</span>
              <span>Nome da Clínica</span>
              <span>Endereço / Unidade</span>
              <span>Serviços</span>
              <span>Status</span>
              <span>Ações</span>
            </div>
            <div className="cm-table-body">
              {filtradas.map((c) => (
                <div key={c.id} className="cm-table-row">
                  <span>{c.id}</span>
                  <span>{c.trade_name}</span>
                  <span>{`${c.street}, ${c.number} - ${c.city}/${c.state}`}</span>
                  <span>{c.services}</span>
                  <span className={`cm-status cm-status--${c.status}`}>
                    {c.status === 'active' ? 'Ativa' : 'Inativa'}
                  </span>
                  <span><button className="cm-btn-config">Ver Config.</button></span>
                </div>
              ))}
            </div>
            <div className="cm-pagination">
              Anterior | <span className="cm-page cm-page--active">1</span> 2 3 ... 10 | Próximo
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClinicManagement;
