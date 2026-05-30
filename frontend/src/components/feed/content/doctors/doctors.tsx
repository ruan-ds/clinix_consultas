import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import './doctors.css';

// Dados falsos para popular a lista
const doctorsMock = [
  { id: 1, name: 'Dr. Marcos Paulo', specialty: 'Cardiologista', clinic: 'Clínica Pró Saúde', location: 'Betim/MG' },
  { id: 2, name: 'Dr. Marcos Paulo', specialty: 'Cardiologista', clinic: 'Clínica Pró Saúde', location: 'São Paulo/SP' },
  { id: 3, name: 'Dr. Marcos Paulo', specialty: 'Cardiologista', clinic: 'Clínica Pró Saúde', location: 'Rio de Janeiro/RJ' },
  { id: 4, name: 'Dr. Marcos Paulo', specialty: 'Cardiologista', clinic: 'Clínica Pró Saúde', location: 'Porto Alegre/RS' },
];

export const Doctors = () => {
  const [busca, setBusca] = useState('');

  // Filtra os médicos pelo nome conforme o usuário digita
  const medicosFiltrados = doctorsMock.filter(medico =>
    medico.name.toLowerCase().includes(busca.toLowerCase()) ||
    medico.location.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="dr-container">
      {/* Cabeçalho com Título e Pesquisa alinhados como no seu print */}
      <div className="dr-header">
        <h1 className="dr-title">Meus Médicos</h1>
        
        <div className="dr-search-container">
          <input
            type="text"
            className="dr-search-input"
            placeholder="Buscar médicos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Search className="dr-search-icon" size={20} />
        </div>
      </div>

      {/* Grid de Cards dos Médicos */}
      <div className="dr-grid">
        {medicosFiltrados.length > 0 ? (
          medicosFiltrados.map((medico) => (
            <div key={medico.id} className="dr-card">
              {/* Informações e Botões */}
              <div className="dr-info-container">
                <div className="dr-textos">
                  <h3 className="dr-medico-nome">{medico.name} - {medico.specialty}</h3>
                  <p className="dr-medico-local">{medico.clinic} - {medico.location}</p>
                </div>

                <div className="dr-actions">
                  <button className="dr-btn-perfil">Ver Perfil</button>
                  <button className="dr-btn-servicos">Consulta/Serviços</button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <p className="dr-vazio">Nenhum médico encontrado para sua busca.</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;