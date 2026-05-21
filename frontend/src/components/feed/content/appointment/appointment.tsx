import React from 'react';
import { 
  Search, 
  Stethoscope, 
  Heart, 
  Sparkles, 
  Venus, 
  Baby, 
  Bone, 
  ChevronRight 
} from 'lucide-react';
import './appointment.css';

interface Especialidade {
  id: string;
  nome: string;
  Icone: React.ElementType;
}

const especialidadesPopulares: Especialidade[] = [
  { id: 'clinica-geral', nome: 'Clínica Geral', Icone: Stethoscope },
  { id: 'cardiologia', nome: 'Cardiologia', Icone: Heart },
  { id: 'dermatologia', nome: 'Dermatologia', Icone: Sparkles },
  { id: 'ginecologia', nome: 'Ginecologia', Icone: Venus },
  { id: 'pediatria', nome: 'Pediatria', Icone: Baby },
  { id: 'ortopedia', nome: 'Ortopedia', Icone: Bone },
];

export const Appointment = () => {
  return (
    <div className="ac-container">
      
      {/* Cabeçalho e Barra de Progresso */}
      <div className="ac-header">
        <h1 className="ac-title">Agendar Nova Consulta</h1>
        <p className="ac-subtitle">Etapa 1 de 3: Especialidade</p>
        
        <div className="ac-progress-track">
          <div className="ac-progress-fill"></div>
        </div>
      </div>

      {/* Grid de Especialidades Populares */}
      <div className="especialidades-section">
        <h2 className="ac-section-title">Especialidades Populares</h2>
        
        <div className="ac-grid">
          {especialidadesPopulares.map((especialidade) => {
            const IconComponent = especialidade.Icone;
            
            return (
              <button key={especialidade.id} className="ac-card">
                <div className="ac-card-content">
                  <div className="ac-icon-container">
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>
                  <span className="ac-card-title">{especialidade.nome}</span>
                </div>
                <ChevronRight className="ac-arrow-icon" size={20} />
              </button>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};  

export default Appointment;