# ADR 020 – Relacionamento N:M entre Médicos e Especialidades via Tabela Intermediária

## Status
Definido

## Contexto
O sistema Clinix necessita modelar que um médico pode atuar em múltiplas especialidades e que cada especialidade pode ter múltiplos médicos. Além disso, o sistema deseja manter um cadastro centralizado de especialidades médicas para padrão e reutilização.

A equipe optou por uma abordagem com tabela intermediária explícita (DoctorSpecialty) em vez de abordagem implícita (secondary), facilitando:
- Auditoria clara de qual médico atua em qual especialidade
- Possível adição de atributos futuros (certificação, data de certificação, etc.)
- Queries eficientes com índices específicos
- Impossibilidade de registrar a mesma especialidade para um médico duas vezes

## Decisão

### Estrutura de Dados
- **MedicalSpecialty**: Tabela de especialidades
  - Nome único
  - Relacionamento N:M com Doctor via DoctorSpecialty
  - Exemplos: Cardiologia, Pediatria, Ortopedia, etc.

- **DoctorSpecialty**: Tabela intermediária explícita
  - FK `doctor_id` + FK `specialty_id`
  - Unique constraint: `(doctor_id, specialty_id)` previne duplicatas
  - Índices em ambas as colunas para queries eficientes
  - Sem dados adicionais por enquanto (preparado para extensão futura)

- **Doctor**: Integrado com especialidades
  - Relacionamento `specialties` (N:M via DoctorSpecialty)
  - Um médico deve ter pelo menos uma especialidade (não validado em modelo, cabe ao service)

### Regras de Negócio Implementadas
1. Um médico pode ter múltiplas especialidades
2. Uma especialidade pode ter múltiplos médicos
3. Um médico não pode ter a mesma especialidade registrada duas vezes
4. Especialidades são globais (não específicas de clínica)
5. MedicalAppointment não faz referência direta a especialidade (implícita via Doctor)

## Consequências

### Positivas
- Modelo claro e explícito (não usa SQLAlchemy `secondary` implícito)
- Flexível para adicionar atributos futuros (certificação, ano de especialização, etc.)
- Queries otimizadas com índices em ambas as FKs
- Impossibilidade de duplicação (unique constraint)
- Auditoria clara

### Negativas
- Requer uma tabela adicional em comparação com abordagem `secondary`
- Join adicional em queries que buscam especialidades de médicos

### Operacionais
- Criação de médico não requer especialidades imediatamente (podem ser adicionadas depois)
- Mudança de especialidade de médico é operação simples (insert/delete em DoctorSpecialty)
- Exclusão de especialidade requer cuidado (cascata para médicos)

## Relationship com MedicalAppointment
- MedicalAppointment referencia Doctor, não especialidade diretamente
- Especialidade de uma consulta é inferida pela especialidade(s) do médico
- Isso garante que especialidades não ficam obsoletas em histórico de consultas

## Rastreabilidade de Código
- `MedicalSpecialty`: `backend/app/models/medical_specialty.py`
- `DoctorSpecialty`: `backend/app/models/doctor_specialty.py`
- `Doctor`: `backend/app/models/doctor.py`
