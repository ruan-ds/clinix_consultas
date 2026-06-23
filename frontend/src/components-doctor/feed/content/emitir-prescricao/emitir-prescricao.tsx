import React, { useState } from 'react';
import './emitir-prescricao.css';

interface EmitirPrescricaoProps {
  setTelaAtiva: (id: number) => void;
}

function EmitirPrescricao({ setTelaAtiva }: EmitirPrescricaoProps) {
  const [cpf, setCpf] = useState('');
  const [prescricao, setPrescricao] = useState('');

  const formatarCpf = (valor: string) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    return numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatarCpf(e.target.value));
  };

  const handleSubmit = () => {
    // Pronto para receber integração com o backend
    console.log('CPF:', cpf);
    console.log('Prescrição:', prescricao);
  };

  return (
    <div className="emitir-container">
      <header className="emitir-header">
        <h2>EMISSÃO DE RECEITUÁRIO E ORIENTAÇÕES</h2>
      </header>

      <div className="emitir-cpf-row">
        <input
          type="text"
          placeholder="Pesquisar CPF..."
          value={cpf}
          onChange={handleCpfChange}
          className="emitir-input-cpf"
          maxLength={14}
        />
      </div>

      <div className="emitir-card">
        <h3 className="emitir-card-title">ANOTAÇÃO DA PRESCRIÇÃO</h3>
        <textarea
          className="emitir-textarea"
          placeholder="Digite a prescrição..."
          value={prescricao}
          onChange={(e) => setPrescricao(e.target.value)}
          rows={10}
        />
        <div className="emitir-card-footer">
          <button className="emitir-btn-confirmar" onClick={handleSubmit}>
            Confirmar e Emitir Prescrição
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmitirPrescricao;
