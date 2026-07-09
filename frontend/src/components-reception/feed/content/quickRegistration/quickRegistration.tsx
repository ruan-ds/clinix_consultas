import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import './quickRegistration.css';
import { registerPatient, type RegisterPatientData } from '../../../../services/receptionService';

const initialForm: RegisterPatientData = {
  name: '',
  cpf: '',
  birth_date: '',
  gender: 'Masculino',
  phone: '',
  is_minor: false,
  guardian_cpf: '',
  guardian_name: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  city: '',
  state: '',
};

const formatCpf = (v: string) =>
  v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const formatPhone = (v: string) =>
  v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1)$2').replace(/(\d{5})(\d)/, '$1-$2');

const formatCep = (v: string) =>
  v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

export const QuickRegistration = () => {
  const [form, setForm] = useState<RegisterPatientData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (field: keyof RegisterPatientData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErro(null);
    setSucesso(false);
  };

  const handleCepBlur = async () => {
    const cepLimpo = form.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          street: data.logradouro || '',
          city: data.localidade || '',
          state: data.uf || '',
          complement: data.complemento || prev.complement,
        }));
      }
    } catch {
      // falha silenciosa — usuário preenche manualmente
    }
  };

  const handleLimpar = () => {
    setForm(initialForm);
    setErro(null);
    setSucesso(false);
  };

  const handleFinalizar = async () => {
    if (!form.name || !form.cpf || !form.birth_date || !form.phone) {
      setErro('Preencha todos os campos obrigatórios: Nome, CPF, Data de Nascimento e Telefone.');
      return;
    }
    if (form.is_minor && (!form.guardian_cpf || !form.guardian_name)) {
      setErro('Para menores de idade, informe CPF e Nome do responsável.');
      return;
    }
    setLoading(true);
    setErro(null);
    try {
      await registerPatient(form);
      setSucesso(true);
      setForm(initialForm);
    } catch {
      setErro('Não foi possível cadastrar o paciente. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cr-container">
      <h1 className="cr-title">Cadastro Rápido de Paciente</h1>

      {sucesso && (
        <div className="cr-sucesso">
          ✓ Paciente cadastrado com sucesso!
        </div>
      )}
      {erro && <p className="cr-erro">{erro}</p>}

      <div className="cr-card">
        <div className="cr-two-col">
          {/* ─── Dados Pessoais ─── */}
          <section>
            <h2 className="cr-section-title">Dados Pessoais</h2>

            <div className="cr-field">
              <label className="cr-label">NOME COMPLETO</label>
              <input
                className="cr-input"
                type="text"
                placeholder="Nome do Paciente"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="cr-field">
              <label className="cr-label">CPF</label>
              <input
                className="cr-input"
                type="text"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) => handleChange('cpf', formatCpf(e.target.value))}
              />
            </div>

            <div className="cr-row">
              <div className="cr-field">
                <label className="cr-label">DATA DE NASCIMENTO</label>
                <input
                  className="cr-input"
                  type="date"
                  value={form.birth_date}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                />
              </div>
              <div className="cr-field">
                <label className="cr-label">GÊNERO</label>
                <select
                  className="cr-input cr-select"
                  value={form.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option>Masculino</option>
                  <option>Feminino</option>
                  <option>Outro</option>
                  <option>Prefiro não informar</option>
                </select>
              </div>
            </div>

            <div className="cr-field">
              <label className="cr-label">TELEFONE</label>
              <input
                className="cr-input"
                type="text"
                placeholder="(00)00000-0000"
                value={form.phone}
                onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
              />
            </div>

            <div className="cr-checkbox-row">
              <input
                type="checkbox"
                id="is_minor"
                checked={form.is_minor}
                onChange={(e) => handleChange('is_minor', e.target.checked)}
              />
              <label htmlFor="is_minor" className="cr-checkbox-label">
                Paciente é menor de idade (requer responsável)
              </label>
            </div>

            {form.is_minor && (
              <div className="cr-row">
                <div className="cr-field">
                  <label className="cr-label">CPF (Responsável)</label>
                  <input
                    className="cr-input"
                    type="text"
                    placeholder="000.000.000-00"
                    value={form.guardian_cpf || ''}
                    onChange={(e) => handleChange('guardian_cpf', formatCpf(e.target.value))}
                  />
                </div>
                <div className="cr-field">
                  <label className="cr-label">NOME (Responsável)</label>
                  <input
                    className="cr-input"
                    type="text"
                    placeholder="Nome do responsável"
                    value={form.guardian_name || ''}
                    onChange={(e) => handleChange('guardian_name', e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>

          {/* ─── Endereço Completo ─── */}
          <section>
            <h2 className="cr-section-title">Endereço Completo</h2>

            <div className="cr-field">
              <label className="cr-label">CEP</label>
              <input
                className="cr-input"
                type="text"
                placeholder="00000-000"
                value={form.cep}
                onChange={(e) => handleChange('cep', formatCep(e.target.value))}
                onBlur={handleCepBlur}
              />
            </div>

            <div className="cr-row">
              <div className="cr-field cr-field--grow">
                <label className="cr-label">RUA/LOGRADOURO</label>
                <input
                  className="cr-input"
                  type="text"
                  placeholder="Rua, Av..."
                  value={form.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                />
              </div>
              <div className="cr-field cr-field--small">
                <label className="cr-label">NÚMERO</label>
                <input
                  className="cr-input"
                  type="text"
                  placeholder="123"
                  value={form.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                />
              </div>
            </div>

            <div className="cr-field">
              <label className="cr-label">COMPLEMENTO/BAIRRO</label>
              <input
                className="cr-input"
                type="text"
                placeholder="Apto, Sala, Nome do Bairro"
                value={form.complement || ''}
                onChange={(e) => handleChange('complement', e.target.value)}
              />
            </div>

            <div className="cr-row">
              <div className="cr-field cr-field--grow">
                <label className="cr-label">CIDADE</label>
                <input
                  className="cr-input"
                  type="text"
                  placeholder="Cidade"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
              <div className="cr-field cr-field--small">
                <label className="cr-label">UF</label>
                <input
                  className="cr-input"
                  type="text"
                  placeholder="MG"
                  maxLength={2}
                  value={form.state}
                  onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="cr-actions">
              <button className="cr-btn cr-btn--outline" onClick={handleLimpar} disabled={loading}>
                Limpar
              </button>
              <button className="cr-btn cr-btn--primary" onClick={handleFinalizar} disabled={loading}>
                {loading ? <Loader2 size={18} className="cr-spin" /> : 'Finalizar'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default QuickRegistration;
