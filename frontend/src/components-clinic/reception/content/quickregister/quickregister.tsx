import React, { useState } from 'react';
import './quickregister.css';
import { Loader2 } from 'lucide-react';
import {
  quickRegisterPatient,
  lookupCep,
  type QuickRegisterData,
} from '../../../../services/receptionService';

// Estado inicial do formulário — facilita o reset no "Limpar"
const EMPTY: QuickRegisterData = {
  fullName: '',
  cpf: '',
  birthDate: '',
  gender: 'Masculino',
  phone: '',
  isMinor: false,
  guardianCpf: '',
  guardianName: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  city: '',
  state: '',
};

// Máscara simples para CPF e telefone (aplicada no onChange)
const maskCpf   = (v: string) => v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2').slice(0,14);
const maskPhone = (v: string) => v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'($1)$2').replace(/(\d{5})(\d)/,'$1-$2').slice(0,15);
const maskCep   = (v: string) => v.replace(/\D/g,'').replace(/(\d{5})(\d)/,'$1-$2').slice(0,9);

function QuickRegister() {
  const [form, setForm]         = useState<QuickRegisterData>(EMPTY);
  const [loading, setLoading]   = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [status, setStatus]     = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const set = (field: keyof QuickRegisterData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Busca CEP e preenche campos de endereço automaticamente
  const handleCepBlur = async () => {
    const raw = form.cep.replace(/\D/g, '');
    if (raw.length !== 8) return;
    setCepLoading(true);
    try {
      const data = await lookupCep(raw);
      setForm((prev) => ({
        ...prev,
        street: data.street,
        complement: data.complement,
        city: data.city,
        state: data.state,
      }));
    } catch {
      // CEP não encontrado — usuário preenche manualmente
    } finally {
      setCepLoading(false);
    }
  };

  const handleLimpar = () => {
    setForm(EMPTY);
    setStatus(null);
  };

  const handleFinalizar = async () => {
    // Validação mínima
    if (!form.fullName || !form.cpf || !form.birthDate || !form.phone) {
      setStatus({ type: 'error', message: 'Preencha os campos obrigatórios: Nome, CPF, Data de Nascimento e Telefone.' });
      return;
    }
    if (form.isMinor && (!form.guardianCpf || !form.guardianName)) {
      setStatus({ type: 'error', message: 'Informe o CPF e o nome do responsável para pacientes menores de idade.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await quickRegisterPatient(form);
      setStatus({ type: 'success', message: `Paciente cadastrado com sucesso! ID: ${res.patientId}` });
      setForm(EMPTY);
    } catch {
      setStatus({ type: 'error', message: 'Não foi possível concluir o cadastro. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-container">
      <h1 className="qr-title">Cadastro Rápido de Paciente</h1>

      {status && (
        <div className={`qr-status qr-status--${status.type}`}>
          {status.message}
        </div>
      )}

      <div className="qr-card">

        {/* ─── Coluna Esquerda: Dados Pessoais ─── */}
        <div className="qr-section">
          <h2 className="qr-section-title">Dados Pessoais</h2>

          <div className="qr-field">
            <label className="qr-label">NOME COMPLETO</label>
            <input
              className="qr-input qr-input--full"
              type="text"
              placeholder="Nome do Paciente"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
            />
          </div>

          <div className="qr-field">
            <label className="qr-label">CPF</label>
            <input
              className="qr-input qr-input--full"
              type="text"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={(e) => set('cpf', maskCpf(e.target.value))}
              maxLength={14}
            />
          </div>

          <div className="qr-row">
            <div className="qr-field">
              <label className="qr-label">DATA DE NASCIMENTO</label>
              <input
                className="qr-input"
                type="text"
                placeholder="DD/MM/AAAA"
                value={form.birthDate}
                onChange={(e) => set('birthDate', e.target.value)}
                maxLength={10}
              />
            </div>

            <div className="qr-field">
              <label className="qr-label">GÊNERO</label>
              <select
                className="qr-input qr-select"
                value={form.gender}
                onChange={(e) => set('gender', e.target.value)}
              >
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
              </select>
            </div>
          </div>

          <div className="qr-field">
            <label className="qr-label">TELEFONE</label>
            <input
              className="qr-input qr-input--full"
              type="text"
              placeholder="(00)00000-0000"
              value={form.phone}
              onChange={(e) => set('phone', maskPhone(e.target.value))}
              maxLength={15}
            />
          </div>

          <div className="qr-field qr-field--checkbox">
            <input
              id="isMinor"
              type="checkbox"
              checked={form.isMinor}
              onChange={(e) => set('isMinor', e.target.checked)}
            />
            <label htmlFor="isMinor" className="qr-label-checkbox">
              Paciente é menor de idade (requer responsável)
            </label>
          </div>

          {form.isMinor && (
            <div className="qr-row qr-row--animate">
              <div className="qr-field">
                <label className="qr-label">CPF (Responsável)</label>
                <input
                  className="qr-input"
                  type="text"
                  placeholder="000.000.000-00"
                  value={form.guardianCpf ?? ''}
                  onChange={(e) => set('guardianCpf', maskCpf(e.target.value))}
                  maxLength={14}
                />
              </div>
              <div className="qr-field">
                <label className="qr-label">NOME (Responsável)</label>
                <input
                  className="qr-input"
                  type="text"
                  placeholder="Nome do responsável"
                  value={form.guardianName ?? ''}
                  onChange={(e) => set('guardianName', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* ─── Coluna Direita: Endereço ─── */}
        <div className="qr-section">
          <h2 className="qr-section-title">Endereço Completo</h2>

          <div className="qr-field">
            <label className="qr-label">CEP</label>
            <div className="qr-cep-wrapper">
              <input
                className="qr-input qr-input--full"
                type="text"
                placeholder="00000-000"
                value={form.cep}
                onChange={(e) => set('cep', maskCep(e.target.value))}
                onBlur={handleCepBlur}
                maxLength={9}
              />
              {cepLoading && <Loader2 size={16} className="qr-cep-spin" />}
            </div>
          </div>

          <div className="qr-row">
            <div className="qr-field qr-field--grow">
              <label className="qr-label">RUA/LOGRADOURO</label>
              <input
                className="qr-input"
                type="text"
                placeholder="Rua, Av..."
                value={form.street}
                onChange={(e) => set('street', e.target.value)}
              />
            </div>
            <div className="qr-field qr-field--sm">
              <label className="qr-label">NÚMERO</label>
              <input
                className="qr-input"
                type="text"
                placeholder="123"
                value={form.number}
                onChange={(e) => set('number', e.target.value)}
              />
            </div>
          </div>

          <div className="qr-field">
            <label className="qr-label">COMPLEMENTO/BAIRRO</label>
            <input
              className="qr-input qr-input--full"
              type="text"
              placeholder="Apto, Sala, Nome do Bairro"
              value={form.complement}
              onChange={(e) => set('complement', e.target.value)}
            />
          </div>

          <div className="qr-row">
            <div className="qr-field qr-field--grow">
              <label className="qr-label">CIDADE</label>
              <input
                className="qr-input"
                type="text"
                placeholder="Betim"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </div>
            <div className="qr-field qr-field--sm">
              <label className="qr-label">UF</label>
              <input
                className="qr-input"
                type="text"
                placeholder="MG"
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
                maxLength={2}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Botões */}
      <div className="qr-actions">
        <button className="qr-btn qr-btn--clear" onClick={handleLimpar} disabled={loading}>
          Limpar
        </button>
        <button className="qr-btn qr-btn--submit" onClick={handleFinalizar} disabled={loading}>
          {loading ? <Loader2 size={18} className="qr-spin" /> : 'Finalizar'}
        </button>
      </div>

    </div>
  );
}

export default QuickRegister;
