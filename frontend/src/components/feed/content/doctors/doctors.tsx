import React, { useEffect, useState } from 'react';
import { Search, Loader2, UserX } from 'lucide-react';
import { getMyDoctors, type MyDoctor } from '../../../../services/patientService';
import './doctors.css';

export const Doctors = () => {
  const [busca, setBusca] = useState('');
  const [medicos, setMedicos] = useState<MyDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);
    getMyDoctors()
      .then(setMedicos)
      .catch(() => setErro('Não foi possível carregar seus médicos.'))
      .finally(() => setLoading(false));
  }, []);

  // Filtra os médicos pelo nome ou localização conforme o usuário digita
  const medicosFiltrados = medicos.filter(medico =>
    medico.name.toLowerCase().includes(busca.toLowerCase()) ||
    medico.location.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="dr-container">
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

      {erro && <p className="dr-erro">{erro}</p>}

      {loading ? (
        <div className="dr-loading">
          <Loader2 size={32} className="dr-spin" />
          <p>Carregando médicos...</p>
        </div>
      ) : (
        <div className="dr-grid">
          {medicosFiltrados.length > 0 ? (
            medicosFiltrados.map((medico) => (
              <div key={medico.id} className="dr-card">
                <div className="dr-info-container">
                  <div className="dr-textos">
                    <h3 className="dr-medico-nome">{medico.name} - {medico.specialty}</h3>
                    <p className="dr-medico-local">{medico.clinic} - {medico.location}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="dr-vazio">
              <UserX size={48} color="#d1d5db" />
              <p>{busca ? 'Nenhum médico encontrado para sua busca.' : 'Você ainda não tem médicos cadastrados.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Doctors;