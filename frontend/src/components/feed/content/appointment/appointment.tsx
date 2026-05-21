import React, { useState } from 'react';
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
  // Estado para controlar se a requisição está acontecendo (evita múltiplos cliques)
  const [carregandoId, setCarregandoId] = useState<string | null>(null);

  // Função que será disparada ao clicar no botão
  const handleSelectEspecialidade = async (id: string) => {
    setCarregandoId(id);
    
    try {
      // Aqui você coloca a URL real da sua API
      console.log(`Enviando requisição para: /api/medicos?especialidade=${id}`);
      
      /* EXEMPLO DE REQUISIÇÃO REAL:
      const response = await fetch(`http://localhost:3000/api/medicos?especialidade=${id}`);
      const data = await response.json();
      
      // Depois de receber os dados, você provavelmente vai querer 
      // salvar isso num estado global ou passar para a próxima tela (Etapa 2)
      console.log('Médicos retornados:', data);
      */

      // Simulando um delay de requisição apenas para teste (pode apagar depois)
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('Erro ao buscar médicos da especialidade:', error);
      // Aqui você pode colocar um toast ou alerta de erro para o usuário
    } finally {
      setCarregandoId(null);
    }
  };

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
            const isCarregando = carregandoId === especialidade.id;
            
            return (
              <button 
                key={especialidade.id} 
                className="ac-card"
                onClick={() => handleSelectEspecialidade(especialidade.id)}
                disabled={carregandoId !== null} // Desabilita todos os botões enquanto carrega
                style={{ opacity: carregandoId !== null && !isCarregando ? 0.6 : 1 }}
              >
                <div className="ac-card-content">
                  <div className="ac-icon-container">
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>
                  <span className="ac-card-title">
                    {isCarregando ? 'Buscando...' : especialidade.nome}
                  </span>
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